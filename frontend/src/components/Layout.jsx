
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


const Layout = ({ children, showSidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [collapsed, setCollapsed] = useState(false); 

  const desktopMarginClass = showSidebar ? (collapsed ? "lg:ml-20" : "lg:ml-64") : "";

  return (
    <div className="min-h-screen flex bg-base-100">
      {showSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={collapsed}
          setIsCollapsed={setCollapsed}
        />
      )}

      <div className={`flex-1 flex flex-col transition-all duration-200 ${desktopMarginClass}`}>
        <Navbar
          openSidebar={() => setSidebarOpen(true)}
          toggleCollapse={() => setCollapsed((s) => !s)}
          isCollapsed={collapsed}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
