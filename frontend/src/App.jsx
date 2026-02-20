import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder Pages
const InterviewerSetup = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <h1 className="text-3xl font-bold text-maroon-600">Interviewer Setup (Route: /)</h1>
  </div>
);

const InterviewerDashboard = () => (
  <div className="min-h-screen p-8">
    <h1 className="text-2xl font-bold text-maroon-600">Interviewer Dashboard (Route: /session/:id)</h1>
  </div>
);

const IntervieweePortal = () => (
  <div className="min-h-screen p-8">
    <h1 className="text-2xl font-bold text-blue-600">Interviewee Portal (Route: /interviewee/:id)</h1>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container bg-gray-50 text-gray-900 font-sans min-h-screen">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-maroon-700">InterviewIQ</h1>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<InterviewerSetup />} />
            <Route path="/session/:id" element={<InterviewerDashboard />} />
            <Route path="/interviewee/:id" element={<IntervieweePortal />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
