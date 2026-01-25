import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";


export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      login(email, password);
    }
    catch(err){
      console.error("Login failed:", err);
      
    }
    finally{
      setLoading(false);
    }
    
  };
  if (loading) {
    return <Loader size={50} color="blue" />;
  }


  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded p-8 w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          onSubmit={handleSubmit}
        >
          Login
        </button>
      </form>
    </div>
  );
}
