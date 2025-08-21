import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const {
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    setBackendImage,
    setFrontendImage,
  } = useContext(userDataContext);
  return (
    <div
      className={`w-28 h-40 sm:w-32 sm:h-48 md:w-36 md:h-56 lg:w-40 lg:h-60
                 bg-[#03034d] border-2 border-blue-500 rounded-2xl overflow-hidden 
                 hover:shadow-2xl hover:shadow-blue-400 cursor-pointer 
                 hover:border-4 hover:border-white transition-all duration-300 ${
                   selectedImage === image
                     ? "border-4 border-white shadow-2xl shadow-blue-400"
                     : null
                 }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img
        src={image}
        className="w-full h-full object-cover"
        alt="assistant"
        loading="lazy"
      />
    </div>
  );
}

export default Card;
