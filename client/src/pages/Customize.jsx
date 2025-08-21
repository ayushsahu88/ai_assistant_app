import React, { useContext, useRef, useState } from "react";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.webp";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/authbg.jpg";
import { RiImageAddLine } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";

import Card from "../components/Card";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const navigate = useNavigate();
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const inputImage = useRef();

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-4">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 text-white hover:text-blue-400 transition"
        onClick={() => navigate("/")}
      >
        <IoArrowBack size={28} />
      </button>
      <h1 className="text-white mb-10 text-2xl md:text-3xl lg:text-4xl text-center">
        Select your <span className="text-blue-200">Assistant Image</span>
      </h1>

      {/* Images grid */}
      <div className="w-full max-w-6xl flex justify-center items-center flex-wrap gap-5">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <div
          className={`w-32 h-48 sm:w-36 sm:h-56 md:w-40 md:h-60 bg-[#03034d] border-2 border-blue-500 rounded-2xl overflow-hidden 
                     hover:shadow-2xl hover:shadow-blue-400 cursor-pointer hover:border-4 hover:border-white 
                     flex items-center justify-center transition-all duration-300 ${
                       selectedImage === "input"
                         ? "border-4 border-white shadow-2xl shadow-blue-400"
                         : null
                     }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && <RiImageAddLine className="text-white w-8 h-8" />}
          {frontendImage && (
            <img className="h-full over-cover" src={frontendImage}></img>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {/* Next button */}
      {selectedImage && (
        <button
          className="mt-8 px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 
                   bg-white hover:bg-blue-700 text-black hover:text-white 
                   rounded-full font-semibold text-sm sm:text-base md:text-lg 
                   transition-all duration-300 shadow-lg cursor-pointer"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;
