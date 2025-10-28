
import { Link } from "react-router";
import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, FileVideo2Icon, LogOutIcon, UsersIcon, SettingsIcon, SearchIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = ({ openSidebar, toggleCollapse, isCollapsed }) => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout?.() || {};
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
  const handleLogoClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      openSidebar?.();
    } else {
      toggleCollapse?.();
    }
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
         
          <button
            onClick={handleLogoClick}
            className={`flex items-center gap-2 focus:outline-none ${isCollapsed ? "lg:flex" : "lg:hidden"}`}
            aria-label="Open menu / toggle sidebar"
          >
            <FileVideo2Icon className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Spektra
            </span>
           
          </button>

      
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <div className="relative ml-4 flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-sm pl-10 pr-4 rounded-full bg-base-200 border border-base-300 text-sm w-full"
                        />
                        <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    </div>
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <ThemeSelector />

          
            <button className="avatar" onClick={() => setProfileModalOpen(true)}>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-base-300">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 w-72 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            <div className="flex flex-col gap-3">
              <Link
                to="/myprofile"
                className="btn btn-outline w-full"
                onClick={() => setProfileModalOpen(false)}
              >
                My Profile
              </Link>

              <Link
                to="/friends"
                className="btn btn-outline w-full flex items-center gap-2"
                onClick={() => setProfileModalOpen(false)}
              >
                <UsersIcon className="h-4 w-4" /> Friends
              </Link>

              <Link
                to="/settings"
                className="btn btn-outline w-full flex items-center gap-2"
                onClick={() => setProfileModalOpen(false)}
              >
                <SettingsIcon className="h-4 w-4" /> Settings
              </Link>

              <button
                className="btn btn-error w-full"
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    logoutMutation?.();
                  }
                  setProfileModalOpen(false);
                }}
              >
                <LogOutIcon className="h-4 w-4" /> Logout
              </button>

              <button
                className="btn btn-ghost w-full mt-2"
                onClick={() => setProfileModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
