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
import Landing from "./pages/Landing";
function App() {
  const { token, user, updateUser } = useAuth();

  
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
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

  return (
    <>
      <Navbar />
      <div style={{ marginLeft: 240, minHeight: "100vh", background: "#F7F3EC" }}>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;