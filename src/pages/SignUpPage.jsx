import React, { useState } from "react";
import { signUpWithEmail, loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import NavbarComponent from "../components/NavbarComponent";
import bgImage from "../assets/3.jpg"; // ✅ Add this line to import background image

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      navigate("/"); // Redirect after successful sign-up
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* ✅ Background wallpaper */}
      <div
        className="h-screen w-screen bg-cover bg-center fixed -z-10"
        style={{ backgroundImage: `url(${'/src/assets/3.jpg'})` }}
      ></div>

      <NavbarComponent />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 bg-opacity-70 transition-all duration-300 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-green-700 dark:text-green-300 mb-6">
            Create an Account
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleEmailSignUp} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-green-500 dark:text-white"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-400"
              >
                Email address
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-green-500 dark:text-white"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-400"
              >
                Password
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-md transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-600 dark:text-gray-300 mb-2">
              Or sign up with
            </div>
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center w-full border border-gray-300 dark:border-gray-700 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FcGoogle className="text-xl mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Sign up with Google
              </span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 dark:text-green-300 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;

