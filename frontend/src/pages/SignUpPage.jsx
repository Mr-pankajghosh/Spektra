import React, { useState, useEffect } from "react";
import { FileVideoCamera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useSignUp from "../hooks/useSignup";
import PublicFooter from "../components/PublicFooter";
import Modal from "../components/Modal";
import AnimatedBackground from "../components/AnimatedBackground";
import SignupNavbar from "../components/SignupNavbar";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signupMutation, data, error, isSuccess } = useSignUp();

  const [isCreating, setIsCreating] = useState(false);

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

  const handleSignup = (e) => {
    e.preventDefault();
    setIsCreating(true); // Start spinner
    signupMutation(signupData, {
      onSettled: () => setIsCreating(false), // Stop spinner when done
    });
  };

  useEffect(() => {
    if (isSuccess && data?.email) {
      navigate("/verify-otp", {
        state: {
          email: signupData.email,
          fullName: signupData.fullName,
          password: signupData.password,
        },
      });
    }
  }, [isSuccess, data, navigate, signupData]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatedBackground />
      </div>

      <header className="fixed top-0 left-0 w-full z-20">
        <SignupNavbar openModal={openModal} />
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 px-4">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
            {/* Logo */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <FileVideoCamera className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Spektra
              </span>
            </div>

            {error && (
              <div className="alert alert-error mb-4">
                <span>
                  {error.response?.data?.message ||
                    "An error occurred. Please try again."}
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p className="text-sm opacity-70">
                  Join Spektra to explore and start your language learning journey!
                </p>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="input input-bordered w-full"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="#######"
                  className="input input-bordered w-full"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />
                <p className="text-xs opacity-70 mt-1">
                  Password must be at least 6 characters long.
                </p>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" className="checkbox checkbox-sm" required />
                  <span className="text-xs leading-tight">
                    I agree to the{" "}
                    <span
                      className="text-primary hover:underline cursor-pointer"
                      onClick={() =>
                        openModal("Terms of Service", "<p>Here will be your Terms...</p>")
                      }
                    >
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span
                      className="text-primary hover:underline cursor-pointer"
                      onClick={() =>
                        openModal("Privacy Policy", "<p>Here will be your Privacy...</p>")
                      }
                    >
                      Privacy Policy
                    </span>
                  </span>
                </label>
              </div>

              <button className="btn btn-primary w-full" type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-w-md p-8">
              <div className="relative aspect-square max-w-sm mx-auto">
                <img src="/VIDCALL.png" alt="Language Learning" className="w-full h-full" />
              </div>
              <div className="text-center space-y-3 mt-6">
                <h2 className="text-xl font-semibold">Connect With Language Partners Worldwide</h2>
                <p className="opacity-70">
                  Spektra connects learners with native speakers around the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter openModal={openModal} />
      <Modal title={modalTitle} content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default SignUpPage;
