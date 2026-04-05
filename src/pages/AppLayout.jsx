import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import {
    LayoutDashboard,
    ArrowRightLeft,
    TrendingUp,
    Moon,
    Sun,
    Shield,
    ChevronRight,
    ArrowLeftRight,
    Eye,
    CirclePlus
} from "lucide-react";

const Icon = {
    Logo: CirclePlus,
    Dashboard: LayoutDashboard,
    Transactions: ArrowRightLeft,
    Insights: TrendingUp,
    Moon: Moon,
    Sun: Sun,
    Shield: Shield,
    ChevronRight: ChevronRight,
    Swap: ArrowLeftRight,
    Eye: Eye,
};

const navItems = [
    { id: "dashboard", route: "/", label: "Dashboard", icon: Icon.Dashboard },
    { id: "transactions", route: "/transactions", label: "Transactions", icon: Icon.Transactions },
    { id: "insights", route: "/insights", label: "Insights", icon: Icon.Insights },
];

const userRoles = {
    admin: { label: "Admin" },
    viewer: { label: "Viewer" },
};

export default function AppLayout() {
    const { dark, toggleTheme, role, setRole } = useAppContext();
    const [showRoleMenu, setShowRoleMenu] = useState(false);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const switchRole = (r) => { setRole(r); setShowRoleMenu(false); };

    return (
        <div className="flex h-screen w-screen overflow-hidden">

            {/* Sidebar */}
            <div
                className={`fin-sidebar flex font-[Bricolage_Grotesque] flex-col w-75 shrink-0 h-full border-r border-white/5 ${dark ? "dark-mode" : ""}`}
            >
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 py-5 mb-2">
                    <img alt={`Finance Dashboard Icon`} className="w-6 h-6" src="/img.png" />
                    <span className="font-bold text-lg text-white tracking-[-0.3px]">
                        Finance Dashboard
                    </span>
                </div>

                {/* Nav links*/}
                <nav className="flex-1 px-3 space-y-0.5">
                    {navItems.map(({ route, label, icon: Icon }) => {
                        const isActive = pathname === route || (pathname === "/" && route === "/dashboard");
                        return (
                            <div
                                key={route}
                                className={`nav-item ${isActive ? "active" : ""}`}
                                onClick={() => navigate(route)}
                            >
                                <Icon size={16} />
                                {label}
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom controls */}
                <div className="px-3 pb-5 space-y-3">
                    <div className="px-1">
                        <button className="theme-pill w-full justify-between" onClick={toggleTheme}>
                            <span>{dark ? "Dark Mode" : "Light Mode"}</span>
                            <span>{dark ? <Icon.Moon size={15} /> : <Icon.Sun size={15} />}</span>
                        </button>
                    </div>

                    <div className="divider" />

                    {/* Profile + role switcher */}
                    <div className="px-1 relative">
                        {showRoleMenu && (
                            <div className="role-menu">
                                <p className="text-[10px] font-semibold tracking-[0.08em] text-white/30 px-2 pt-1 pb-1.5 uppercase">
                                    Switch Role
                                </p>
                                {Object.entries(userRoles).map(([key, val]) => (
                                    <button
                                        key={key}
                                        className={`switch-btn ${role === key ? "selected" : ""}`}
                                        onClick={() => switchRole(key)}
                                    >
                                        {key === "admin" ? <Icon.Shield size={12} /> : <Icon.Eye size={12} />}
                                        <span className="capitalize">{val.label}</span>
                                        {role === key && (
                                            <span className="ml-auto text-[9px] text-[#2ECC9A]">✓ active</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Profile card */}
                        <div
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/4 border border-white/7"
                        >
                            <div className="avatar">KA</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-semibold text-white leading-tight truncate">
                                    Kenechukwu Ajufo
                                </p>
                                <span className={`role-badge mt-1 ${role === "viewer" ? "viewer" : ""}`}>
                                    {userRoles[role].label}
                                </span>
                            </div>
                        </div>

                        {/* Change account button */}
                        <button
                            className="switch-btn mt-1.5 w-full justify-center border border-white/7 rounded-lg"
                            onClick={() => setShowRoleMenu((s) => !s)}
                        >
                            <Icon.Swap size={13} />
                            <span className="text-[11.5px]">Change Role</span>
                            <Icon.ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            <main className={`fin-root flex-1 min-w-0 h-full overflow-y-auto ${dark ? "dark-mode" : ""}`}>
                <div className="page-content font-[Bricolage_Grotesque]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
