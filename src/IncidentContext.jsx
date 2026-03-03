import React, { createContext, useState, useEffect, useCallback } from 'react';

export const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
    const [incidents, setIncidents] = useState([
        { id: 1, type: 'Fire', location: 'Sector 4, Main St', severity: 'Critical', time: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(), status: 'Active', pos: { x: '30%', y: '20%' }, contactName: null },
        { id: 2, type: 'Medical Emergency', location: 'North Park', severity: 'High', time: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString(), status: 'Responder En Route', pos: { x: '70%', y: '60%' }, deployedAgency: 'scdf', contactName: 'Lta. Wong (SCDF)' },
        { id: 3, type: 'Suspicious Activity', location: 'Transit Hub', severity: 'Warning', time: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(), status: 'Investigating', pos: { x: '50%', y: '40%' }, deployedAgency: 'spf', contactName: 'Insp. Tan (SPF)' },
    ]);

    const [metrics, setMetrics] = useState({
        activeIncidents: 3,
        avgResponseTime: '4m 12s',
        unitsDeployed: 5430,
        safetyScore: 84,
        resources: {
            spf: 2150,   // Singapore Police Force
            scdf: 1840,  // Singapore Civil Defence Force
            saf: 1200,   // Singapore Armed Forces
            nea: 240     // National Environment Agency
        }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState([]);

    // AI Mock State
    const [aiPrediction, setAiPrediction] = useState({
        active: false,
        sector: 'Sector 7',
        risk: 'High priority of public disturbance due to overcrowded event in 45 mins.',
        actionTaken: false
    });

    const addToast = useCallback((message, type) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [{ id, message, type }, ...prev]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const generateRandomPos = () => ({
        x: Math.random() * 80 + 10 + '%',
        y: Math.random() * 80 + 10 + '%'
    });

    const addIncident = useCallback((incident) => {
        const newIncident = {
            ...incident,
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            status: 'Reported',
            pos: incident.pos || generateRandomPos()
        };

        setIncidents(prev => [newIncident, ...prev]);
        setMetrics(prev => ({
            ...prev,
            activeIncidents: prev.activeIncidents + 1,
            safetyScore: Math.max(0, prev.safetyScore - (newIncident.severity === 'Critical' ? 3 : 1))
        }));

        // Trigger Toast Notification on new incident
        if (newIncident.status === 'Reported') {
            addToast(`Alert: ${newIncident.type} reported at ${newIncident.location}`, newIncident.severity);
        }
    }, [addToast]);

    const dispatchUnit = useCallback((id) => {
        setIncidents(prev => prev.map(inc => {
            if (inc.id === id && inc.status !== 'Responder En Route' && inc.status !== 'Resolved') {
                const isFireOrMedical = inc.type.includes('Fire') || inc.type.includes('Medical');
                const agency = isFireOrMedical ? 'scdf' : 'spf';

                let rep = '';
                if (agency === 'spf') {
                    const spfNames = ['Insp. Tan (SPF)', 'Sgt. Lim (SPF)', 'Cpl. Kumar (SPF)', 'SSgt. Raj (SPF)', 'Supt. Lee (SPF)'];
                    rep = spfNames[Math.floor(Math.random() * spfNames.length)];
                } else {
                    const scdfNames = ['Cpt. Rahman (SCDF)', 'Lta. Wong (SCDF)', 'Sgt. Abdullah (SCDF)', 'WO. Teo (SCDF)', 'Maj. Menon (SCDF)'];
                    rep = scdfNames[Math.floor(Math.random() * scdfNames.length)];
                }

                setMetrics(m => ({
                    ...m,
                    unitsDeployed: m.unitsDeployed + 1,
                    resources: { ...m.resources, [agency]: m.resources[agency] + 1 }
                }));
                addToast(`${agency.toUpperCase()} unit dispatched to Incident #${id.toString().slice(-4)}`, 'Success');
                return { ...inc, status: 'Responder En Route', deployedAgency: agency, contactName: rep };
            }
            return inc;
        }));
    }, [addToast]);

    const resolveIncident = useCallback((id) => {
        setIncidents(prev => prev.map(inc => {
            if (inc.id === id && inc.status === 'Responder En Route') {
                const agency = inc.deployedAgency || 'spf';
                setMetrics(m => ({
                    ...m,
                    unitsDeployed: Math.max(0, m.unitsDeployed - 1),
                    activeIncidents: Math.max(0, m.activeIncidents - 1),
                    safetyScore: Math.min(100, m.safetyScore + (inc.severity === 'Critical' ? 3 : 1)),
                    resources: { ...m.resources, [agency]: Math.max(0, m.resources[agency] - 1) }
                }));
                addToast(`Incident #${id.toString().slice(-4)} resolved`, 'Info');
                return { ...inc, status: 'Resolved', severity: 'Info' };
            }
            return inc;
        }));
    }, [addToast]);

    const executeAiAction = useCallback(() => {
        setAiPrediction(prev => ({ ...prev, actionTaken: true }));
        setMetrics(m => ({
            ...m,
            unitsDeployed: m.unitsDeployed + 4,
            safetyScore: Math.min(100, m.safetyScore + 2),
            resources: { ...m.resources, spf: m.resources.spf + 2, saf: m.resources.saf + 2 }
        }));
        addToast('Multi-agency force (SPF & SAF) auto-deployed to Sector 7.', 'Success');
    }, [addToast]);

    const triggerDemoScenario = useCallback(() => {
        addToast('Simulation Demo Started...', 'Info');

        // Step 1: Critical Incident
        setTimeout(() => {
            addIncident({
                type: 'Major Chemical Spill',
                location: 'Sector 2 Industrial Park',
                severity: 'Critical',
                pos: { x: '40%', y: '15%' }
            });
        }, 1500);

        // Step 2: AI Predictive Insight
        setTimeout(() => {
            setAiPrediction({
                active: true,
                sector: 'Sector 7',
                risk: 'Aura AI detected coordinated anomalies. 92% probability of imminent crowd crush. Pre-emptive action required.',
                actionTaken: false
            });
            addToast('Aura AI Predictive Insight generated.', 'Warning');
        }, 4500);
    }, [addIncident, addToast]);

    // Live Data Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const types = ['Public Disturbance', 'Traffic Accident', 'Suspicious Activity', 'Medical Emergency'];
            const severities = ['Info', 'Warning', 'High', 'Critical'];

            // 10% chance every 5 seconds to spawn a new random incident
            if (Math.random() > 0.90) {
                addIncident({
                    type: types[Math.floor(Math.random() * types.length)],
                    location: `Sector ${Math.floor(Math.random() * 9) + 1}`,
                    severity: severities[Math.floor(Math.random() * severities.length)],
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [addIncident]);

    return (
        <IncidentContext.Provider value={{
            incidents, metrics, addIncident, dispatchUnit, resolveIncident,
            searchQuery, setSearchQuery, toasts, aiPrediction, executeAiAction,
            triggerDemoScenario
        }}>
            {children}
        </IncidentContext.Provider>
    );
};
