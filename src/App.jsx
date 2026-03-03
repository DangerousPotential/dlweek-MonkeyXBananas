import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import SectorMap from './components/SectorMap'
import IncidentReports from './components/IncidentReports'
import SystemSettings from './components/SystemSettings'
import ToastContainer from './components/ToastContainer'

function App() {
    const [activeTab, setActiveTab] = useState('Live Dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'Live Dashboard':
                return <Dashboard />;
            case 'Sector Map':
                return <SectorMap />;
            case 'Incident Reports':
                return <IncidentReports />;
            case 'System Settings':
                return <SystemSettings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app-container">
            <ToastContainer />
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="main-content">
                <Header />
                {renderContent()}
            </div>
        </div>
    )
}

export default App
