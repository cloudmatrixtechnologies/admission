import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../users/userModel.mjs";
import loginSchema from "./loginSchema.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "15m";

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
    };
}

export async function loginController(req, res) {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid login details.",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        if (!JWT_SECRET || JWT_SECRET.length < 32) {
            console.error("JWT_SECRET is missing or too short.");

            return res.status(500).json({
                success: false,
                message: "Authentication service is temporarily unavailable.",
            });
        }

        const { mobile_number, country, password } = result.data;

        let normalizedMobile;

        try {
            normalizedMobile = normalizeMobile(mobile_number, country);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number or country selection.",
            });
        }

        const user = await User.findOne({
            mobile_number: normalizedMobile,
        }).select("+password_hash");

        // Use the same response for unknown numbers and incorrect passwords.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number or password.",
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "This account is not available for login.",
            });
        }

        if (!user.mobile_verified_at) {
            return res.status(403).json({
                success: false,
                message: "Mobile verification is required.",
            });
        }

        const token = jwt.sign(
            {
                sub: user._id.toString(),
                role: user.role,
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN,
                issuer: "admission-panel-api",
                audience: "admission-panel-client",
            }
        );

        res.cookie("token", token, getCookieOptions());

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id.toString(),
                mobile_number: user.mobile_number,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to complete login right now.",
        });
    }
}
