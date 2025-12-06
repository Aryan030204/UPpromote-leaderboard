import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Leaderboard from "./components/Leaderboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const socket = io(API_BASE_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    const handleInit = (payload) => {
      if (payload?.leaderboard) {
        setLeaderboard(payload.leaderboard);
      }
      setLoading(false);
    };

    const handleUpdate = (payload) => {
      if (payload?.leaderboard) {
        setLeaderboard(payload.leaderboard);
      }
    };

    const handleError = (err) => {
      console.error("Socket error", err);
      setError("Real-time connection lost. Retrying...");
    };

    socket.on("leaderboard:init", handleInit);
    socket.on("leaderboard:update", handleUpdate);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("leaderboard:init", handleInit);
      socket.off("leaderboard:update", handleUpdate);
      socket.off("connect_error", handleError);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Affiliate Leaderboard
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {loading && leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading leaderboard...</p>
          </div>
        ) : (
          <Leaderboard data={leaderboard} />
        )}
      </div>
    </div>
  );
}

export default App;
