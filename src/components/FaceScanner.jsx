import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Scan, ShieldCheck, UserCheck, AlertCircle, User, XCircle } from 'lucide-react';

const FaceScanner = () => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [identifiedPerson, setIdentifiedPerson] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [isSimulation, setIsSimulation] = useState(false);

  // Use a ref to track if identification is in progress to avoid double-triggers
  const isProcessing = useRef(false);

  // Initialize camera once when component mounts or when isScanning changes
  useEffect(() => {
    if (isScanning && !stream) {
      initCamera();
    }
    // Cleanup: Only stop camera when component unmounts or identification is complete
    return () => {
      if (!isScanning && stream) {
        stopCamera();
      }
    };
  }, [isScanning]);

  const initCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsSimulation(false);
    } catch (err) {
      console.warn("Camera hardware not found. Switching to Simulated Scanner.", err);
      setIsSimulation(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleStartScan = () => {
    setIdentifiedPerson(null);
    setError(null);
    setIsScanning(true);
    isProcessing.current = true;

    // Wait 3 seconds then process identification
    setTimeout(() => {
      if (isProcessing.current) {
        performIdentification();
      }
    }, 3000);
  };

  const performIdentification = () => {
    const saved = localStorage.getItem('relatives');
    const relatives = saved ? JSON.parse(saved) : [];
    
    // Logic for "Unknown" vs "Identified"
    // For demo: if no relatives, or 20% chance of unknown
    const isUnknown = relatives.length === 0 || Math.random() < 0.2;
    
    let match = null;
    let eventType = 'identification_unknown';
    let personName = 'Unknown Person';

    if (!isUnknown) {
      match = relatives[Math.floor(Math.random() * relatives.length)];
      setIdentifiedPerson(match);
      eventType = 'identification_match';
      personName = match.name;
    } else {
      setError("Unknown person detected. Alert sent to caretaker.");
      eventType = 'identification_unknown';
    }

    // Send Alert to Caretaker via LocalStorage
    const alertData = {
      id: Date.now(),
      type: eventType,
      name: personName,
      time: new Date().toLocaleTimeString(),
      photo: match ? match.photo : null
    };
    
    localStorage.setItem('last_identification_alert', JSON.stringify(alertData));
    
    isProcessing.current = false;
    setIsScanning(false);
    stopCamera();
  };

  const reset = () => {
    setIdentifiedPerson(null);
    setError(null);
    setIsScanning(false);
    isProcessing.current = false;
  };

  return (
    <div className="face-scanner-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {!identifiedPerson && !error ? (
        <div className="patient-card" style={{ padding: '3rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-block' }}>
            <Scan size={64} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Who is here?</h2>
          
          {!isScanning ? (
            <>
              <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '2rem' }}>
                Stand in front of the camera and I will help you remember who they are.
              </p>
              <button className="patient-btn btn-primary" onClick={handleStartScan} style={{ maxWidth: '400px' }}>
                <Camera size={28} /> Start Scanning
              </button>
            </>
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
              <div style={{ position: 'absolute', bottom: '1rem', left: '0', right: '0', textAlign: 'center', color: 'white', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 20 }}>
                SCANNING BIOMETRICS...
              </div>
            </div>
          )}
        </div>
      ) : identifiedPerson ? (
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
            <button className="patient-btn btn-primary" onClick={reset} style={{ marginTop: '2rem', padding: '1rem', background: '#94a3b8' }}>
              Scan Someone Else
            </button>
          </div>
        </div>
      ) : (
        <div className="patient-card animate-fade-in" style={{ padding: '3rem', border: '2px solid var(--danger)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-block' }}>
            <XCircle size={64} color="var(--danger)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>Unknown Person</h2>
          <p style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '2rem' }}>
            I don't recognize this person. I have alerted your caretaker for safety.
          </p>
          <button className="patient-btn btn-primary" onClick={reset} style={{ maxWidth: '400px' }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceScanner;
