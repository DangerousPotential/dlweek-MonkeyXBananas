import React, { useState, useContext } from 'react';
import { IncidentContext } from '../IncidentContext';

const ReportModal = ({ onClose }) => {
    const { addIncident } = useContext(IncidentContext);
    const [formData, setFormData] = useState({
        type: 'Suspicious Activity',
        location: '',
        severity: 'Warning',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.location) return;

        addIncident(formData);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Report Incident</h2>
                    <button className="action-btn" style={{ width: '32px', height: '32px' }} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label>Incident Type</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>Fire / Explosion</option>
                            <option>Medical Emergency</option>
                            <option>Suspicious Activity</option>
                            <option>Traffic Accident</option>
                            <option>Public Disturbance</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location (Sector or Address)</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Sector 7, Plaza"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Severity Level</label>
                        <select
                            value={formData.severity}
                            onChange={e => setFormData({ ...formData, severity: e.target.value })}
                        >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Warning">Warning</option>
                            <option value="Info">Info</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Additional Details (Optional)</label>
                        <textarea
                            rows="3"
                            placeholder="Describe the situation..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Submit Report</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
