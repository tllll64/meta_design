import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/apps/demo/pages/Home';
import Slides from '@/apps/demo/pages/Slides';
import SlidesPrint from '@/apps/demo/pages/SlidesPrint';

export default function DemoApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/slides" element={<Slides />} />
        <Route path="/slides/print" element={<SlidesPrint />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
