import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileVideo2 } from "lucide-react";

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);

  
  return (
    <nav className="fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between backdrop-blur bg-white/30 dark:bg-gray-900/30 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-gradient-to-br from-primary to-secondary/80 shadow-md">
            <FileVideo2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide text-gray-900 dark:text-white">
            Spektra
          </span>
        </Link>
        

        <div className="hidden md:flex items-center gap-6 text-sm">
  <Link to="/" className="hover:text-primary">Home</Link>
  <Link to="/#about" className="hover:text-primary">About</Link>
  <Link to="/#features" className="hover:text-primary">Features</Link>
  <Link to="/#faq" className="hover:text-primary">FAQ</Link>
  <Link to="/login" className="text-sm px-3 py-2 rounded hover:bg-white/10">Login</Link>
  <Link to="/signup" className="btn btn-sm btn-primary">Sign up</Link>
</div>

        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md bg-white/10"
            aria-label="toggle menu"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 border-t border-white/10 px-4 py-4">
         <div className="flex flex-col gap-3">
  <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
  <Link to="/#about" onClick={()=>setOpen(false)}>About</Link>
  <Link to="/#features" onClick={()=>setOpen(false)}>Features</Link>
  <Link to="/#faq" onClick={()=>setOpen(false)}>FAQ</Link>
  <Link to="/login" className="mt-2" onClick={()=>setOpen(false)}>Login</Link>
  <Link to="/signup" className="btn btn-primary" onClick={()=>setOpen(false)}>Sign up</Link>
</div>

        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
