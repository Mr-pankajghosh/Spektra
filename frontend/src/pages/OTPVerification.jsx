
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import Modal from "../components/Modal";
import AnimatedBackground from "../components/AnimatedBackground";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated, setUser } = useAuth();

  const email = location.state?.email || "";
  const fullName = location.state?.fullName || "";
  const password = location.state?.password || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp,
        fullName,
        password,
      });

      if (res.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);

        toast.success("OTP verified successfully!");

        if (!res.data.user.isOnboarded) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await axiosInstance.post("/auth/resend-otp", { email });
      toast.success(res.data.message || "OTP resent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <AnimatedBackground />
      <header className="fixed top-0 left-0 w-full z-20">
        <PublicNavbar openModal={openModal} />
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 px-4">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-4xl mx-auto bg-base-100/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          {/* Left: OTP Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
            <p className="mb-4 opacity-70">
              Enter the OTP sent to <b>{email}</b>
            </p>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            <form onSubmit={handleVerify} className="space-y-5">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="input input-bordered w-full"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span> Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button className="btn btn-link text-primary" onClick={handleResendOtp} disabled={resendLoading}>
                {resendLoading ? "Resending OTP..." : "Resend OTP"}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-w-md p-8 text-center">
              <h2 className="text-xl font-semibold">Secure Your Account</h2>
              <p className="opacity-70 mt-2">
                OTP verification keeps your account safe and ensures your email is valid.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter openModal={openModal} />
      <Modal title={modalTitle} content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default OTPVerificationPage;
