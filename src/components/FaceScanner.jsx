import React, { useRef, useState, useEffect } from 'react';
import { Camera, Scan, ShieldCheck, UserCheck, AlertCircle, User } from 'lucide-react';

const FaceScanner = () => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [identifiedPerson, setIdentifiedPerson] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [isSimulation, setIsSimulation] = useState(false);

  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  const startScanning = async () => {
    try {
      setError(null);
      setIdentifiedPerson(null);
      setIsScanning(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsSimulation(false);

      // Simulate AI Scanning Logic
      setTimeout(() => {
        performIdentification();
      }, 3000);

    } catch (err) {
      console.warn("Camera hardware not found. Switching to Simulated Scanner.", err);
      setIsSimulation(true);
      
      // Still start the "Scanning" process but using simulation UI
      setTimeout(() => {
        performIdentification();
      }, 3000);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const performIdentification = () => {
    const saved = localStorage.getItem('relatives');
    const relatives = saved ? JSON.parse(saved) : [];
    
    if (relatives.length === 0) {
      setError("No registered family members found in database.");
      stopCamera();
      return;
    }

    // Pick the most recently registered relative for the demo
    const match = relatives[relatives.length - 1]; 
    setIdentifiedPerson(match);
    setIsScanning(false);
    stopCamera();
  };

  return (
    <div className="face-scanner-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {!identifiedPerson ? (
        <div className="patient-card" style={{ padding: '3rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-block' }}>
            <Scan size={64} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Who is here?</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '2rem' }}>
            Stand in front of the camera and I will help you remember who they are.
          </p>

          {!isScanning ? (
            <button className="patient-btn btn-primary" onClick={startScanning} style={{ maxWidth: '400px' }}>
              <Camera size={28} /> Start Scanning
            </button>
          ) : (
            <div className="camera-container" style={{ margin: '0 auto', maxWidth: '600px' }}>
              {!isSimulation ? (
                <video ref={videoRef} autoPlay playsInline className="camera-video" />
              ) : (
                <div className="simulation-placeholder">
                  <div className="sim-avatar" style={{ borderStyle: 'solid', animation: 'pulse 2s infinite' }}>
                    <User size={80} color="var(--primary)" />
                  </div>
                  <p style={{ fontWeight: '700', letterSpacing: '2px', color: '#fbbf24' }}>VIRTUAL SENSOR ACTIVE</p>
                </div>
              )}
              <div className="scanner-overlay" />
              <div className="scan-line" />
              <div className="scan-pulse" />
              <div style={{ position: 'absolute', bottom: '1rem', left: '0', right: '0', textAlign: 'center', color: 'white', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 20 }}>
                {isSimulation ? "MATCHING AGAINST DATABASE..." : "ANALYZING BIOMETRICS..."}
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '2rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}
        </div>
      ) : (
        <div className="id-result animate-fade-in">
          <div className="id-photo-frame">
            <img src={identifiedPerson.photo} alt={identifiedPerson.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
              <UserCheck size={24} />
              <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Identity Verified</span>
            </div>
            <h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-light)' }}>{identifiedPerson.name}</h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '600' }}>
              This is your {identifiedPerson.relation}
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '1rem', border: '1px solid #dcfce7' }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
                "They love you very much and are here to help."
              </p>
            </div>
            <button 
              className="patient-btn btn-primary" 
              onClick={() => setIdentifiedPerson(null)} 
              style={{ marginTop: '2rem', padding: '1rem', fontSize: '1.1rem', background: '#94a3b8' }}
            >
              Scan Someone Else
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceScanner;
