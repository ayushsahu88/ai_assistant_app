import React, { useContext, useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/authbg.jpg";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

export default function Login() {
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setEmail("");
      setPassword("");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setErr(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dim + blur overlay to keep text readable over any image */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 text-white w-[90%] sm:w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-lg">
          Login to <span className="text-blue-400">Virtual Assistant</span>
        </h2>

        {/* Email */}
        <form onSubmit={handleLogin}>
          <div className="flex items-center gap-3 mb-5 border-b border-white/50 px-3 py-2">
            <FaEnvelope className="text-white/80" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-white/70 text-white"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 mb-8 border-b border-white/50 px-3 py-2">
            <FaLock className="text-white/80" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-white/70 text-white"
            />
          </div>

          {err.length > 0 && (
            <p className="mt-2 text-sm text-red-600  px-3 py-2  shadow-sm">
              *{err}
            </p>
          )}

          {/* Login Button */}
          <button className="w-full bg-white hover:bg-blue-700 text-black py-2 rounded-full font-semibold transition-all shadow-lg">
            {loading ? "Loading.." : "Log In"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-white/80 mt-5">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
