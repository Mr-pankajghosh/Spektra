// import React, { useEffect } from "react";
// import { motion } from "framer-motion";
// import { useLocation } from "react-router-dom";

// const ChatbotButton = () => {
//   const location = useLocation();

//   // 🔹 Add pages where chatbot should be hidden
//   const hiddenRoutes = [
//     "/login",
//     "/signup",
//     "/onboarding",
//     "/forgot-password",
//     "/reset-password",
//     "/call",
//   ];

//   // 🔹 Check if current page is hidden or starts with any hidden route
//   const isHidden = hiddenRoutes.some((route) =>
//     location.pathname.startsWith(route)
//   );

//   useEffect(() => {
//     if (isHidden) return; // don't load script on hidden pages

//     // Prevent loading Chatbase script twice
//     if (document.querySelector("#chatbase-embed-script")) return;

//     const script = document.createElement("script");
//     script.src = "https://www.chatbase.co/embed.min.js";
//     script.id = "chatbase-embed-script";
//     script.async = true;

//     // 🧩 Replace this with your Chatbase Bot ID later
//     script.dataset.chatbotId = "YOUR_CHATBASE_BOT_ID";
//     script.dataset.domain = "www.chatbase.co";

//     document.body.appendChild(script);
//   }, [isHidden]);

//   // 🟣 If this page should hide the chatbot
//   if (isHidden) return null;

//   const openChat = () => {
//     const chatButton = document.querySelector("#chatbase-bubble-button");
//     if (chatButton) chatButton.click();
//   };

//   return (
//     <motion.button
//       onClick={openChat}
//       className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-3 shadow-lg  hover:shadow-2xl transition-all"
//       whileHover={{ scale: 1.15, rotate: 6 }}
//       whileTap={{ scale: 0.9 }}
//       title="Chat with AI Assistant"
//     >
//       {/* Animated Robot */}
//       <motion.div
//         animate={{ y: [0, -4, 0] }}
//         transition={{ duration: 2.5, repeat: Infinity }}
//         className="relative"
//       >
//         <motion.img
//           src="https://cdn-icons-png.flaticon.com/512/4712/4712104.png

// "
//           alt="AI Bot"
//           className="w-12 h-12 object-cover rounded-full"
//           animate={{
//             rotate: [0, 2, -2, 0],
//             scale: [1, 1.03, 1],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//           }}
//         />
//         {/* Blinking eye overlay */}
//         <motion.div
//           className="absolute top-[16px] left-[19px] w-[8px] h-[8px] bg-black rounded-full"
//           animate={{ scaleY: [1, 0.1, 1] }}
//           transition={{ duration: 3, repeat: Infinity, delay: 1 }}
//         />
//       </motion.div>
//     </motion.button>
//   );
// };

// export default ChatbotButton;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I'm your AI City Assistant!" },
    { from: "bot", text: "How are you today?" },
    { from: "bot", text: "Please register or login to unlock full features 🚀" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    // Simulate bot reply (later you can connect Chatbase or OpenAI)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Thanks for your message! 😊 I'll connect you soon." },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center  p-3 shadow-lg hover:shadow-2xl transition-all"
        whileHover={{ scale: 1.15, rotate: 6 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712104.png" // 👈 move your robot image to public folder
          alt="AI Bot"
          className="w-14 h-14 object-contain"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Popup Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white flex justify-between items-center px-4 py-2">
              <span className="font-semibold">AI Assistant 🤖</span>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-72">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                      msg.from === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center border-t border-gray-200 p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 text-sm px-2 py-1 outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotButton;

// src/components/ChatbotButton.jsx
// import React, { useEffect } from "react";
// import { MessageCircle } from "lucide-react";

// const ChatbotButton = () => {
//   useEffect(() => {
//     // Prevent script from loading multiple times
//     if (document.querySelector("#chatbase-embed-script")) return;

//     const script = document.createElement("script");
//     script.src = "https://www.chatbase.co/embed.min.js";
//     script.id = "chatbase-embed-script";
//     script.async = true;

//     // 🧠 Replace with your actual Chatbase Bot ID
//     script.dataset.chatbotId = "YOUR_CHATBASE_BOT_ID";
//     script.dataset.domain = "www.chatbase.co";

//     document.body.appendChild(script);

//     return () => {
//       // Cleanup on unmount (optional)
//       // document.body.removeChild(script);
//     };
//   }, []);

//   // Opens the chat bubble programmatically
//   const openChat = () => {
//     const chatButton = document.querySelector("#chatbase-bubble-button");
//     if (chatButton) chatButton.click();
//   };

//   return (
//     <button
//       onClick={openChat}
//       className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
//       title="Chat with AI Assistant"
//     >
//       <MessageCircle size={26} />
//     </button>
//   );
// };

// export default ChatbotButton;
