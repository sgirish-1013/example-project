import { useState } from "react";
import { setupProfile } from "../api/chatApi";

const genres = ["RPG", "Action", "Adventure", "Strategy", "Sports",
                 "Horror", "Puzzle", "Simulation", "Fighting", "FPS"];
const platforms = ["PC", "PS5", "Xbox", "Nintendo Switch", "Mobile"];
const playStyles = ["Casual", "Moderate", "Hardcore"];

export default function ProfileForm({ onProfileSet }) {
  const [form, setForm] = useState({
    name: "",
    genres: [],
    platform: "",
    playStyle: "",
    playedGames: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let toggleGenre = (genre) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || form.genres.length === 0 || !form.platform || !form.playStyle) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await setupProfile(form);
      onProfileSet(form);
    } catch (err) {
      setError("Failed to set up profile. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg border border-gray-800">
        
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎮</div>
          <h1 className="text-2xl font-bold text-white">Game Recommender</h1>
          <p className="text-gray-400 mt-1">Set up your profile to get started</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300
                          rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Your name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                       text-white placeholder-gray-500 focus:outline-none
                       focus:border-purple-500 transition"
          />
        </div>

        {/* Genres */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Favorite genres <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition border
                  ${form.genres.includes(genre)
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-purple-500"
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Platform <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setForm({ ...form, platform: p })}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition border
                  ${form.platform === p
                    ? "bg-teal-600 border-teal-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-teal-500"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Play Style */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Play style <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            {playStyles.map((s) => (
              <button
                key={s}
                onClick={() => setForm({ ...form, playStyle: s })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition border
                  ${form.playStyle === s
                    ? "bg-coral-600 bg-orange-600 border-orange-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-orange-500"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Games already played */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Games you've already played
            <span className="text-gray-500 font-normal ml-1">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Elden Ring, Witcher 3, GTA V"
            value={form.playedGames}
            onChange={(e) => setForm({ ...form, playedGames: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                       text-white placeholder-gray-500 focus:outline-none
                       focus:border-purple-500 transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50
                     text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? "Setting up..." : "Start Chatting →"}
        </button>

      </div>
    </div>
  );
}