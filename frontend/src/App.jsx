// App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StoryPage from "./pages/StoryPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/story" element={<StoryPage />} />
      </Routes>
    </Router>
  );
}
