import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  PhoneCall, 
  CalendarDays, 
  TrendingUp, 
  GraduationCap, 
  Calendar, 
  User, 
  ChevronDown, 
  Shield,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ activePage, setActivePage, onLogout, children }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all-leads', label: 'All Leads', icon: Users },
    { id: 'admin-accounts', label: 'Admin Accounts', icon: ShieldCheck },
    { id: 'telecaller-activity', label: 'Telecaller Activity', icon: PhoneCall },
    { id: 'follow-up-results', label: 'Follow-up Results', icon: CalendarDays },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  return (
    <div className="flex min-h-screen bg-[#f3f7fd] font-sans antialiased text-slate-800">
      {/* ================= LEFT SIDEBAR (EXACT MATCH) ================= */}
      <aside className="w-64 bg-gradient-to-b from-[#0052cc] via-[#005ce6] to-[#0066ff] text-white flex flex-col justify-between flex-shrink-0 shadow-xl">
        <div>
          {/* Logo & Header */}
          <div className="p-5 flex items-center gap-3 border-b border-blue-400/30">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Admission Panel</h2>
              <p className="text-[11px] text-blue-200">Super Admin</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="px-3 py-4">
            <p className="text-[10px] font-bold tracking-wider text-blue-200/80 uppercase px-3 mb-2">
              MAIN MENU
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id || (item.id === 'admin-accounts' && activePage === 'create-account');
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#1a73e8] text-white shadow-md'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Role Card Badge */}
        <div className="p-4 m-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white">Super Admin</span>
          </div>
          <p className="text-[10px] text-blue-100 leading-tight">
            Full access to view all leads and manage accounts.
          </p>
        </div>
      </aside>

      {/* ================= RIGHT MAIN WORKSPACE ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-end gap-5 shadow-xs sticky top-0 z-40">
          {/* Current Date Display (Screenshot 6 & 7) */}
          <div className="flex items-center gap-2.5 border border-slate-200 bg-slate-50/70 px-3.5 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">CURRENT DATE</p>
              <p className="text-xs font-bold text-slate-700 leading-tight mt-0.5">17 October 2026</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">Super Admin</p>
              <p className="text-[10px] text-slate-400 leading-tight">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Logout Action */}
          <button
            onClick={onLogout}
            title="Logout from Super Admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors ml-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </header>

        {/* Dynamic Body Area */}
        <main className="p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}