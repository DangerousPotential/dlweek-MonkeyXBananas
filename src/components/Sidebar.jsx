import React from 'react';
import { Activity, Map, FileText, Settings, Radio } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="app-sidebar">
            <div className="brand">
                <Radio className="brand-icon" size={28} />
                <h1>AuraSafe</h1>
            </div>

            <nav className="sidebar-nav">
                <div
                    className={`nav-item ${activeTab === 'Live Dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Live Dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    <Activity size={20} />
                    <span>Live Dashboard</span>
                </div>
                <div
                    className={`nav-item ${activeTab === 'Sector Map' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Sector Map')}
                    style={{ cursor: 'pointer' }}
                >
                    <Map size={20} />
                    <span>Sector Map</span>
                </div>
                <div
                    className={`nav-item ${activeTab === 'Incident Reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Incident Reports')}
                    style={{ cursor: 'pointer' }}
                >
                    <FileText size={20} />
                    <span>Incident Reports</span>
                </div>
                <div
                    className={`nav-item ${activeTab === 'System Settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('System Settings')}
                    style={{ cursor: 'pointer' }}
                >
                    <Settings size={20} />
                    <span>System Settings</span>
                </div>
            </nav>

            <div style={{ marginTop: 'auto', padding: '0 16px' }}>
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System Status</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>All Sensors Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
