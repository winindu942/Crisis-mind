const API = "http://127.0.0.1:8001";

// --- MAP SETUP ---
const map = L.map("map").setView([7.8731, 80.7718], 7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const urgencyColors = {
  critical: "#ff4444",
  high: "#ff8c00",
  medium: "#ffd700",
  low: "#00e676"
};

let incidents = [];
let markers = {};
let selectedId = null;

// --- SUBMIT REPORT ---
async function submitReport() {
  const text = document.getElementById("reportText").value.trim();
  const location = document.getElementById("locationText").value.trim();
  const lat = parseFloat(document.getElementById("latInput").value);
  const lng = parseFloat(document.getElementById("lngInput").value);

  if (!text || !location) {
    alert("Please fill in the report text and location.");
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

  document.getElementById("reportText").value = "";
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
        <span class="inc-type">${inc.disaster_type.replace("_", " ")}</span>
        <span class="badge ${inc.urgency}">${inc.urgency}</span>
      </div>
      <div class="inc-text">${inc.report_text}</div>
      <div style="font-size:0.72rem;color:#4a5568;margin-top:4px">${inc.location} · ${formatTime(inc.timestamp)}</div>
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
      <p style="margin-top:6px;font-size:0.78rem;color:#6b7a99">${inc.location} · ${formatTime(inc.timestamp)}</p>
    </div>

    <div class="detail-section">
      <h3>Classification</h3>
      <p>Type: <strong style="color:#4a9eff">${inc.disaster_type.replace("_", " ").toUpperCase()}</strong></p>
      <p>Urgency: <span class="badge ${inc.urgency}" style="display:inline-block;margin-top:4px">${inc.urgency}</span></p>
      <p>ID: <span style="color:#6b7a99;font-size:0.78rem">${inc.incident_id}</span></p>
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
      ${inc.checklist.map(c => `<div class="checklist-item">${c}</div>`).join("")}
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

// --- CONFIRM DEPLOYMENT ---
async function confirmDeployment(id) {
  await fetch(`${API}/incidents/${id}/resolve`, { method: "POST" });
  const inc = getIncident(id);
  if (inc) inc.status = "resolved";
  renderIncidentList();
  showDetail(getIncident(id));
}

// --- ADD MAP MARKER ---
function addMarker(inc) {
  const color = urgencyColors[inc.urgency] || "#fff";
  const icon = L.divIcon({
    className: "",
    html: `<div style="
      width:16px;height:16px;
      background:${color};
      border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 0 8px ${color}
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const marker = L.marker([inc.lat, inc.lng], { icon })
    .addTo(map)
    .bindPopup(`<b>${inc.disaster_type.replace("_"," ")}</b><br>${inc.location}<br><span style="color:${color}">${inc.urgency.toUpperCase()}</span>`);

  marker.on("click", () => showDetail(inc));
  markers[inc.incident_id] = marker;
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
  const res = await fetch(`${API}/incidents`);
  const data = await res.json();
  if (data.length !== incidents.length) {
    incidents = data.reverse();
    renderIncidentList();
  }
}

setInterval(pollIncidents, 10000);
