import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import Layout from "../components/Layout";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

const CommunityDetailsPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`chat-${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const res = await axiosInstance.get(`/communities/${id}`);
        if (res.data.success) {
          setCommunity(res.data.community);
          const totalMembers = res.data.members?.length || 1;
          setMemberCount(totalMembers);
          const onlineMembers =
            res.data.onlineCount ??
            Math.min(totalMembers, 1 + Math.floor(Math.random() * totalMembers));
          setOnlineCount(onlineMembers);
        } else setError("Failed to load community details");
      } catch (err) {
        console.error(err);
        setError("Failed to load community details");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
    socket.emit("joinRoom", id);
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        const updated = [...prev, msg];
        localStorage.setItem(`chat-${id}`, JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("receiveMessage");
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      communityId: id,
      text: newMessage,
      senderId: "me",
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", messageData);

    setMessages((prev) => {
      const updated = [...prev, messageData];
      localStorage.setItem(`chat-${id}`, JSON.stringify(updated));
      return updated;
    });

    setNewMessage("");
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <Layout showSidebar={true}>
      <div className="p-6 flex flex-col gap-6 border-t-4 border-b-4 border-gradient-to-r from-red-400 via-pink-400 to-red-400">
   
        <div className="card bg-base-200 shadow-xl rounded-xl overflow-hidden border border-gray-300 hover:shadow-2xl transition-shadow duration-300 border-l-4 border-r-4 border-t-2 border-purple-400 border-blue-100 hover:scale-100 transform ">
          <figure>
            <img
              src={community.image}
              alt={community.name}
              className="w-full h-64 object-cover"
            />
          </figure>
          <div className="card-body">
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <p className="text-gray-700">{community.description}</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg p-5 rounded-xl border-l-4 border-blue-400 hover:scale-100 transform transition-all duration-300 ">
          <h2 className="text-xl font-semibold mb-2">👥 Members</h2>
          <p className="text-gray-800">
            <span className="font-medium text-blue-500">{memberCount}</span> members,{" "}
            <span className="text-green-500">{onlineCount} online</span>
          </p>
          <p className="text-gray-500 mt-1 italic text-sm">
            Member names are private
          </p>
        </div>

        <div className="card bg-base-200 shadow-lg p-4 flex flex-col h-[500px] rounded-xl border-t-4 border-b-4 border-gradient-to-r from-purple-400 via-pink-400 to-red-400">
          <h2 className="text-xl font-semibold mb-3">💬 Group Chat</h2>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #374151, #1f2937) bg-color: #f3f4f6",
            }}
          >
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center mt-4">
                No messages yet. Start the chat!
              </p>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === "me";
                return (
                  <div
                    key={idx}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-xs break-words shadow-lg ${
                        isMe
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-right"
                          : "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-gray-100 text-left"
                      }`}
                    >
                      <span className="block text-sm font-semibold mb-1">
                        {isMe ? "You" : "Unknown"}
                      </span>
                      <span>{msg.text}</span>
                      <div className="text-xs text-gray-300 mt-1 text-right">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityDetailsPage;
