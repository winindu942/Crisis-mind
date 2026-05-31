const API = "http://127.0.0.1:8001";

// --- MAP SETUP ---
const map = L.map("map").setView([7.8731, 80.7718], 7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const urgencyColors = {
  critical: "#ff4444",
  high:     "#ff8c00",
  medium:   "#ffd700",
  low:      "#00e676"
};

let incidents = [];
let markers   = {};
let circles   = {};
let selectedId = null;

// --- CLOCK ---
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent =
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

// --- TOAST ---
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// --- STATS BAR ---
function updateStats() {
  const active = incidents.filter(i => i.status !== "resolved");
  ["critical","high","medium","low"].forEach(level => {
    const count = active.filter(i => i.urgency === level).length;
    const labels = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
    document.getElementById(`stat-${level}`).textContent = `● ${count} ${labels[level]}`;
  });
}

// --- SUBMIT REPORT ---
async function submitReport() {
  const text     = document.getElementById("reportText").value.trim();
  const location = document.getElementById("locationText").value.trim();
  const lat      = parseFloat(document.getElementById("latInput").value);
  const lng      = parseFloat(document.getElementById("lngInput").value);

  if (!text || !location) {
    showToast("Please fill in the report text and location.");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.textContent = "Processing...";
  btn.disabled = true;

  const res = await fetch(`${API}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report_text: text, location, lat, lng })
  });

  const incident = await res.json();
  incidents.unshift(incident);
  renderIncidentList();
  addMarker(incident);
  showDetail(incident);
  updateStats();
  showToast(`⚡ New ${incident.urgency.toUpperCase()} incident detected — ${incident.disaster_type.replace("_"," ")}`);

  document.getElementById("reportText").value  = "";
  document.getElementById("locationText").value = "";
  btn.textContent = "Submit Report";
  btn.disabled = false;
}

// --- RENDER INCIDENT LIST ---
function renderIncidentList() {
  const list = document.getElementById("incidentList");
  if (incidents.length === 0) {
    list.innerHTML = '<p class="empty-msg">No incidents yet.</p>';
    return;
  }

  list.innerHTML = incidents.map(inc => `
    <div class="incident-item ${inc.urgency} ${inc.status === 'resolved' ? 'resolved' : ''}"
         onclick="showDetail(getIncident('${inc.incident_id}'))">
      <div class="inc-top">
        <span class="inc-type">${inc.disaster_type.replace(/_/g," ")}</span>
        <span class="badge ${inc.urgency}">${inc.urgency}</span>
      </div>
      <div class="inc-text">${inc.report_text}</div>
      <div style="font-size:0.7rem;color:#4a5568;margin-top:4px">
        ${inc.location} · ${formatTime(inc.timestamp)}
        ${inc.status === 'resolved' ? ' · <span style="color:#00e676">Resolved</span>' : ''}
      </div>
    </div>
  `).join("");
}

// --- SHOW DETAIL ---
function showDetail(inc) {
  if (!inc) return;
  selectedId = inc.incident_id;

  const panel = document.getElementById("detailPanel");
  const isResolved = inc.status === "resolved";

  panel.innerHTML = `
    <h2>Incident Detail</h2>

    <div class="detail-section">
      <h3>Report</h3>
      <p>${inc.report_text}</p>
      <p style="margin-top:6px;font-size:0.75rem;color:#4a6080">
        ${inc.location} · ${formatTime(inc.timestamp)} · ${inc.incident_id}
      </p>
    </div>

    <div class="detail-section">
      <h3>AI Classification</h3>
      <p>Type: <strong style="color:#4a9eff">${inc.disaster_type.replace(/_/g," ").toUpperCase()}</strong></p>
      <p style="margin-top:6px">Urgency: <span class="badge ${inc.urgency}" style="display:inline-block">${inc.urgency}</span></p>
    </div>

    <div class="detail-section">
      <h3>⚠ Predicted Risks</h3>
      ${inc.risk_predictions.map(r => `<div class="risk-item">${r}</div>`).join("")}
    </div>

    <div class="detail-section">
      <h3>🚒 Recommended Resources</h3>
      ${inc.resources.map(r => `<div class="resource-item">${r}</div>`).join("")}
    </div>

    <div class="detail-section">
      <h3>📋 Emergency Checklist</h3>
      ${inc.checklist.map((c, i) => `
        <div class="checklist-item" onclick="toggleCheck(this)" data-index="${i}">
          <span class="check-box">☐</span>
          <span>${c}</span>
        </div>
      `).join("")}
    </div>

    <button class="confirm-btn" onclick="confirmDeployment('${inc.incident_id}')" ${isResolved ? "disabled" : ""}>
      ${isResolved ? "✔ Deployment Confirmed" : "Confirm Deployment"}
    </button>
  `;

  if (markers[inc.incident_id]) {
    map.setView([inc.lat, inc.lng], 13);
    markers[inc.incident_id].openPopup();
  }
}

// --- TOGGLE CHECKLIST ITEM ---
function toggleCheck(el) {
  const box = el.querySelector(".check-box");
  if (el.classList.contains("checked")) {
    el.classList.remove("checked");
    box.textContent = "☐";
  } else {
    el.classList.add("checked");
    box.textContent = "☑";
  }
}

// --- CONFIRM DEPLOYMENT ---
async function confirmDeployment(id) {
  await fetch(`${API}/incidents/${id}/resolve`, { method: "POST" });
  const inc = getIncident(id);
  if (inc) inc.status = "resolved";

  // fade the map marker
  if (markers[id]) {
    markers[id].setOpacity(0.3);
  }
  if (circles[id]) {
    circles[id].setStyle({ opacity: 0.1, fillOpacity: 0.03 });
  }

  renderIncidentList();
  showDetail(getIncident(id));
  updateStats();
  showToast("✔ Deployment confirmed — incident resolved");
}

// --- ADD MAP MARKER + RISK CIRCLE ---
function addMarker(inc) {
  const color = urgencyColors[inc.urgency] || "#fff";
  const isCritical = inc.urgency === "critical";

  const html = isCritical
    ? `<div class="pulse-marker">
         <div class="pulse-ring" style="background:${color}55"></div>
         <div class="pulse-dot"  style="background:${color}"></div>
       </div>`
    : `<div style="
         width:14px;height:14px;
         background:${color};
         border-radius:50%;
         border:2px solid #fff;
         box-shadow:0 0 6px ${color}
       "></div>`;

  const icon = L.divIcon({
    className: "",
    html,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const marker = L.marker([inc.lat, inc.lng], { icon })
    .addTo(map)
    .bindPopup(`
      <b style="color:${color}">${inc.disaster_type.replace(/_/g," ").toUpperCase()}</b><br>
      ${inc.location}<br>
      <span style="font-size:0.8em;color:#666">${inc.incident_id}</span>
    `);

  marker.on("click", () => showDetail(inc));
  markers[inc.incident_id] = marker;

  // risk zone circle
  const radii = { critical: 3000, high: 2000, medium: 1200, low: 700 };
  const circle = L.circle([inc.lat, inc.lng], {
    radius: radii[inc.urgency] || 1000,
    color,
    fillColor: color,
    fillOpacity: 0.07,
    opacity: 0.35,
    weight: 1.5
  }).addTo(map);

  circles[inc.incident_id] = circle;
}

// --- HELPERS ---
function getIncident(id) {
  return incidents.find(i => i.incident_id === id);
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// --- POLL FOR UPDATES ---
async function pollIncidents() {
  const res  = await fetch(`${API}/incidents`);
  const data = await res.json();
  if (data.length !== incidents.length) {
    incidents = data.slice().reverse();
    renderIncidentList();
    updateStats();
  }
}

setInterval(pollIncidents, 10000);

// --- PRELOAD DEMO SCENARIOS ---
const demoScenarios = [
  {
    report_text: "Flood water rising near Colombo General Hospital, people are trapped",
    location: "Colombo Fort",
    lat: 6.9271,
    lng: 79.8612
  },
  {
    report_text: "Large fire spreading near a school, children need evacuation",
    location: "Kandy City Center",
    lat: 7.2906,
    lng: 80.6337
  },
  {
    report_text: "Strong tremors felt, buildings cracking and road collapsed",
    location: "Galle Fort",
    lat: 6.0535,
    lng: 80.2210
  },
  {
    report_text: "Chemical gas leak at industrial plant, toxic fumes spreading",
    location: "Kelaniya Industrial Zone",
    lat: 7.0,
    lng: 79.92
  }
];

async function preloadDemos() {
  for (const scenario of demoScenarios) {
    const res = await fetch(`${API}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scenario)
    });
    const incident = await res.json();
    incidents.push(incident);
    addMarker(incident);
  }
  incidents.reverse();
  renderIncidentList();
  updateStats();
}

preloadDemos();
