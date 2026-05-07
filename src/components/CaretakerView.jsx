import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Settings, LogOut, Plus, ShieldCheck, 
  Camera, CheckCircle, Info, Trash2, Edit2, AlertTriangle, Bell, UserX, UserCheck
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
  const [activeView, setActiveView] = useState('dashboard');
  
  // SOS & Identification Alerts
  const [sosActive, setSosActive] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [lastAlert, setLastAlert] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('relatives');
    if (saved) setRelatives(JSON.parse(saved));

    const savedLog = localStorage.getItem('activity_log');
    if (savedLog) setActivityLog(JSON.parse(savedLog));

    const handleStorageChange = (e) => {
      if (e.key === 'sos_trigger') {
        setSosActive(true);
        addActivity('EMERGENCY SOS TRIGGERED', 'danger');
      }
      
      if (e.key === 'last_identification_alert') {
        const alert = JSON.parse(e.newValue);
        setLastAlert(alert);
        addActivity(`${alert.type === 'identification_match' ? 'Verified' : 'UNKNOWN'} person detected: ${alert.name}`, alert.type === 'identification_match' ? 'success' : 'warning');
        setTimeout(() => setLastAlert(null), 5000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addActivity = (message, type) => {
    const newEvent = { id: Date.now(), message, type, time: new Date().toLocaleTimeString() };
    setActivityLog(prev => {
      const updated = [newEvent, ...prev].slice(0, 10);
      localStorage.setItem('activity_log', JSON.stringify(updated));
      return updated;
    });
  };

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

  const acknowledgeSOS = () => {
    setSosActive(false);
    localStorage.removeItem('sos_trigger');
  };

  const renderDashboard = () => (
    <div className="animate-fade-in">
      {lastAlert && (
        <div className={`caretaker-card animate-fade-in`} style={{ background: lastAlert.type === 'identification_match' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${lastAlert.type === 'identification_match' ? 'var(--accent)' : 'var(--danger)'}`, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lastAlert.type === 'identification_match' ? <UserCheck color="var(--accent)" /> : <UserX color="var(--danger)" />}
          <div>
            <h4 style={{ color: lastAlert.type === 'identification_match' ? 'var(--accent)' : 'var(--danger)' }}>
              {lastAlert.type === 'identification_match' ? 'Relative Identified' : 'SECURITY ALERT: Unknown Person'}
            </h4>
            <p style={{ fontSize: '0.9rem' }}>{lastAlert.name} was seen by the patient at {lastAlert.time}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="caretaker-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--primary)" /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activityLog.length === 0 ? (
              <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>No recent activity.</p>
            ) : (
              activityLog.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', borderLeft: `4px solid ${log.type === 'danger' ? 'var(--danger)' : log.type === 'success' ? 'var(--accent)' : 'var(--primary)'}` }}>
                   <span>{log.message}</span>
                   <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="caretaker-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Verified Relatives</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {relatives.length === 0 ? (
              <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>No relatives registered yet.</p>
            ) : (
              relatives.slice(0, 5).map(rel => (
                <div key={rel.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                  <img src={rel.photo} alt={rel.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{rel.name}</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{rel.relation}</p>
                  </div>
                </div>
              ))
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
          <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{relatives.length} Members Registered</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {relatives.map(rel => (
            <div key={rel.id} className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', textAlign: 'center', position: 'relative' }}>
              <button 
                onClick={() => {
                  const updated = relatives.filter(r => r.id !== rel.id);
                  setRelatives(updated);
                  localStorage.setItem('relatives', JSON.stringify(updated));
                }}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.5 }}
              >
                <Trash2 size={18} />
              </button>
              <img src={rel.photo} alt={rel.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ margin: 0 }}>{rel.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>{rel.relation}</p>
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
            <input type="checkbox" defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>Simulation Mode</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Always use virtual sensors even if hardware is available.</p>
            </div>
            <input type="checkbox" checked={isSimulationMode} onChange={e => setIsSimulationMode(e.target.checked)} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="caretaker-view animate-fade-in">
      {/* SOS Alert Modal - REFACTORED FOR BETTER ALIGNMENT */}
      {sosActive && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)',
          zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '2rem'
        }}>
          <div className="animate-fade-in" style={{ 
            background: 'var(--danger)', color: 'white', padding: '4rem', 
            borderRadius: '2.5rem', textAlign: 'center', maxWidth: '600px', 
            boxShadow: '0 0 50px rgba(239, 68, 68, 0.5)',
            border: '4px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ animation: 'pulse 1s infinite', marginBottom: '2rem' }}>
              <AlertTriangle size={80} strokeWidth={3} />
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              EMERGENCY SOS
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.9, lineHeight: 1.4 }}>
              The patient has triggered an emergency alert and needs <strong>immediate assistance</strong>.
            </p>
            <button 
              className="patient-btn" 
              onClick={acknowledgeSOS}
              style={{ 
                background: 'white', color: 'var(--danger)', width: '100%', 
                height: '80px', fontSize: '1.8rem', fontWeight: '800',
                borderRadius: '1.5rem', border: 'none', cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              I AM RESPONDING
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
          <div onClick={() => setActiveView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: activeView === 'dashboard' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', color: activeView === 'dashboard' ? 'var(--primary)' : 'white', cursor: 'pointer' }}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div onClick={() => setActiveView('relatives')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: activeView === 'relatives' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', color: activeView === 'relatives' ? 'var(--primary)' : 'white', cursor: 'pointer' }}>
            <Users size={20} /> Relatives
          </div>
          <div onClick={() => setActiveView('settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: activeView === 'settings' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', color: activeView === 'settings' ? 'var(--primary)' : 'white', cursor: 'pointer' }}>
            <Settings size={20} /> Settings
          </div>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', color: 'white', opacity: 0.6, cursor: 'pointer' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', textTransform: 'capitalize' }}>{activeView}</h1>
          <button className="capture-btn" onClick={() => setIsRegistering(true)} style={{ margin: 0 }}>
            <Plus size={20} /> Register Relative
          </button>
        </header>

        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'relatives' && renderRelatives()}
        {activeView === 'settings' && renderSettings()}

        {isRegistering && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="caretaker-card" style={{ width: '600px', margin: 0 }}>
              <h2>Register Relative</h2>
              <form onSubmit={handleRegister}>
                <div className="input-group"><label>Name</label><input required value={newRelative.name} onChange={e => setNewRelative({...newRelative, name: e.target.value})} /></div>
                <div className="input-group"><label>Relation</label><input required value={newRelative.relation} onChange={e => setNewRelative({...newRelative, relation: e.target.value})} /></div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Verification</label>
                  {!hasCameraPermission ? (
                    <button type="button" onClick={requestPermission} className="camera-permission-btn">Grant Camera Permission</button>
                  ) : (
                    <CameraVerification onCapture={photo => setNewRelative({...newRelative, photo})} />
                  )}
                </div>
                <button type="submit" className="patient-btn btn-primary">Complete</button>
                <button type="button" onClick={() => setIsRegistering(false)} style={{ background: 'none', border: 'none', color: 'white', marginTop: '1rem' }}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaretakerView;
