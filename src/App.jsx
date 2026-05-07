import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PatientView from './components/PatientView';
import CaretakerView from './components/CaretakerView';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient" element={<PatientView />} />
          <Route path="/caretaker" element={<CaretakerView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
