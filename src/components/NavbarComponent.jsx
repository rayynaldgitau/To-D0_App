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
    <nav className="w-full bg-green-100 shadow-md py-3 px-5 md:px-10">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex gap-2 items-center cursor-pointer">
          <img src={LogoImg} alt="logo" className="h-6 w-6" />
          <p className="text-lg font-semibold text-green-600 hover:text-green-700 transition">
            ToDoSome
          </p>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-green-900 font-semibold">
          <button onClick={toggleTheme} className="focus:outline-none">
            {theme === 'dark' ? (
              <FaSun className="text-yellow-400 h-5 w-5" />
            ) : (
              <FaMoon className="text-gray-700 h-5 w-5" />
            )}
          </button>
          <a href="/" className="text-sm">
            My ToDo
          </a>
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center font-semibold">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/signin"
              className="bg-green-800 text-white text-sm py-2 px-6 rounded-md hover:bg-green-700 transition"
            >
              Login
            </a>
          )}
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-green-800 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-green-900 font-semibold">
          <button onClick={toggleTheme} className="focus:outline-none flex items-center gap-2">
            {theme === 'dark' ? (
              <>
                <FaSun className="text-yellow-400" />
                Light Mode
              </>
            ) : (
              <>
                <FaMoon className="text-gray-700" />
                Dark Mode
              </>
            )}
          </button>
          <a href="/" className="block text-sm">
            My ToDo
          </a>
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center font-semibold">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/signin"
              className="block bg-green-800 text-white text-sm py-2 px-4 rounded-md hover:bg-green-700 transition"
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
