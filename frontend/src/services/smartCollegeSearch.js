// src/services/smartCollegeSearch.js

const GENERIC_WORDS = new Set([
  'college',
  'colleges',
  'of',
  'for',
  'and',
  'the',
  'in',
  'institute',
  'institution',
  'tamil',
  'nadu',
]);

// Regional city nicknames & domain equivalents (still matched fuzzily/phonetically)
const EQUIVALENT_GROUPS = [
  ['coimbatore', 'kovai', 'covai'],
  ['chennai', 'madras'],
  ['tiruchirappalli', 'trichy', 'tiruchy'],
  ['tirunelveli', 'nellai'],
  ['thanjavur', 'tanjore'],
  ['thoothukudi', 'tuticorin'],
  ['diploma', 'polytechnic'],
  ['iti', 'industrial'],
];

function getPhoneticKey(raw) {
  let w = raw.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return '';

  w = w
    .replace(/^kn|^gn|^pn/, 'n')
    .replace(/^wr/, 'r')
    .replace(/^ps|^x/, 's')
    .replace(/ph/g, 'f')
    .replace(/gh/g, '')
    .replace(/ck/g, 'k')
    .replace(/sch/g, 'sk')
    .replace(/sh|ch|ti(?=[aeiou])|ci(?=[aeiou])/g, 'x')
    .replace(/sc(?=[eiy])/g, 's')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/c|q/g, 'k')
    .replace(/g(?=[eiy])/g, 'j')
    .replace(/dg/g, 'j')
    .replace(/z/g, 's')
    .replace(/v/g, 'f')
    .replace(/y/g, 'i');

  const first = 'aeiou'.includes(w[0]) ? 'A' : w[0].toUpperCase();
  const rest = w
    .slice(1)
    .replace(/[aeiou]/g, '')
    .replace(/(.)\1+/g, '$1');

  return (first + rest).slice(0, 6);
}

function getEditDistance(a, b) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) dp[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      dp[i][j] =
        b[i - 1] === a[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1, dp[i - 1][j] + 1);
    }
  }
  return dp[b.length][a.length];
}

function isOrderedSubsequence(shortWord, longWord) {
  if (shortWord.length < 3 || shortWord.length >= longWord.length) return false;
  let i = 0;
  for (let j = 0; j < longWord.length && i < shortWord.length; j++) {
    if (shortWord[i] === longWord[j]) i++;
  }
  return i === shortWord.length;
}

function scoreWordPair(queryWord, targetWord) {
  if (!queryWord || !targetWord) return 0;
  if (targetWord === queryWord) return 1.0;

  if (queryWord.length >= 2 && targetWord.startsWith(queryWord)) {
    return 0.92;
  }

  if (queryWord.length >= 4 && targetWord.includes(queryWord)) {
    return 0.88;
  }

  if (queryWord.length >= 3 && targetWord.length >= 3) {
    const qSound = getPhoneticKey(queryWord);
    const tSound = getPhoneticKey(targetWord);
    if (qSound && tSound) {
      if (qSound === tSound) return 0.9;
      if (qSound.length >= 4 && tSound.startsWith(qSound)) return 0.84;
    }
  }

  if (queryWord.length >= 3) {
    const candidateSlices = [targetWord];
    if (targetWord.length > queryWord.length + 1) {
      candidateSlices.push(targetWord.slice(0, queryWord.length));
      candidateSlices.push(targetWord.slice(0, queryWord.length + 1));
    }

    let bestSim = 0;
    for (const slice of candidateSlices) {
      const dist = getEditDistance(queryWord, slice);
      const maxLen = Math.max(queryWord.length, slice.length);
      const similarity = 1 - dist / maxLen;
      if (similarity > bestSim) bestSim = similarity;
    }

    if (bestSim >= 0.66) return bestSim * 0.92;
  }

  if (
    queryWord[0] === targetWord[0] &&
    isOrderedSubsequence(queryWord, targetWord) &&
    queryWord.length / targetWord.length >= 0.5
  ) {
    return 0.72;
  }

  return 0;
}

// Expands regional nicknames & typos (e.g., "covai" / "covi" -> ["covai", "coimbatore", "kovai"])
function expandEquivalentTokens(token) {
  const expanded = new Set([token]);
  for (const group of EQUIVALENT_GROUPS) {
    const matchesGroup = group.some(
      (alias) => alias === token || (token.length >= 3 && scoreWordPair(token, alias) >= 0.72)
    );
    if (matchesGroup) {
      group.forEach((alias) => expanded.add(alias));
    }
  }
  return Array.from(expanded);
}

function extractCollegeTokens(college) {
  const rawFields = [
    college.collegeName,
    college.collegeType,
    college.city,
    college.institutionType,
    ...(college.accreditations || []),
    ...(college.courseLevels || []),
  ]
    .filter(Boolean)
    .join(' ');

  return rawFields
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2);
}

export function searchCollegesSmart(rawQuery, colleges = []) {
  const cleaned = (rawQuery || '').trim();
  if (!cleaned) {
    return { results: colleges, matchedLabel: '', isFallback: false };
  }

  const queryTokens = cleaned
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2);

  if (queryTokens.length === 0) {
    return { results: colleges, matchedLabel: '', isFallback: false };
  }

  const scoredColleges = colleges.map((college) => {
    const collegeTokens = extractCollegeTokens(college);
    let weightedScoreSum = 0;
    let totalWeight = 0;
    let bestStreamOrCityHit = '';
    let bestHitScore = 0;

    for (const qToken of queryTokens) {
      const weight = GENERIC_WORDS.has(qToken) ? 0.15 : 1.0;
      totalWeight += weight;

      const candidateQueries = expandEquivalentTokens(qToken);

      let bestTokenScore = 0;
      for (const eqToken of candidateQueries) {
        for (const cToken of collegeTokens) {
          const pairScore = scoreWordPair(eqToken, cToken);
          if (pairScore > bestTokenScore) {
            bestTokenScore = pairScore;
          }
        }
      }

      if (!GENERIC_WORDS.has(qToken) && bestTokenScore > bestHitScore) {
        const typeWords = (college.collegeType || '')
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean);
        const cityWords = (college.city || '')
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean);

        let typeScore = 0;
        let cityScore = 0;

        for (const eqToken of candidateQueries) {
          for (const tw of typeWords) {
            typeScore = Math.max(typeScore, scoreWordPair(eqToken, tw));
          }
          for (const cw of cityWords) {
            cityScore = Math.max(cityScore, scoreWordPair(eqToken, cw));
          }
        }

        if (typeScore >= 0.65 && typeScore >= cityScore) {
          bestHitScore = typeScore;
          bestStreamOrCityHit = college.collegeType;
        } else if (cityScore >= 0.72) {
          bestHitScore = cityScore;
          bestStreamOrCityHit = college.city;
        }
      }

      weightedScoreSum += bestTokenScore * weight;
    }

    const finalScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 0;
    return { college, score: finalScore, matchedLabel: bestStreamOrCityHit };
  });

  const matches = scoredColleges
    .filter((item) => item.score >= 0.58)
    .sort((a, b) => b.score - a.score);

  if (matches.length > 0) {
    const topMatch = matches[0];
    const showCorrectedLabel =
      topMatch.matchedLabel &&
      topMatch.matchedLabel.toLowerCase() !== cleaned.toLowerCase()
        ? topMatch.matchedLabel
        : '';

    return {
      results: matches.map((m) => m.college),
      matchedLabel: showCorrectedLabel,
      isFallback: false,
    };
  }

  return {
    results: colleges,
    matchedLabel: '',
    isFallback: true,
  };
}