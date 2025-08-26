import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedLength, setSelectedLength] = useState(""); 
  const [ageGroup, setAgeGroup] = useState(""); 
  const [blurb, setBlurb] = useState(""); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // --- Generate Story ---
  const handleGenerateStory = async () => {
    if (!selectedGenres.length || !selectedStyles.length || !selectedLength || !ageGroup || !blurb) {
      alert("Please fill all fields before generating a story!");
      return;
    }

    const payload = {
      genres: selectedGenres,
      styles: selectedStyles,
      length: selectedLength.toLowerCase(), // backend expects lowercase
      ageGroup,
      blurb,
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost:7008/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        alert("Story generation failed: " + (data.errors?.join(", ") || data.error));
        return;
      }

      // Navigate to StoryPage and pass both the story + inputs
      navigate("/story", { state: { story: data.story, inputs: payload } });
    } catch (err) {
      console.error("Error generating story:", err);
      alert("Failed to reach backend.");
    } finally {
      setLoading(false);
    }
  };

  // --- Random Story ---
  const handleRandomStory = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:7008/api/random-story");
      const data = await res.json();

      if (data.error) {
        alert("Random story generation failed.");
        return;
      }

      navigate("/story", { state: { story: data.story, random: true } });
    } catch (err) {
      console.error("Error generating random story:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-[#1a0b3c] to-[#3a0d4d] overflow-hidden">
      {/* Main Content */}
      <div
        className={`flex items-center justify-center text-center px-6 transition-all duration-500 ${
          showSidebar ? "w-full md:w-1/2" : "w-full"
        }`}
      >
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            Introducing{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Loomy
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-300">
            A world of imagination is just a page away. Craft your own stories
            with AI.
          </p>

          <button
            onClick={() => setShowSidebar(true)}
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-[#6b21a8] to-[#4c1d95] text-white font-semibold text-lg shadow-lg hover:from-[#7c3aed] hover:to-[#5b21b6] transition-all duration-300"
          >
            Try Loomy
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full md:w-1/2 h-full bg-[#1e1e2f] text-white shadow-2xl p-6 overflow-y-auto transition-all duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customize Your Story</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✖
            </button>
          </div>

          {/* Genre */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Genre</h3>
            <div className="flex flex-wrap gap-2">
              {["Fantasy", "Sci-Fi", "Romance", "Mystery", "Thriller", "Horror","Fiction","Children's fiction","Young Adult","Comedy","Historical","Epic","Fairytales"].map(
                (genre) => (
                  <button
                    key={genre}
                    onClick={() =>
                      toggleSelection(genre, selectedGenres, setSelectedGenres)
                    }
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      selectedGenres.includes(genre)
                        ? "bg-purple-600"
                        : "bg-gray-800 hover:bg-purple-700"
                    }`}
                  >
                    {genre}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Style */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Style</h3>
            <div className="flex flex-wrap gap-2">
              {["Shashi Tharoor", "Enid Blyton", "J.K. Rowling", "Amish Tripathi", "Mark Twain", "Collen Hoover","Jane Austen","R.K. Narayan","Ruskin Bond","Chetan Bhagat"].map(
                (style) => (
                  <button
                    key={style}
                    onClick={() =>
                      toggleSelection(style, selectedStyles, setSelectedStyles)
                    }
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      selectedStyles.includes(style)
                        ? "bg-pink-600"
                        : "bg-gray-800 hover:bg-pink-600"
                    }`}
                  >
                    {style}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Length */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Length</h3>
            <div className="flex gap-3">
              {["Short", "Medium", "Long"].map((len) => (
                <button
                  key={len}
                  onClick={() => setSelectedLength(len)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    selectedLength === len
                      ? "bg-purple-600"
                      : "bg-gray-800 hover:bg-purple-600"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Age Group</h3>
            <div className="flex gap-3">
              {["Kids", "Teens", "Adults"].map((group) => (
                <button
                  key={group}
                  onClick={() => setAgeGroup(group)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    ageGroup === group
                      ? "bg-blue-600"
                      : "bg-gray-800 hover:bg-blue-600"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Blurb */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Personalized Blurb</h3>
            <textarea
              placeholder="Write a short blurb to guide the AI..."
              rows="4"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 text-gray-200 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              onClick={handleGenerateStory}
              disabled={loading}
              className={`mt-8 w-full py-3 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#5b2e91] to-[#8a2c7c] text-white hover:from-[#4a2377] hover:to-[#731f65]"
              }`}
            >
              {loading ? "Generating..." : "Generate my story"}
            </button>

            <p
              onClick={handleRandomStory}
              className="mt-3 text-gray-300 text-sm italic cursor-pointer hover:underline"
            >
              Create a random story
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
