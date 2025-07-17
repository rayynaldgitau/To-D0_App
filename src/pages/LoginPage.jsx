import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import NavbarComponent from "../components/NavbarComponent";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password cannot blank!");
      return;
    }

    try {
      await loginWithEmail(email, password);
      toast.success("Login success!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid authentication!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Login via google successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Google login error");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <>
      <div className="h-screen w-screen bg-cover bg-center fixed -z-10" style={{ backgroundImage: `url('/src/assets/3.jpg')` }}></div>
      
        <NavbarComponent />
     
<div className="flex flex-col items-center justify-center min-h-screen ">
  <div className="w-[350px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)] rounded-[10px] p-[20px] box-border">
    <h1 className="text-[28px] font-extrabold text-center font-sans mb-[30px] text-green-800">
      Please login!
    </h1>

    <form className="flex flex-col gap-[18px] mb-[15px]" onSubmit={handleEmailLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-[20px] border border-[#c0c0c0] outline-none box-border px-[15px] py-[12px]"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-[20px] border border-[#c0c0c0] outline-none box-border px-[15px] py-[12px]"
      />

      <button
        type="submit"
        className="
          font-semibold 
          text-[1.35rem] 
          text-[#242424] 
          bg-[#ccf5cc] 
          rounded-[0.5em] 
          px-[1em] 
          py-[0.375em] 
          shadow-[inset_0_0.0625em_0_0_#d7f9d7,0_0.0625em_0_0_#c6f1c6,0_0.125em_0_0_#bff0bf,0_0.25em_0_0_#b3e6b3,0_0.3125em_0_0_#adeaad,0_0.375em_0_0_#a6e6a6,0_0.425em_0_0_#97db97,0_0.425em_0.5em_0_#a8e5a8]
          transition-all 
          duration-150 
          ease-[ease] 
          cursor-pointer 
          [text-shadow:0_0.0625em_0_#fff]
          active:translate-y-[0.225em]
          active:shadow-[inset_0_0.03em_0_0_#d7f9d7,0_0.03em_0_0_#c6f1c6,0_0.0625em_0_0_#bff0bf,0_0.125em_0_0_#b3e6b3,0_0.125em_0_0_#adeaad,0_0.2em_0_0_#a6e6a6,0_0.225em_0_0_#97db97,0_0.225em_0.375em_0_#a8e5a8]
        "
      >
        Login
      </button>
    </form>

    <div className="text-sm font-bold text-green-600 text-center my-4">
      --- Or ---
    </div>

    <button
      onClick={handleGoogleLogin}
      className="
        w-full 
        2xl:w-[350px]
        max-w-[310px] 
        flex 
        items-center 
        justify-center 
        px-6 
        py-2 
        text-sm 
        leading-5 
        font-bold 
        uppercase 
        gap-3 
        rounded-lg 
        border 
        border-[rgba(0,0,0,0.25)] 
        text-[#413f3f] 
        bg-white 
        cursor-pointer 
        transition 
        duration-600 
        ease-[ease] 
        hover:scale-[1.02]
      "
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 262" width="20" height="20" className="h-5 w-5">
        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
        <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
      </svg>
      Login with Google
    </button>
        {/* ✅ Signup Link */}
    <div className="text-sm text-center mt-4 text-gray-700">
      Don’t have an account?{" "}
      <span
        onClick={() => navigate("/signup")}
        className="text-green-700 font-bold cursor-pointer hover:underline"
      >
        Sign up here
      </span>
    </div>
  </div>
</div>

    </>
  );
};

export default LoginPage;