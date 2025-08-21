import React, { useContext, useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/authbg.jpg";
import axios from "axios";
import { userDataContext } from "../context/userContext";

export default function Signup() {
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      setUserData(null);
      console.log(error);
      setErr(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay for blur effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 text-white w-[90%] sm:w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-lg">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h2>

        {/* Name */}
        <form onSubmit={handleSignup}>
          <div className="flex items-center gap-3 mb-5 border-b border-white/50 px-3 py-2">
            <FaUser className="text-white/80" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-white/70 text-white"
            />
          </div>

          {/* Email */}
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

          {/* Signup Button */}
          <button className="w-full bg-white hover:bg-blue-700 text-black py-2 rounded-full font-semibold transition-all shadow-lg">
            {loading ? "Loading.." : " Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-white/80 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
