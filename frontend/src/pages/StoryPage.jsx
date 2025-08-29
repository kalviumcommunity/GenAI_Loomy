import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function StoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, story } = location.state || {};


  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 p-6">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            No story found
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you have not generated a story yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Back to Generator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {title}
          </h1>

          <div className="max-h-[60vh] overflow-y-auto pr-2 text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
            {story}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition"
            >
              Generate Another 🚀
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
