import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import bgImage from "../assets/login-bg.jpg";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      login(email, password);
      setLoading(false);
    } catch (err) {
      console.error("Login failed:", err);
    } 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader size={50} color="white" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

<form
  onSubmit={handleSubmit}
  className="
    relative z-10
    w-96
    rounded-3xl
    p-8
    backdrop-blur-2xl
    bg-white/5
    border border-white/10
    shadow-lg shadow-black/40
  "
>
  <h2 className="text-3xl font-extrabold mb-2 text-center text-white">
    Welcome Back
  </h2>

  <p className="text-sm text-gray-300 text-center mb-6">
    Login to continue
  </p>

  <input
    type="email"
    placeholder="Email"
    className="
      w-full p-3 mb-4 rounded-xl
      bg-white/10 text-white placeholder-gray-400
      border border-white/20
      focus:outline-none focus:ring-2 focus:ring-blue-400/60
    "
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    className="
      w-full p-3 mb-6 rounded-xl
      bg-white/10 text-white placeholder-gray-400
      border border-white/20
      focus:outline-none focus:ring-2 focus:ring-blue-400/60
    "
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="submit"
    className="
      bg-blue-600/80 text-white
      w-full py-3 rounded-xl font-semibold
      hover:bg-blue-700/90 transition
      shadow-md
    "
  >
    Login
  </button>
</form>


    </div>
  );
}
