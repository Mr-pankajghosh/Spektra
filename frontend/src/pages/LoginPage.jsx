import React, { useState } from "react";
import { FileVideoCamera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SignupNavbar from "../components/SignupNavbar";
import PublicFooter from "../components/PublicFooter";
import Modal from "../components/Modal";
import AnimatedBackground from "../components/AnimatedBackground";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();
  const {fetchUser} = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  // Modal
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
  };
  const closeModal = () => {
    setModalTitle("");
    setModalContent("");
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  setIsPending(true);
  setError("");

  try {
    const res = await axiosInstance.post("/auth/login", loginData, {
      withCredentials: true,
    });

    if (res.data?.success && res.data.user) {
      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);
      await fetchUser();           

      toast.success("✅ Logged in successfully!");
     
      if (!user.isOnboarded) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    } else {
      throw new Error("Invalid login response");
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Login failed.";
    setError(errorMessage);
    toast.error(`❌ ${errorMessage}`);
  } finally {
    setIsPending(false);
  }
};


  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />

      <header className="fixed top-0 left-0 w-full z-20">
        <SignupNavbar openModal={openModal} />
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 px-4">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          {/* Left: Login Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2">
              <FileVideoCamera className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Spektra
              </span>
            </div>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold">Welcome Back</h2>
                <p className="text-sm opacity-70">
                  Log in to continue your language learning journey!
                </p>
              </div>

              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="*******"
                className="input input-bordered w-full"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>{" "}
                    Logging In...
                  </>
                ) : (
                  "Log In"
                )}
              </button>

              {/* Links Section */}
              <div className="text-center mt-4 space-y-2">
                <p className="text-sm">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
                <p className="text-sm">
                  Forgot password?{" "}
                  <Link
                    to="/forgot-password"
                    className="text-accent hover:underline"
                  >
                    Reset it
                  </Link>
                </p>
                <p className="text-sm">
                  just created account but not onboarded then refresh the page.
                </p>
                <p><b>After Login if not come to HomePage then refresh again or once Switch the Tab ...</b></p>
              </div>
            </form>
          </div>

          {/* Right illustration */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-w-md p-8 text-center">
              <img
                src="/VIDCALL.png"
                alt="Language connection"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>

      <PublicFooter openModal={openModal} />
      <Modal title={modalTitle} content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default LoginPage;
