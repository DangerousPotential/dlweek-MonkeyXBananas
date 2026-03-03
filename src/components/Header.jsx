import React, { useContext, useState } from 'react';
import { IncidentContext } from '../IncidentContext';
import { Bell, Search, User, ShieldAlert, Zap } from 'lucide-react';
import ReportModal from './ReportModal';

const Header = () => {
    const { metrics, searchQuery, setSearchQuery, triggerDemoScenario } = useContext(IncidentContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <header className="app-header">
                <div className="header-search">
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Search incidents, sectors, or resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="header-actions">
                    <button className="report-btn" onClick={triggerDemoScenario} style={{ background: '#a855f7', animation: 'none' }}>
                        <Zap size={18} />
                        <span>Run Demo</span>
                    </button>
                    <button className="report-btn" onClick={() => setIsModalOpen(true)}>
                        <ShieldAlert size={18} />
                        <span>Report Incident</span>
                    </button>
                    <button className="action-btn" onClick={() => alert('No new notifications.')}>
                        <Bell size={20} />
                        {metrics.activeIncidents > 0 && (
                            <span style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--severity-critical)', borderRadius: '50%' }}></span>
                        )}
                    </button>
                    <button className="action-btn" onClick={() => alert('User profile settings clicked.')}>
                        <User size={20} />
                    </button>
                </div>
            </header>

            {isModalOpen && <ReportModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default Header;
