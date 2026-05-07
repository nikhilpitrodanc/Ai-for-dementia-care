import React, { useState, useEffect } from 'react';
import { Phone, Users, Clock, ArrowLeft, Heart, ScanSearch, BellRing } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FaceScanner from './FaceScanner';

const PatientView = () => {
  const navigate = useNavigate();
  const [relatives, setRelatives] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showScanner, setShowScanner] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('relatives');
    if (saved) setRelatives(JSON.parse(saved));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerSOS = () => {
    // Set a timestamp to trigger 'storage' event in other tabs
    localStorage.setItem('sos_trigger', Date.now().toString());
    setSosSent(true);
    
    // Auto-reset "Sent" message after 10 seconds
    setTimeout(() => setSosSent(false), 10000);
  };

  return (
    <div className="patient-view animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', maxWidth: '1200px', margin: '0 auto 3rem auto' }}>
        <button 
          onClick={() => {
            if (showScanner) setShowScanner(false);
            else navigate('/');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-light)', fontWeight: '600', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          <ArrowLeft size={24} /> {showScanner ? "Back to Dashboard" : "Main Menu"}
        </button>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      {showScanner ? (
        <FaceScanner />
      ) : (
        <div className="patient-grid">
          {/* Identity Verification Section */}
          <div className="patient-card" style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)', border: '2px solid var(--primary)', padding: '3rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-block' }}>
              <ScanSearch size={64} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Identify Someone</h2>
            <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.7, maxWidth: '600px' }}>
              Not sure who is standing in front of you? Use the camera to let me help you recognize them.
            </p>
            <button 
              className="patient-btn btn-primary" 
              onClick={() => setShowScanner(true)}
              style={{ maxWidth: '400px', height: '100px', fontSize: '2rem' }}
            >
              Start Identification
            </button>
          </div>

          {/* Emergency Call Card */}
          <div className="patient-card">
            <div style={{ background: sosSent ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', transition: 'all 0.3s' }}>
              {sosSent ? <BellRing size={48} color="var(--accent)" /> : <Phone size={48} color="var(--danger)" />}
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{sosSent ? "Help is Coming" : "Need Help?"}</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', opacity: 0.7 }}>
              {sosSent 
                ? "Your caretaker has been alerted. Please stay calm and wait where you are." 
                : "Press the button below to alert your caretaker immediately."}
            </p>
            <button 
              className={`patient-btn ${sosSent ? 'btn-primary' : 'btn-emergency'}`} 
              onClick={triggerSOS}
              disabled={sosSent}
              style={{ background: sosSent ? 'var(--accent)' : 'var(--danger)' }}
            >
              {sosSent ? "Alert Sent" : "Call Caretaker"}
            </button>
          </div>

          {/* Schedule Card */}
          <div className="patient-card">
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Clock size={48} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Day</h2>
            <div style={{ width: '100%', textAlign: 'left' }}>
              <div style={{ padding: '1rem', borderLeft: '4px solid var(--accent)', background: '#f0fdf4', marginBottom: '0.5rem', borderRadius: '0 0.5rem 0.5rem 0' }}>
                <p style={{ fontWeight: '700' }}>12:30 PM</p>
                <p>Lunch Time 🍲</p>
              </div>
              <div style={{ padding: '1rem', borderLeft: '4px solid var(--primary)', background: '#eef2ff', borderRadius: '0 0.5rem 0.5rem 0' }}>
                <p style={{ fontWeight: '700' }}>02:00 PM</p>
                <p>Afternoon Nap 😴</p>
              </div>
            </div>
          </div>

          {/* Family Card */}
          <div className="patient-card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <Users size={32} color="var(--accent)" />
              </div>
              <h2 style={{ fontSize: '2rem' }}>Meet Your Family</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {relatives.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>
                  <Heart size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
                  <p>Your family will appear here soon.</p>
                </div>
              ) : (
                relatives.map(rel => (
                  <div key={rel.id} className="animate-fade-in" style={{ textAlign: 'center' }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
                      <img src={rel.photo} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{rel.name}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: '600' }}>{rel.relation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientView;
