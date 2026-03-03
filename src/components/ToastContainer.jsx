import React, { useContext } from 'react';
import { IncidentContext } from '../IncidentContext';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContainer = () => {
    const { toasts } = useContext(IncidentContext);

    const getIcon = (type) => {
        switch (type) {
            case 'Critical': return <AlertCircle size={20} color="var(--severity-critical)" />;
            case 'High': return <AlertTriangle size={20} color="var(--severity-high)" />;
            case 'Warning': return <AlertTriangle size={20} color="var(--severity-warning)" />;
            case 'Success': return <CheckCircle size={20} color="#22c55e" />;
            default: return <Info size={20} color="var(--accent-blue)" />;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none'
        }}>
            {toasts.map(toast => (
                <div key={toast.id} style={{
                    background: 'var(--bg-panel)',
                    backdropFilter: 'var(--glass-blur)',
                    border: '1px solid var(--border-light)',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    pointerEvents: 'auto',
                    minWidth: '300px'
                }}>
                    {getIcon(toast.type)}
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', flex: 1 }}>{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
