import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import api from "./api/axios";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import MyListings from "./pages/MyListings";
import CreateListing from "./pages/CreateListing";
import Sessions from "./pages/Sessions";

function App() {
  const { token, user, updateUser } = useAuth();

  // Keep the credit balance fresh — refetch the real profile from the
  // database whenever the app loads or the token changes, instead of
  // relying on whatever balance was cached at login time.
  useEffect(() => {
    if (token) {
      api
        .get("/auth/profile")
        .then((res) => {
          updateUser((prevUser) => ({ ...prevUser, creditBalance: res.data.user.creditBalance }));
        })
        .catch(() => {});
    }
  }, [token]);

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;