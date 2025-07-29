import React, { useEffect, useState } from "react";
import LogoImg from "../assets/logo.png";
import { logout } from "../services/authService";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";

const NavbarComponent = ({ theme, setTheme }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
<nav className="w-full bg-green-50 dark:bg-green-950 shadow-sm border-b border-green-200 dark:border-green-800 py-3 px-4 sm:px-6 md:px-10">
  <div className="flex justify-between items-center">
    {/* Logo */}
    <div className="flex gap-2 items-center cursor-pointer">
      <img src={LogoImg} alt="logo" className="h-7 w-7 rounded-sm" />
      <p className="text-lg font-bold text-green-700 dark:text-green-300 tracking-tight hover:text-green-800 transition">
        ToDoSome
      </p>
    </div>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-5 text-green-900 dark:text-green-100 font-medium">
      <button
        onClick={toggleTheme}
        className="text-xl hover:text-yellow-500 transition focus:outline-none"
      >
        {theme === "dark" ? (
          <FaSun className="text-yellow-400" />
        ) : (
          <FaMoon className="text-green-700" />
        )}
      </button>

      <a
        href="/"
        className="text-sm hover:text-green-600 dark:hover:text-green-400 transition"
      >
        My ToDo
      </a>

      {user ? (
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-8 h-8 rounded-full border border-green-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-md shadow-sm transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="/signin"
          className="bg-green-700 hover:bg-green-600 text-white text-sm px-5 py-2 rounded-md shadow-sm transition"
        >
          Login
        </a>
      )}
    </div>

    {/* Hamburger Icon */}
    <button
      className="md:hidden text-green-800 dark:text-green-100 text-2xl"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      {menuOpen ? <FaTimes /> : <FaBars />}
    </button>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden mt-4 space-y-4 text-green-900 dark:text-green-100 font-medium">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 text-sm hover:text-yellow-500 transition"
      >
        {theme === "light" ? (
          <>
            <FaSun className="text-yellow-400" />
            Light Mode
          </>
        ) : (
          <>
            <FaMoon className="text-green-700" />
            Dark Mode
          </>
        )}
      </button>

      <a
        href="/"
        className="block text-sm hover:text-green-600 dark:hover:text-green-400"
      >
        My ToDo
      </a>

      {user ? (
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-8 h-8 rounded-full border border-green-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-md shadow-sm transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="/signin"
          className="block bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow-sm transition"
        >
          Login
        </a>
      )}
    </div>
  )}
</nav>

  );
};

export default NavbarComponent;
