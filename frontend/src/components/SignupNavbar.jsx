import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileVideo2Icon, MenuIcon, XIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const SignupNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md z-50">
     
      <div className="flex items-center gap-2">
        <FileVideo2Icon className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Spektra
        </span>
      </div>

     
      <div className="hidden md:flex items-center gap-6 text-">
        <Link to="/" className="hover:text-primary transition"><b>Home</b></Link>
        <Link to="/login" className="hover:text-primary transition">Login</Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg shadow hover:opacity-90 transition"
        >
          Sign Up
        </Link>
        <ThemeSelector />
      </div>

      <button className="md:hidden z-50" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {menuOpen && (
        <div className="absolute top-16 right-0 w-full bg-black/70 backdrop-blur-md flex flex-col items-center gap-4 py-6 md:hidden z-40">
          <button
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
            className="hover:text-primary transition"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
            className="hover:text-primary transition"
          >
            Login
          </button>
          <button
            onClick={() => {
              navigate("/signup");
              setMenuOpen(false);
            }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg shadow hover:opacity-90 transition"
          >
            Sign Up
          </button>
          <ThemeSelector />
        </div>
      )}
    </nav>
  );
};

export default SignupNavbar;
