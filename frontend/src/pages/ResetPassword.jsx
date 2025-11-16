import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../lib/api";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import Modal from "../components/Modal";
import AnimatedBackground from "../components/AnimatedBackground";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(token, { newPassword: password });
      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatedBackground />
      </div>

      <header className="fixed top-0 left-0 w-full z-20">
        <PublicNavbar openModal={openModal} />
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 px-4">
        <div className="border border-primary/25 flex flex-col lg:flex-row 
          w-full max-w-5xl mx-auto bg-base-100/90 backdrop-blur-md
          rounded-xl shadow-lg overflow-hidden">

          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
            <p className="mb-4 opacity-70">Enter your new password below.</p>

            {error && <div className="alert alert-error mb-4">{error}</div>}
            {message && <div className="alert alert-success mb-4">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>

          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-w-md p-8 text-center">
              <h2 className="text-xl font-semibold">Secure Your Account</h2>
              <p className="opacity-70 mt-2">
                Your password will be reset and you can log in safely again.
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

export default ResetPassword;
