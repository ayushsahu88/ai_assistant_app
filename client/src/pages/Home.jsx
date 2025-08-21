import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import userImage from "../assets/user.gif";
import { BiMenuAltRight } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  // ✅ Logout (POST request is better)
  const handleLogOut = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  // ✅ Start recognition safely
  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.log("Recognition start error: ", error);
      }
    }
  };

  // ✅ Speak
  const speak = (text, lang = "hi-IN") => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    let voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
      };
    }

    const selectedVoice =
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (selectedVoice) utterance.voice = selectedVoice;

    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
      startRecognition();
    };

    synth.speak(utterance);
  };

  // ✅ Handle commands
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    setAiText(response);
    speak(response, "hi-IN");

    switch (type) {
      case "google_search":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;
      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "instagram_open":
        window.open("https://www.instagram.com/", "_blank");
        break;
      case "facebook_open":
        window.open("https://www.facebook.com/", "_blank");
        break;
      case "weather_show":
        window.open("https://www.google.com/search?q=weather", "_blank");
        break;
      case "youtube_search":
      case "youtube_play":
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            userInput
          )}`,
          "_blank"
        );
        break;
      default:
        speak("Sorry, I didn't get that.", "en-US");
    }
  };

  // ✅ Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.log("Start error:", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(safeRecognition, 800);
      }
    };

    recognition.onerror = (event) => {
      // ✅ "aborted" error को ignore किया गया
      if (event.error === "aborted") return;

      console.log("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (!isSpeakingRef.current) {
        setTimeout(safeRecognition, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      const spoken = transcript.toLowerCase();
      const name = userData?.assistantName?.toLowerCase();

      if (name && (spoken.includes(name) || spoken.includes("hey " + name))) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        console.log("Gemini response:", data);
        handleCommand(data);
        setUserText("");
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 1000);

    safeRecognition();

    return () => {
      recognition.stop();
      synth.cancel();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, [getGeminiResponse, synth, userData?.assistantName]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center relative p-3 sm:p-6">
      {/* 🔹 Menu (Top-right) */}
      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-10">
        <div className="bg-white/10 backdrop-blur-lg p-2 sm:p-3 rounded-2xl shadow-xl flex flex-col items-center gap-3 border border-white/20">
          {menuOpen ? (
            <IoMdClose
              className="text-white text-2xl sm:text-3xl cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <BiMenuAltRight
              className="text-white text-2xl sm:text-3xl cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setMenuOpen(true)}
            />
          )}

          {menuOpen && (
            <div className="flex flex-col items-center gap-4 w-44 sm:w-56 md:w-64 animate-fadeIn bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
              {/* Log Out */}
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 
                 hover:from-red-600 hover:to-pink-600 text-white rounded-full 
                 font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
                onClick={handleLogOut}
              >
                Log Out
              </button>

              {/* Customize */}
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 
                 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full 
                 font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
                onClick={() => navigate("/customize")}
              >
                Customize
              </button>

              {/* History */}
              <div className="w-full bg-white/5 rounded-xl p-3 shadow-inner border border-white/10">
                <h1 className="text-white text-sm font-semibold mb-2 text-center">
                  History
                </h1>
                <div className="flex flex-col gap-2 max-h-32 sm:max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {userData?.history?.length > 0 ? (
                    userData.history.map((his, i) => (
                      <span
                        key={i}
                        className="text-white/90 text-xs sm:text-sm bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition"
                      >
                        {his}
                      </span>
                    ))
                  ) : (
                    <p className="text-white/60 text-xs italic text-center">
                      No history yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Assistant Image */}
      <div className="w-32 h-44 sm:w-48 sm:h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 flex justify-center items-center overflow-hidden mt-20 sm:mt-24 md:mt-28">
        <img
          className="h-full w-full object-cover rounded-3xl shadow-lg"
          src={userData?.assistantImage || ""}
          alt="assistant"
        />
      </div>

      {/* 🔹 Assistant Name */}
      <h1 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold mt-4 text-center">
        I&apos;m {userData?.assistantName}
      </h1>

      {/* 🔹 Voice / AI GIF */}
      <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-sm sm:max-w-md">
        {!aiText ? (
          <img
            className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 object-cover rounded-full shadow-lg transition-all border-4 border-white/20"
            src={userImage}
            alt="User Listening"
          />
        ) : (
          <img
            className="w-28 sm:w-36 md:w-44 h-28 sm:h-36 md:h-44 object-contain rounded-2xl shadow-lg animate-pulse ring-4 ring-blue-500/60"
            src={ai}
            alt="AI Speaking"
          />
        )}

        {(userText || aiText) && (
          <h1 className="text-white text-xs sm:text-sm md:text-base lg:text-lg text-center px-3 sm:px-6">
            {userText || aiText}
          </h1>
        )}
      </div>
    </div>
  );
};

export default Home;
