import React, { useContext, useState } from 'react';
import { IncidentContext } from '../IncidentContext';
import { AlertTriangle, Clock, MapPin, Activity, X } from 'lucide-react';

const IncidentReports = () => {
    const { incidents, searchQuery } = useContext(IncidentContext);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [filterType, setFilterType] = useState('All');

    const filteredIncidents = incidents.filter(inc => {
        const matchesSearch = (inc.type || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
            (inc.location || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
            (inc.status || '').toLowerCase().includes((searchQuery || '').toLowerCase());

        const matchesFilter = filterType === 'All' ? true :
            filterType === 'Critical Only' ? inc.severity === 'Critical' :
                filterType === 'Active Only' ? inc.status !== 'Resolved' : true;

        return matchesSearch && matchesFilter;
    });

    const handleExportCSV = () => {
        const headers = ['ID', 'Type', 'Location', 'Severity', 'Time', 'Status', 'Deployed Agency', 'Contact Name'];
        const rows = filteredIncidents.map(inc => [
            inc.id,
            `"${inc.type}"`,
            `"${inc.location}"`,
            inc.severity,
            `"${inc.time}"`,
            inc.status,
            inc.deployedAgency || 'None',
            `"${inc.contactName || 'None'}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(',') + '\n'
            + rows.map(e => e.join(',')).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "incident_reports.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return 'var(--severity-critical)';
            case 'High': return 'var(--severity-high)';
            case 'Warning': return 'var(--severity-warning)';
            default: return 'var(--severity-info)';
        }
    };

    return (
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', animation: 'slide-in 0.4s ease forwards' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>All Incident Reports</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="glass-panel glass-panel-hover"
                        style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                        onClick={handleExportCSV}
                    >
                        Export CSV
                    </button>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="glass-panel"
                        style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', color: 'white', background: 'rgba(0,0,0,0.5)', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="All" style={{ color: 'black' }}>Filter: All</option>
                        <option value="Critical Only" style={{ color: 'black' }}>Critical Only</option>
                        <option value="Active Only" style={{ color: 'black' }}>Active Only</option>
                    </select>
                </div>
            </div>

            <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)' }}>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>ID / Time</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Type</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Location</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Severity</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Status</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncidents.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No incidents found matching "{searchQuery}"
                                </td>
                            </tr>
                        ) : null}
                        {filteredIncidents.map(inc => (
                            <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-light)' }} className="glass-panel-hover">
                                <td style={{ padding: '16px' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>#{inc.id.toString().slice(-6)}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {inc.time}</div>
                                </td>
                                <td style={{ padding: '16px', fontWeight: '500' }}>
                                    <Activity size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                    {inc.type}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                    {inc.location}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        color: getSeverityColor(inc.severity),
                                        padding: '4px 10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {inc.severity}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    {inc.status}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <button
                                        style={{ color: 'var(--accent-blue)', textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={() => setSelectedIncident(inc)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedIncident && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="glass-panel" style={{
                        width: '100%', maxWidth: '500px', padding: '30px',
                        borderRadius: 'var(--radius-lg)', position: 'relative',
                        animation: 'slide-in 0.3s ease forwards'
                    }}>
                        <button
                            onClick={() => setSelectedIncident(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity color="var(--accent-blue)" />
                            Incident #{selectedIncident.id.toString().slice(-6)}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
                                <strong>{selectedIncident.type}</strong>

                                <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
                                <span>{selectedIncident.location}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Time Reported:</span>
                                <span>{selectedIncident.time}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Severity:</span>
                                <span style={{ color: getSeverityColor(selectedIncident.severity), fontWeight: 'bold' }}>{selectedIncident.severity}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                                <span>{selectedIncident.status}</span>

                                {selectedIncident.deployedAgency && (
                                    <>
                                        <span style={{ color: 'var(--text-secondary)' }}>Assigned Agency:</span>
                                        <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{selectedIncident.deployedAgency}</span>

                                        <span style={{ color: 'var(--text-secondary)' }}>Unit Contact:</span>
                                        <span style={{ color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {selectedIncident.contactName || 'Pending Contact...'}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                                <h4 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Automated Situation Report:</h4>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    System detected anomaly matching <strong style={{ color: 'var(--accent-blue)' }}>{selectedIncident.type}</strong> patterns at precisely {selectedIncident.time}.
                                    Coordinates pinpointed at {selectedIncident.pos?.x || 'unknown'} / {selectedIncident.pos?.y || 'unknown'} tactical grid.
                                    {selectedIncident.status === 'Resolved'
                                        ? ' Situation has been neutralized. Responders have cleared the scene.'
                                        : ' Situation requires immediate oversight.'}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedIncident(null)}
                                className="glass-panel glass-panel-hover"
                                style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)' }}
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentReports;
