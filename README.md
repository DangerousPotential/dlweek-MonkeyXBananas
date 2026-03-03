# 🛡️ AuraSafe Command Center: Tactical Dashboard

A sophisticated, interactive multi-agency command and control (C2) dashboard tailored specifically for public safety coordination. Built for speed, high-contrast readability, and real-time situational awareness during critical incidents.


---

## 🚀 Key Features

### 1. **Multi-Agency Integration Engine**
Unlike traditional dashboards that only track broad metric categories, AuraSafe is explicitly designed for multi-force deployment:

We introduce a hypothetical situation where these agents are well connected into our systems:

- **Singapore Police Force (SPF)** tracking and response mapping.
- **Singapore Civil Defence Force (SCDF)** fire and medical dispatch coordination.
- **Singapore Armed Forces (SAF)** integration for massive or critical deployments.
- **National Environment Agency (NEA)** response tracking during chemical or environmental threats.

### 2. **Interactive Mapbox Sensor Grid**
- Dynamically parses real-time anomaly bounds into actual Lat/Long coordinates.
- Fully interactive `react-leaflet` implementation plotted natively over Singapore topography.
- High-contrast Light Mode UI ensures incident markers instantly draw the operator's eye across varying terrain types.
- **Tactical Overlook Panel:** Clicking any anomaly immediately slides out a deeply detailed tactical panel detailing incident stats, timestamps, and exact grid coordinates.

### 3. **Live Operator Response Modules**
When the operator uses the Tactical Map to assign resources to an incident, two live-feed simulation modules engage:
- **Tactical Bodycam Feed Interface:** Simulates establishing a direct video downlink to the unit contact's body camera. 
- **Live Radio Transcript Scroll:** Dynamically renders real-time ground communications providing operators with arrival ETAs and SITREPs.

### 4. **AI Anomaly Detection**
- Automated "Aura AI" insights identify hidden patterns (e.g. crowd crush risks) and offer 1-click execution to preemptively deploy joint task forces before the situation spirals out of control.

### 5. **Robust Data Handling & Exporting**
- Table-based incident logs support dynamic filtering (All/Critical/Active).
- The **Export to CSV** button reliably generates hard-copy artifacts of all logs to ensure rigorous historical auditing and debriefing.

---

## 🛠️ Stack

- **React + Vite** for blazing fast module reloading.
- **Lucide-React** for consistent, scalable tactical iconography.
- **Recharts** for visualizing historical and active incident volume trends.
- **React-Leaflet** for interactive map tooling.

---

## 💻 Running the Command Center Locally

To deploy the dashboard for evaluation, run the following commands in your terminal:

```bash
# 1. Clone or navigate to the repository directory
cd dlweek-final

# 2. Install all necessary dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

*The setup will automatically launch the dashboard to a local port (usually `http://localhost:5173/`).*

---

