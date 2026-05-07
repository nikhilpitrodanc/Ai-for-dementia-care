import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Settings, LogOut, Plus, ShieldCheck, 
  Camera, CheckCircle, Info, Trash2, Edit2, AlertTriangle, Bell
} from 'lucide-react';
import CameraVerification from './CameraVerification';
import { useNavigate } from 'react-router-dom';

const CaretakerView = () => {
  const navigate = useNavigate();
  const [relatives, setRelatives] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [newRelative, setNewRelative] = useState({ name: '', relation: '', photo: '' });
  
  // Navigation State
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, relatives, settings
  
  // SOS State
  const [sosActive, setSosActive] = useState(false);
  const [sosTime, setSosTime] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('relatives');
    if (saved) setRelatives(JSON.parse(saved));

    // Listen for SOS trigger from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'sos_trigger') {
        setSosActive(true);
        setSosTime(new Date().toLocaleTimeString());
        // Play alert sound if needed
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsSimulationMode(false);
    } catch (err) {
      setHasCameraPermission(true);
      setIsSimulationMode(true);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!newRelative.photo) {
      alert("Please verify identity first.");
      return;
    }
    const updated = [...relatives, { ...newRelative, id: Date.now() }];
    setRelatives(updated);
    localStorage.setItem('relatives', JSON.stringify(updated));
    setIsRegistering(false);
    setNewRelative({ name: '', relation: '', photo: '' });
    setHasCameraPermission(false);
  };

  const deleteRelative = (id) => {
    const updated = relatives.filter(r => r.id !== id);
    setRelatives(updated);
    localStorage.setItem('relatives', JSON.stringify(updated));
  };

  const acknowledgeSOS = () => {
    setSosActive(false);
    localStorage.removeItem('sos_trigger');
  };

  // Render Sub-Views
  const renderDashboard = () => (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="caretaker-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}></div>
            Patient Status: Stable
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Last Activity</p>
              <p>Browsed family gallery 5 mins ago</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Next Medication</p>
              <p>12:00 PM - Aricept (5mg)</p>
            </div>
          </div>
        </div>

        <div className="caretaker-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Verified Relatives</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {relatives.length === 0 ? (
              <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>No relatives registered yet.</p>
            ) : (
              relatives.slice(0, 3).map(rel => (
                <div key={rel.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                  <img src={rel.photo} alt={rel.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: '600' }}>{rel.name}</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{rel.relation}</p>
                  </div>
                </div>
              ))
            )}
            {relatives.length > 3 && (
              <button onClick={() => setActiveView('relatives')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}>
                View all {relatives.length} relatives
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRelatives = () => (
    <div className="animate-fade-in">
      <div className="caretaker-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Family Database</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{relatives.length} Members Registered</span>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {relatives.map(rel => (
            <div key={rel.id} className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', textAlign: 'center', position: 'relative' }}>
              <button 
                onClick={() => deleteRelative(rel.id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.5 }}
              >
                <Trash2 size={18} />
              </button>
              <img src={rel.photo} alt={rel.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ margin: 0 }}>{rel.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '1rem' }}>{rel.relation}</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button className="upload-btn" style={{ fontSize: '0.8rem' }}><Edit2 size={14} /> Edit</button>
              </div>
            </div>
          ))}
          <div 
            onClick={() => setIsRegistering(true)}
            style={{ border: '2px dashed var(--glass-border)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px', cursor: 'pointer', opacity: 0.6 }}
          >
            <Plus size={32} />
            <p>Add Member</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-fade-in">
      <div className="caretaker-card" style={{ maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '2rem' }}>General Settings</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>SOS Sound Alerts</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Play a loud sound when an emergency is triggered.</p>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '40px', height: '20px' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>Biometric Strictness</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Require higher resolution photos for verification.</p>
            </div>
            <select style={{ background: '#1e293b', color: 'white', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <option>Standard</option>
              <option>Strict</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>Simulation Mode</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Always use virtual sensors even if hardware is available.</p>
            </div>
            <input type="checkbox" checked={isSimulationMode} onChange={e => setIsSimulationMode(e.target.checked)} style={{ width: '40px', height: '20px' }} />
          </div>
        </div>

        <button className="patient-btn btn-primary" style={{ marginTop: '2rem', padding: '1rem', width: '200px' }}>
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="caretaker-view animate-fade-in">
      {/* Emergency Overlay */}
      {sosActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(239, 68, 68, 0.95)', zIndex: 10000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', animation: 'pulse 1s infinite' }}>
          <AlertTriangle size={120} style={{ marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '5rem', fontWeight: '900', textAlign: 'center', marginBottom: '1rem' }}>EMERGENCY SOS</h1>
          <p style={{ fontSize: '2rem', marginBottom: '3rem' }}>The patient needs immediate assistance! Triggered at {sosTime}</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button 
              className="patient-btn btn-emergency" 
              onClick={acknowledgeSOS}
              style={{ background: 'white', color: 'var(--danger)', width: '300px', height: '80px', fontSize: '1.5rem' }}
            >
              Acknowledge & Clear
            </button>
          </div>
        </div>
      )}

      <div className="sidebar">
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--primary)', fontWeight: '700' }}>CarePortal</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Caretaker Dashboard</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div 
            onClick={() => setActiveView('dashboard')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', 
              background: activeView === 'dashboard' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', 
              color: activeView === 'dashboard' ? 'var(--primary)' : 'white',
              cursor: 'pointer', opacity: activeView === 'dashboard' ? 1 : 0.7
            }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div 
            onClick={() => setActiveView('relatives')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', 
              background: activeView === 'relatives' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', 
              color: activeView === 'relatives' ? 'var(--primary)' : 'white',
              cursor: 'pointer', opacity: activeView === 'relatives' ? 1 : 0.7
            }}
          >
            <Users size={20} /> Relatives
          </div>
          <div 
            onClick={() => setActiveView('settings')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', 
              background: activeView === 'settings' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', 
              color: activeView === 'settings' ? 'var(--primary)' : 'white',
              cursor: 'pointer', opacity: activeView === 'settings' ? 1 : 0.7
            }}
          >
            <Settings size={20} /> Settings
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', color: 'white', opacity: 0.6, cursor: 'pointer' }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{activeView}</h1>
            <p style={{ opacity: 0.6 }}>
              {activeView === 'dashboard' && "Overview of patient status and relatives."}
              {activeView === 'relatives' && "Manage family members and biometric data."}
              {activeView === 'settings' && "Configure portal alerts and preferences."}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {sosActive && (
               <div style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'pulse 1s infinite' }}>
                 <Bell size={16} /> SOS ACTIVE
               </div>
            )}
            <button 
              className="capture-btn" 
              onClick={() => setIsRegistering(true)}
              style={{ margin: 0 }}
            >
              <Plus size={20} /> Register Relative
            </button>
          </div>
        </header>

        {isSimulationMode && activeView === 'dashboard' && (
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', color: '#fbbf24', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Info size={20} />
            <p style={{ fontSize: '0.9rem' }}>
              <strong>Notice:</strong> No camera hardware detected. Using <strong>Simulation Mode</strong> for testing.
            </p>
          </div>
        )}

        {/* Content Area */}
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'relatives' && renderRelatives()}
        {activeView === 'settings' && renderSettings()}

        {/* Registration Modal Overlay */}
        {isRegistering && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }}>
            <div className="caretaker-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Register New Relative</h2>
                <button onClick={() => setIsRegistering(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
              </div>

              <form onSubmit={handleRegister}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter name" 
                    value={newRelative.name}
                    onChange={e => setNewRelative({...newRelative, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Relationship</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Son, Daughter, Brother" 
                    value={newRelative.relation}
                    onChange={e => setNewRelative({...newRelative, relation: e.target.value})}
                    required
                  />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '1rem', opacity: 0.8 }}>Identity Verification</label>
                  
                  {!hasCameraPermission ? (
                    <div className="permission-dialog glass" style={{ borderRadius: '1rem' }}>
                      <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                      <h3>Camera Verification</h3>
                      <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Capture a verification photo for the biometric database.</p>
                      <button type="button" className="camera-permission-btn" onClick={requestPermission}>
                        Start Biometric Capture
                      </button>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isSimulationMode ? '#fbbf24' : 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {isSimulationMode ? <Info size={16} /> : <CheckCircle size={16} />} 
                        {isSimulationMode ? "Simulation Mode Active" : "Biometric verification active"}
                      </div>
                      <CameraVerification onCapture={(photo) => setNewRelative({...newRelative, photo})} />
                    </div>
                  )}
                </div>

                <button type="submit" className="patient-btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                  Complete Registration
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaretakerView;
