import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Wizard } from './pages/Wizard';
import { Result } from './pages/Result';

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
