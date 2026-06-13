import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ProjectHub from '@/apps/demo/pages/ProjectHub';
import Workspace from '@/apps/demo/pages/Workspace';
import Report from '@/apps/demo/pages/Report';
import ReportPrint from '@/apps/demo/pages/ReportPrint';

export default function DemoApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectHub />} />
        <Route path="/project/:projectId" element={<Workspace />} />
        <Route path="/workspace" element={<Navigate to="/" replace />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/print" element={<ReportPrint />} />
        <Route path="/slides" element={<Navigate to="/report" replace />} />
        <Route path="/slides/print" element={<Navigate to="/report/print" replace />} />
      </Routes>
    </Router>
  );
}
