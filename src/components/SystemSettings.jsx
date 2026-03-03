import React, { useState } from 'react';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        autoDispatch: false,
        soundAlerts: true,
        highContrast: false,
        dataRetention: '30'
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', animation: 'slide-in 0.4s ease forwards' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>System Settings</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1000px' }}>
                <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Operational Preferences</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontWeight: '500' }}>Auto-Dispatch AI</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Automatically deploy nearest unit for critical alerts.</p>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                <input
                                    type="checkbox"
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                    checked={settings.autoDispatch}
                                    onChange={(e) => handleChange('autoDispatch', e.target.checked)}
                                />
                                <span style={{
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: settings.autoDispatch ? 'var(--accent-blue)' : 'rgba(255,255,255,0.2)', transition: '.4s', borderRadius: '24px'
                                }}>
                                    <span style={{
                                        position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                        transform: settings.autoDispatch ? 'translateX(20px)' : 'translateX(0)'
                                    }}></span>
                                </span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontWeight: '500' }}>Sound Alerts</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play siren sound for incoming alerts.</p>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                <input
                                    type="checkbox"
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                    checked={settings.soundAlerts}
                                    onChange={(e) => handleChange('soundAlerts', e.target.checked)}
                                />
                                <span style={{
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: settings.soundAlerts ? 'var(--accent-blue)' : 'rgba(255,255,255,0.2)', transition: '.4s', borderRadius: '24px'
                                }}>
                                    <span style={{
                                        position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                        transform: settings.soundAlerts ? 'translateX(20px)' : 'translateX(0)'
                                    }}></span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Database & Compliance</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h4 style={{ fontWeight: '500', marginBottom: '8px' }}>Incident Data Retention</h4>
                            <select
                                value={settings.dataRetention}
                                onChange={(e) => handleChange('dataRetention', e.target.value)}
                                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', outline: 'none' }}
                            >
                                <option value="7">7 Days</option>
                                <option value="30">30 Days</option>
                                <option value="90">90 Days</option>
                                <option value="365">1 Year</option>
                            </select>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <button className="glass-panel glass-panel-hover" style={{ padding: '10px 16px', width: '100%', textAlign: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--severity-critical)' }}>
                                Clear Incident History
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Simulation Mode</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Toggle the automatic mock data generation for demo purposes.</p>
                    </div>
                    <button className="btn-dispatch">Configure Simulator</button>
                </div>
            </div>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', maxWidth: '1000px' }}>
                <button style={{ background: 'var(--accent-blue)', color: 'white', padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontWeight: '600' }} onClick={() => alert('Settings Saved')}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SystemSettings;
