import React, { useContext, useState } from 'react';
import { IncidentContext } from '../IncidentContext';
import { Activity, Clock, MapPin, X, ShieldAlert, Radio, Camera } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SectorMap = () => {
    const { incidents, searchQuery, aiPrediction, dispatchUnit, resolveIncident } = useContext(IncidentContext);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);

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

    // Singapore map bounds & styling logic
    const SG_CENTER = [1.3521, 103.8198];
    const mapBoxLightStyle = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    // Small helper to dynamically map the old 'pos' percentage data into realistic SG lat/long for display
    const convertPercentToSGLatLong = (posPercent) => {
        // SG approximate bounds
        const minLat = 1.25, maxLat = 1.45;
        const minLon = 103.65, maxLon = 103.95;

        // Strip '%' and parse
        let x = parseFloat(posPercent.x) || 50;
        let y = parseFloat(posPercent.y) || 50;

        const mappedLon = minLon + (maxLon - minLon) * (x / 100);
        // Note: Map Y is usually inverted from latitude
        const mappedLat = minLat + (maxLat - minLat) * ((100 - y) / 100);

        return [mappedLat, mappedLon];
    };

    // Custom map icon helper
    const getMapIcon = (severity) => {
        const color = getSeverityColor(severity);
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 10px ${color}; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    };

    const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId);

    return (
        <div style={{ flex: 1, padding: '24px', display: 'flex', gap: '24px', animation: 'slide-in 0.4s ease forwards' }}>
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                <div className="map-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Full Tactical Sector Map</h2>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Live Sensor Data overlay</span>
                </div>

                <div style={{ flex: 1, zIndex: 1 }}>
                    <MapContainer center={SG_CENTER} zoom={12} style={{ height: '100%', width: '100%', background: '#e5e7eb' }} zoomControl={false}>
                        <TileLayer
                            url={mapBoxLightStyle}
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {filteredIncidents.map(inc => {
                            const latLong = convertPercentToSGLatLong(inc.pos || { x: '50%', y: '50%' });
                            return (
                                <Marker
                                    key={inc.id}
                                    position={latLong}
                                    icon={getMapIcon(inc.severity)}
                                    eventHandlers={{
                                        click: () => setSelectedIncidentId(inc.id),
                                    }}
                                >
                                    <Popup className="light-popup">
                                        <div style={{ color: '#111827' }}>
                                            <strong style={{ display: 'block', fontSize: '1.2em', marginBottom: '4px' }}>{inc.type}</strong>
                                            <div style={{ fontSize: '0.9em', color: '#4b5563', marginBottom: '4px' }}>{inc.location}</div>
                                            <span style={{ color: getSeverityColor(inc.severity), fontWeight: 'bold' }}>{inc.status}</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {/* AI Prediction Highlight for a specific coordinate */}
                        {aiPrediction.active && !aiPrediction.actionTaken && (
                            <Circle
                                center={[1.30, 103.85]} // Approximate Sector 7 risk area
                                radius={2000}
                                pathOptions={{
                                    color: 'rgba(168, 85, 247, 0.8)',
                                    fillColor: 'rgba(168, 85, 247, 0.3)',
                                    fillOpacity: 1,
                                    weight: 2,
                                    className: 'pulse-circle'
                                }}
                            />
                        )}
                    </MapContainer>
                </div>
            </div>

            {selectedIncident && (
                <div className="glass-panel" style={{
                    width: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-md)',
                    animation: 'slide-in 0.3s ease forwards',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert color="var(--accent-blue)" size={20} />
                            Tactical Overlook
                        </h3>
                        <button onClick={() => setSelectedIncidentId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>INCIDENT TYPE</span>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <Activity size={16} color="var(--text-secondary)" /> {selectedIncident.type}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SEVERITY</span>
                                <div style={{
                                    color: getSeverityColor(selectedIncident.severity),
                                    fontWeight: 'bold',
                                    marginTop: '4px',
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem'
                                }}>
                                    {selectedIncident.severity}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>STATUS</span>
                                <div style={{ fontWeight: '500', marginTop: '4px' }}>
                                    {selectedIncident.status}
                                </div>
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>LOCATION & TIME</span>
                            <div style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                <MapPin size={16} color="var(--text-secondary)" /> {selectedIncident.location}
                            </div>
                            <div style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                <Clock size={16} color="var(--text-secondary)" /> Formed at {selectedIncident.time}
                            </div>
                            <div style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', color: 'var(--text-secondary)' }}>
                                <span>Grid Coordinates:</span> <span style={{ fontFamily: 'monospace' }}>[{parseFloat(selectedIncident.pos?.x || 0).toFixed(2)}, {parseFloat(selectedIncident.pos?.y || 0).toFixed(2)}]</span>
                            </div>
                        </div>

                        {selectedIncident.deployedAgency && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DISPATCHED RESOURCES</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a855f7', marginTop: '4px', textTransform: 'uppercase' }}>
                                        {selectedIncident.deployedAgency}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', marginTop: '4px' }}>
                                        Unit Contact: <strong>{selectedIncident.contactName || 'Pending'}</strong>
                                    </div>
                                </div>

                                <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            <Camera size={14} /> TACTICAL BODYCAM
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', animation: 'pulse-glow 2s infinite', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
                                            LIVE
                                        </div>
                                    </div>
                                    <div style={{ height: '140px', background: 'linear-gradient(45deg, #111, #222)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px)', backgroundSize: '100% 4px', zIndex: 2, pointerEvents: 'none' }}></div>
                                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', zIndex: 1, letterSpacing: '2px' }}>ESTABLISHING VIDEO LINK...</span>
                                        <div style={{ position: 'absolute', bottom: '8px', left: '12px', zIndex: 3, fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                                            {selectedIncident.deployedAgency.toUpperCase()} - CAM 01
                                        </div>
                                    </div>
                                </div>

                                <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        <Radio size={14} /> LIVE RADIO TRANSCRIPT
                                    </div>
                                    <div style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', height: '100px', overflowY: 'auto' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <span style={{ color: '#a855f7' }}>[COMMS]</span>
                                            <span>Unit dispatched. En route to sector.</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <span style={{ color: '#bae6fd' }}>[{selectedIncident.deployedAgency.toUpperCase()}]</span>
                                            <span>Copy command. ETA 2 minutes. Lights and sirens active.</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <span style={{ color: '#bae6fd' }}>[{selectedIncident.deployedAgency.toUpperCase()}]</span>
                                            <span>Arriving at scene. Assessing perimeter. Standby for SITREP...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                            <button
                                className="btn-dispatch"
                                style={{ width: '100%', padding: '12px' }}
                                onClick={() => selectedIncident.status === 'Responder En Route' ? resolveIncident(selectedIncident.id) : dispatchUnit(selectedIncident.id)}
                                disabled={selectedIncident.status === 'Resolved'}
                            >
                                {selectedIncident.status === 'Resolved' ? 'Incident Resolved' : selectedIncident.status === 'Responder En Route' ? 'Mark as Resolved' : 'Dispatch Tactical Unit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectorMap;
