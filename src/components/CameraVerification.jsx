import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, User, Upload, AlertCircle } from 'lucide-react';

const CameraVerification = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSimulation, setIsSimulation] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
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
      console.warn("Camera hardware not found or permission denied. Switching to Simulation Mode.", err);
      setIsSimulation(true);
      // We don't set a hard error here, just inform via UI
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (isSimulation) {
      // Simulate capture with a placeholder or prompt for file
      fileInputRef.current.click();
      return;
    }
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');
    setCapturedImage(imageData);
    onCapture(imageData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        onCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    if (!isSimulation) startCamera();
  };

  return (
    <div className="camera-component">
      <div className="camera-container">
        {!capturedImage ? (
          <>
            {!isSimulation ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="camera-video"
                />
                <div className="camera-overlay" />
              </>
            ) : (
              <div className="simulation-placeholder animate-fade-in">
                <div className="sim-avatar">
                  <User size={64} color="var(--primary)" opacity={0.5} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fbbf24' }}>
                  <AlertCircle size={16} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>SIMULATION MODE ACTIVE</span>
                </div>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, maxWidth: '250px', marginBottom: '1.5rem' }}>
                  No camera detected. Please upload a photo to verify identity.
                </p>
                <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
                  <Upload size={16} style={{ marginRight: '0.5rem' }} /> Choose Photo
                </button>
              </div>
            )}
          </>
        ) : (
          <img src={capturedImage} alt="Captured" className="camera-video" />
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {!capturedImage ? (
          <button className="capture-btn" onClick={capturePhoto}>
            {isSimulation ? <Upload size={20} /> : <Camera size={20} />} 
            {isSimulation ? "Upload Biometrics" : "Verify Relative"}
          </button>
        ) : (
          <>
            <button className="capture-btn" onClick={reset} style={{ backgroundColor: '#4b5563' }}>
              <RefreshCw size={20} /> Retake
            </button>
            <button className="capture-btn" style={{ backgroundColor: '#10b981' }}>
              <Check size={20} /> Verified
            </button>
          </>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleFileUpload} 
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
    </div>
  );
};

export default CameraVerification;
