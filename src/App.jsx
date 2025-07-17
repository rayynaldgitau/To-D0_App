import { Routes, Route } from "react-router";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import { getCurrentUser } from "./services/authService";
import SignUpPage from "./pages/SignUpPage";


function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const PrivateRoute = ({ children }) => {
    return getCurrentUser() ? children : <Navigate to="/signin" />;
  };

  return (
    <>
      <Toaster />
      <Routes>
          <Route
              path="/"
              element={
                  <PrivateRoute>
                      <HomePage theme={theme} setTheme={setTheme} />
                  </PrivateRoute>
              }
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<LoginPage />} />
          
        {/* Prevent user after login */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
}

export default App;
