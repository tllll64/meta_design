import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from '@/apps/demo/pages/Home';
import Report from '@/apps/demo/pages/Report';
import ReportPrint from '@/apps/demo/pages/ReportPrint';

export default function DemoApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/print" element={<ReportPrint />} />
        <Route path="/slides" element={<Navigate to="/report" replace />} />
        <Route path="/slides/print" element={<Navigate to="/report/print" replace />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
