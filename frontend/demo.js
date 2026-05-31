const demoSteps = [
  {
    caption: "🌐 CrisisMind AI — AI-powered Emergency Operations Center. Built for CodeSprint 11 by Team TSK Labs.",
    duration: 4000,
    action: null
  },
  {
    caption: "📋 Emergency operators receive hundreds of incident reports during a disaster. Manual triage takes 15–45 minutes. CrisisMind cuts this to under 2 minutes.",
    duration: 5000,
    action: null
  },
  {
    caption: "⚡ Step 1: An operator types an incoming incident report and submits it to the system.",
    duration: 3500,
    action: () => typeIntoField("reportText", "Flood water rising near Colombo General Hospital, people are trapped")
  },
  {
    caption: "📍 The operator enters the location and GPS coordinates of the incident.",
    duration: 3000,
    action: () => {
      typeIntoField("locationText", "Colombo Fort");
      document.getElementById("latInput").value = "6.9271";
      document.getElementById("lngInput").value = "79.8612";
    }
  },
  {
    caption: "🤖 Stage 1 — Disaster Classification AI: The system reads the report text and identifies the disaster type as FLOOD.",
    duration: 4500,
    action: () => document.getElementById("submitBtn").click()
  },
  {
    caption: "🔴 Stage 2 — Urgency Scoring AI: Keywords like 'hospital' and 'trapped' trigger a CRITICAL urgency rating. The incident card appears in red.",
    duration: 5000,
    action: null
  },
  {
    caption: "🗺️ A red marker appears on the live map at Colombo Fort. A risk zone circle shows the estimated danger radius.",
    duration: 4000,
    action: null
  },
  {
    caption: "⚠️ Stage 3 — Risk Prediction AI: The system predicts secondary hazards — hospital access roads flooding, evacuation routes becoming impassable.",
    duration: 5000,
    action: () => {
      const first = document.querySelector(".incident-item");
      if (first) first.click();
    }
  },
  {
    caption: "🚒 Stage 4 — Resource Suggestion: Based on disaster type and urgency, the system recommends 3 water rescue units, 1 medical evacuation team, and more.",
    duration: 5000,
    action: null
  },
  {
    caption: "📋 Stage 5 — Emergency Checklist: The ICS flood protocol checklist is auto-generated. Operators can tick off steps as they execute them.",
    duration: 4500,
    action: () => {
      document.querySelectorAll(".checklist-item").forEach((el, i) => {
        setTimeout(() => el.click(), i * 600);
      });
    }
  },
  {
    caption: "✅ The operator reviews all AI recommendations and clicks Confirm Deployment — the human-in-the-loop approval step.",
    duration: 4000,
    action: () => {
      const btn = document.querySelector(".confirm-btn:not(:disabled)");
      if (btn) btn.click();
    }
  },
  {
    caption: "🔥 A second incident arrives — large fire near a school in Kandy. The system processes it simultaneously.",
    duration: 4000,
    action: () => {
      typeIntoField("reportText", "Large fire spreading near a school, children need evacuation");
      typeIntoField("locationText", "Kandy City Center");
      document.getElementById("latInput").value = "7.2906";
      document.getElementById("lngInput").value = "80.6337";
    }
  },
  {
    caption: "🤖 The AI classifies it as FIRE with HIGH urgency. A new orange marker appears on the map — multiple incidents tracked simultaneously.",
    duration: 5000,
    action: () => document.getElementById("submitBtn").click()
  },
  {
    caption: "📊 The stats bar at the top updates in real time — showing live counts of Critical, High, Medium, and Low incidents.",
    duration: 4000,
    action: null
  },
  {
    caption: "🌍 All incidents are visible on the live map with color-coded markers and risk zone overlays. Operators get a full situational picture instantly.",
    duration: 5000,
    action: () => map.setView([7.8731, 80.7718], 7)
  },
  {
    caption: "⚡ CrisisMind AI — From report to full incident analysis in under 2 minutes. Team TSK Labs · CodeSprint 11.",
    duration: 5000,
    action: null
  }
];

let demoRunning = false;

async function startDemo() {
  if (demoRunning) return;
  demoRunning = true;

  document.getElementById("demoBtn").style.display = "none";
  document.getElementById("demoOverlay").style.display = "flex";

  for (let i = 0; i < demoSteps.length; i++) {
    const step = demoSteps[i];
    const pct = ((i + 1) / demoSteps.length) * 100;

    document.getElementById("demoCaption").textContent = step.caption;
    document.getElementById("demoBar").style.width = pct + "%";

    if (step.action) {
      await sleep(800);
      step.action();
    }

    await sleep(step.duration);
  }

  document.getElementById("demoOverlay").style.display = "none";
  document.getElementById("demoBtn").style.display = "block";
  document.getElementById("demoBtn").textContent = "↺ Replay Demo";
  demoRunning = false;
}

function typeIntoField(id, text) {
  const el = document.getElementById(id);
  el.value = "";
  let i = 0;
  const interval = setInterval(() => {
    el.value += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 30);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
