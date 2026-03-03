import React, { useContext } from 'react';
import { IncidentContext } from '../IncidentContext';
import { AlertTriangle, Clock, Users, ShieldCheck, Sparkles, Shield, Flame, Leaf } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockChartData = [
    { time: '08:00', incidents: 2 },
    { time: '10:00', incidents: 5 },
    { time: '12:00', incidents: 8 },
    { time: '14:00', incidents: 4 },
    { time: '16:00', incidents: 10 },
    { time: '18:00', incidents: 7 },
    { time: 'Now', incidents: 6 }
];

const Dashboard = () => {
    const { incidents, metrics, dispatchUnit, resolveIncident, searchQuery, aiPrediction, executeAiAction } = useContext(IncidentContext);

    const filteredIncidents = incidents.filter(inc =>
        (inc.type || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (inc.location || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (inc.status || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return 'var(--severity-critical)';
            case 'High': return 'var(--severity-high)';
            case 'Warning': return 'var(--severity-warning)';
            default: return 'var(--severity-info)';
        }
    };

    return (
        <main className="dashboard">
            <div className="metrics-row">
                <div className="glass-panel metric-card">
                    <p><AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px' }} /> Active Incidents</p>
                    <h2 style={{ color: metrics.activeIncidents > 0 ? 'var(--severity-warning)' : 'inherit' }}>{metrics.activeIncidents}</h2>
                </div>
                <div className="glass-panel metric-card">
                    <p><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Avg Response</p>
                    <h2>{metrics.avgResponseTime}</h2>
                </div>
                <div className="glass-panel metric-card">
                    <p><Users size={14} style={{ display: 'inline', marginRight: '4px' }} /> Active Units</p>
                    <h2>{metrics.unitsDeployed}</h2>
                </div>
                <div className="glass-panel metric-card">
                    <p><ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Safety Index</p>
                    <h2 style={{ color: metrics.safetyScore > 80 ? '#22c55e' : 'var(--severity-high)' }}>{metrics.safetyScore}/100</h2>
                </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #1d4ed8' }}>
                    <div style={{ background: 'rgba(29, 78, 216, 0.2)', padding: '10px', borderRadius: '50%' }}><Shield size={20} color="#3b82f6" /></div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>SPF (Police)</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.resources?.spf || 0} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Units</span></h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #b91c1c' }}>
                    <div style={{ background: 'rgba(185, 28, 28, 0.2)', padding: '10px', borderRadius: '50%' }}><Flame size={20} color="#ef4444" /></div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>SCDF (Civil Defence)</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.resources?.scdf || 0} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Units</span></h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #4d7c0f' }}>
                    <div style={{ background: 'rgba(77, 124, 15, 0.2)', padding: '10px', borderRadius: '50%' }}><ShieldCheck size={20} color="#84cc16" /></div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>SAF (Armed Forces)</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.resources?.saf || 0} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Units</span></h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #047857' }}>
                    <div style={{ background: 'rgba(4, 120, 87, 0.2)', padding: '10px', borderRadius: '50%' }}><Leaf size={20} color="#10b981" /></div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>NEA (Environment)</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.resources?.nea || 0} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Units</span></h3>
                    </div>
                </div>
            </div>

            {aiPrediction.active && !aiPrediction.actionTaken && (
                <div className="glass-panel" style={{
                    gridColumn: '1 / -1',
                    padding: '24px',
                    display: 'flex',
                    gap: '24px',
                    background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, transparent 100%)',
                    borderLeft: '4px solid #a855f7',
                    animation: 'slide-in 0.5s ease forwards'
                }}>
                    <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'fit-content' }}>
                        <Sparkles size={28} color="#a855f7" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#a855f7', fontWeight: 'bold', marginBottom: '8px' }}>Aura AI Predictive Insight: {aiPrediction.sector}</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{aiPrediction.risk}</p>
                    </div>
                    <button
                        onClick={executeAiAction}
                        style={{
                            background: '#a855f7',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '24px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            alignSelf: 'center',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Auto-Deploy Pre-emptive Units
                    </button>
                </div>
            )}

            <div className="glass-panel chart-container">
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>Incident Volatility Trends</h3>
                <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Line type="monotone" dataKey="incidents" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-panel)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel map-container">
                <div className="map-header">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Live Sector Map</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Auto-updating</span>
                </div>
                <div className="map-content">
                    {filteredIncidents.map(inc => {
                        const pos = inc.pos || { x: '50%', y: '50%' };
                        return (
                            <div
                                key={inc.id}
                                className="map-node"
                                style={{
                                    top: pos.y,
                                    left: pos.x,
                                    background: getSeverityColor(inc.severity),
                                    boxShadow: `0 0 10px ${getSeverityColor(inc.severity)}`
                                }}
                            >
                                <div className="node-tooltip">
                                    <strong>{inc.type}</strong>
                                    <br />{inc.location} (<span style={{ color: getSeverityColor(inc.severity) }}>{inc.status}</span>)
                                </div>
                            </div>
                        );
                    })}
                    <div style={{ opacity: 0.1, fontSize: '0.875rem', letterSpacing: '2px', pointerEvents: 'none' }}>MOCK TACTICAL GRID</div>
                </div>
            </div>

            <div className="incident-feed">
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px', paddingLeft: '4px' }}>Recent Alerts</h3>
                {filteredIncidents.map(inc => (
                    <div key={inc.id} className="glass-panel glass-panel-hover incident-card" data-severity={inc.severity}>
                        <div className="incident-header">
                            <span className="incident-title">{inc.type}</span>
                            <span className="incident-time">{inc.time}</span>
                        </div>
                        <div className="incident-location">
                            <AlertTriangle size={14} /> {inc.location}
                        </div>
                        <div className="incident-status" style={{
                            color: inc.severity === 'Critical' ? 'var(--severity-critical)' :
                                inc.severity === 'High' ? 'var(--severity-high)' : 'var(--text-primary)'
                        }}>
                            {inc.status}
                        </div>
                        <button
                            className="btn-dispatch"
                            onClick={() => inc.status === 'Responder En Route' ? resolveIncident(inc.id) : dispatchUnit(inc.id)}
                            disabled={inc.status === 'Resolved'}
                        >
                            {inc.status === 'Resolved' ? 'Resolved' : inc.status === 'Responder En Route' ? 'Resolve Incident' : 'Dispatch Unit'}
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Dashboard;
