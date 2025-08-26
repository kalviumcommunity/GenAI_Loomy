import { ArrowLeft } from "lucide-react";

export default function StoryPage({ story, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0b3c] to-[#3a0d4d] p-6">
      <div className="max-w-3xl w-full">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Story Card */}
        <div className="bg-[#1e1233] text-gray-100 rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            ✨ Your Story
          </h1>

          {/* Scrollable story box */}
          <div className="max-h-[70vh] overflow-y-auto pr-2 text-lg leading-relaxed scrollbar-thin scrollbar-thumb-[#5b2e91] scrollbar-track-transparent">
            {story ? (
              <p>{story}</p>
            ) : (
              <p className="italic text-gray-400 text-center">
                No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...No story generated yet...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
