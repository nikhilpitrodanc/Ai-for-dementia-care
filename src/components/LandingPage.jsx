import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page animate-fade-in">
      <div 
        className="landing-split patient" 
        onClick={() => navigate('/patient')}
      >
        <div className="landing-icon">
          <Heart size={64} color="#ef4444" fill="#ef4444" opacity={0.8} />
        </div>
        <h1 className="landing-title">Patient Mode</h1>
        <p className="landing-desc">
          Simple, easy-to-use interface for your daily needs and family connections.
        </p>
      </div>

      <div 
        className="landing-split caretaker" 
        onClick={() => navigate('/caretaker')}
      >
        <div className="landing-icon">
          <ShieldCheck size={64} color="#6366f1" />
        </div>
        <h1 className="landing-title">Caretaker Mode</h1>
        <p className="landing-desc">
          Monitor status, manage relatives, and ensure the best care for your loved ones.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
