import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { IncidentProvider } from './IncidentContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <IncidentProvider>
            <App />
        </IncidentProvider>
    </React.StrictMode>,
)
