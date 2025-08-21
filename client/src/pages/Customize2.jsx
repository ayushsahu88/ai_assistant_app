import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { serverUrl, userData, setUserData, backendImage, selectedImage } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-4">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 text-white hover:text-blue-400 transition"
        onClick={() => window.history.back()}
      >
        <IoArrowBack size={28} />
      </button>
      <h1 className="text-white mb-10 text-2xl md:text-3xl lg:text-4xl text-center font-bold">
        Enter your <span className="text-blue-200">Assistant Name</span>
      </h1>

      {/* Stylish & Bigger Input */}
      <input
        type="text"
        placeholder="eg:..shifra"
        className="w-80 sm:w-[28rem] md:w-[32rem] px-6 py-4 
                   rounded-2xl bg-white/10 backdrop-blur-xl 
                   border border-white/20 text-white placeholder-gray-400 
                   text-lg md:text-xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                   shadow-xl transition duration-300"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      {/* Button */}
      {assistantName && (
        <button
          className="mt-8 px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 
                   bg-white hover:bg-blue-700 text-black hover:text-white 
                   rounded-full font-semibold text-sm sm:text-base md:text-lg 
                   transition-all duration-300 shadow-lg cursor-pointer"
          onClick={() => handleUpdateAssistant()}
          disabled={loading}
        >
          {loading ? "Loading..." : "🚀 Finally Create your Assistant"}
        </button>
      )}
    </div>
  );
};

export default Customize2;
