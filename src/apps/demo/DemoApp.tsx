import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/apps/demo/pages/Home";

export default function DemoApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

