import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  HomeIcon,
  UsersIcon,
  BellIcon,
  Gamepad2Icon,
  Layers3Icon,
  GlobeIcon,
  StarIcon,
  FileVideo2Icon,
  ChevronLeft,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, isCollapsed, setIsCollapsed }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const pathname = location?.pathname || "";

  const navItems = [
    { to: "/", label: "Home", icon: <HomeIcon className="w-5 h-5 opacity-80" /> },
    { to: "/friends", label: "Friends", icon: <UsersIcon className="w-5 h-5 opacity-80" /> },
    { to: "/notifications", label: "Notifications", icon: <BellIcon className="w-5 h-5 opacity-80" /> },
    { to: "/contests", label: "Contests", icon: <Gamepad2Icon className="w-5 h-5 opacity-80" /> },
    { to: "/communities", label: "Communities", icon: <Layers3Icon className="w-5 h-5 opacity-80" /> },
    { to: "/news", label: "Local News", icon: <GlobeIcon className="w-5 h-5 opacity-80" /> },
    { to: "/my-communities", label: "My Communities", icon: <StarIcon className="w-5 h-5 opacity-80" /> },
  ];

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-base-200 border-r border-base-300 flex flex-col transition-all duration-300
          ${isCollapsed ? "w-20" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        aria-hidden={typeof window !== "undefined" && window.innerWidth < 1024 ? (!isOpen) : false}
      >
        <div className="p-5 border-b border-base-300 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <FileVideo2Icon className="w-8 h-8 text-primary" />
            {!isCollapsed && (
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Spektra
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed((s) => !s)}
            className="hidden lg:inline-flex items-center justify-center absolute right-[-14px] top-4 w-9 h-9 rounded-full bg-base-200 border border-base-300 shadow-sm"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={onClose}
            className="lg:hidden btn btn-ghost btn-sm"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose} 
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                pathname === to ? "btn-active" : ""
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
              {!isCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-base-300 mt-auto">
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="avatar">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-semibold text-sm">{authUser?.fullName || "Guest"}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success inline-block" />
                  Online
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
