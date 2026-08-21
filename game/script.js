// ============================================================
// Project Nerial — Tasks 001–005
// ============================================================

// ------------------------------
// Central game state
// ------------------------------

const gameState = {
  currentScreen: "main-menu",
  playerCharacter: null,
  squad: [],
  inventory: [],
  reputation: {},
  worldHistory: [],
  currentMission: null,
  factionRelationships: {},
  creation: { tribe: null, background: null }
};

const attributes = ["Might", "Endurance", "Agility", "Precision", "Will", "Wisdom"];

const equipment = [
  "Nerial combat blade",
  "Basic Nerial firearm",
  "Reinforced Nerial armor",
  "Utility pack"
];

const tribes = {
  ironfang: {
    name: "Ironfang Tribe",
    tendency: "Might +1 / Endurance +1",
    description: "Traditional warriors known for direct assaults, physical strength, and unbroken discipline.",
    modifiers: { Might: 1, Endurance: 1 }
  },
  ashwalker: {
    name: "Ashwalker Tribe",
    tendency: "Agility +1 / Wisdom +1",
    description: "Survivalists accustomed to harsh environments, tracking, scouting, and adaptation.",
    modifiers: { Agility: 1, Wisdom: 1 }
  },
  forgeSeeker: {
    name: "Forge-Seeker Tribe",
    tendency: "Precision +1 / Wisdom +1",
    description: "Salvage-minded experimenters who study lost machines and foreign technologies.",
    modifiers: { Precision: 1, Wisdom: 1 }
  }
};

const backgrounds = {
  bloodWarrior: {
    name: "Blood Warrior",
    description: "A warrior trained primarily for close combat.",
    bonuses: { Might: 2, Endurance: 1 }
  },
  hunter: {
    name: "Hunter",
    description: "A wilderness tracker and ranged combat specialist.",
    bonuses: { Agility: 2, Precision: 1 }
  },
  forgeSeeker: {
    name: "Forge-Seeker",
    description: "A technological explorer and researcher.",
    bonuses: { Wisdom: 2, Precision: 1 }
  },
  oathkeeper: {
    name: "Oathkeeper",
    description: "A disciplined warrior devoted strongly to the Nerial Code.",
    bonuses: { Will: 2, Endurance: 1 }
  },
  wanderer: {
    name: "Wanderer",
    description: "A Nerial who has spent much of their life outside traditional tribal society.",
    bonuses: { Wisdom: 1, Agility: 1, Will: 1 }
  }
};

const companionTemplates = [
  {
    id: "rakkar",
    name: "Rakkar",
    role: "Blood Warrior",
    personality: "Aggressive, fearless, direct, and intensely loyal to the tribe.",
    description: "Rakkar believes hesitation is the first step toward defeat. He would rather charge an enemy line than spend an hour planning around it. Beneath his brutality is an unwavering loyalty to those who have earned his respect.",
    strengths: ["Melee combat", "Endurance", "Intimidation"],
    weaknesses: ["Impulsive", "Distrustful of outsiders", "Poor patience"],
    attributes: { Might: 13, Endurance: 13, Agility: 9, Precision: 8, Will: 12, Wisdom: 8 },
    relationship: 10,
    equipment: ["Heavy Nerial combat blade", "Basic Nerial firearm", "Reinforced assault armor"]
  },
  {
    id: "sera",
    name: "Sera",
    role: "Hunter",
    personality: "Quiet, observant, practical, and highly independent.",
    description: "Sera learned to survive by watching rather than speaking. She can read tracks across terrain that others consider impossible to cross. She rarely wastes words, but when she finally speaks, the tribe listens.",
    strengths: ["Agility", "Precision", "Survival", "Tracking"],
    weaknesses: ["Reserved", "Distrusts authority", "Prefers independence"],
    attributes: { Might: 9, Endurance: 10, Agility: 14, Precision: 13, Will: 11, Wisdom: 12 },
    relationship: 5,
    equipment: ["Nerial hunting rifle", "Field knife", "Ashcloak survival gear"]
  },
  {
    id: "varn",
    name: "Varn",
    role: "Forge-Seeker",
    personality: "Curious, eccentric, intelligent, and fascinated by technology.",
    description: "Varn has never met a piece of technology he did not want to dismantle. He believes every enemy weapon is a lesson waiting to be understood. Some Nerial warriors call him reckless. Varn considers that a compliment.",
    strengths: ["Wisdom", "Precision", "Technology", "Research"],
    weaknesses: ["Physically weaker", "Easily distracted by technology", "Sometimes takes unnecessary risks"],
    attributes: { Might: 7, Endurance: 8, Agility: 10, Precision: 12, Will: 10, Wisdom: 15 },
    relationship: 5,
    equipment: ["Salvaged Nerial firearm", "Technical tools", "Reinforced field armor"]
  }
];

// ------------------------------
// Screens and utilities
// ------------------------------

const screens = {
  mainMenu: document.getElementById("main-menu"),
  intro: document.getElementById("intro-screen"),
  creation: document.getElementById("creation-screen"),
  forged: document.getElementById("forged-screen"),
  squad: document.getElementById("squad-screen"),
  companion: document.getElementById("companion-screen"),
  tactical: document.getElementById("tactical-screen")
};

const notification = document.getElementById("notification");
let notificationTimer;
let combatState = null;
let combatStyleAdded = false;

function showScreen(name) {
  Object.values(screens).forEach((screen) => {
    screen.hidden = true;
    screen.classList.remove("active-screen");
  });

  if (screens[name]) {
    screens[name].hidden = false;
    screens[name].classList.add("active-screen");
    gameState.currentScreen = name;
  }
}

function showComingSoon() {
  notification.textContent = "COMING SOON // THIS MODULE IS NOT YET AVAILABLE";
  notification.classList.add("visible");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => notification.classList.remove("visible"), 2800);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function getDerivedStats(values) {
  return {
    Health: 100 + values.Endurance * 5,
    Movement: 5 + Math.floor(values.Agility / 5),
    "Melee Power": Math.floor(values.Might / 2),
    "Ranged Accuracy": Math.floor(values.Precision / 2),
    Morale: 50 + values.Will * 3
  };
}

function formatRelationship(value) {
  return value > 0 ? `+${value}` : value;
}

// ------------------------------
// Character creation
// ------------------------------

function getSelectedAttributes() {
  const result = Object.fromEntries(attributes.map((attribute) => [attribute, 10]));
  const tribe = tribes[gameState.creation.tribe];
  const background = backgrounds[gameState.creation.background];

  [tribe?.modifiers, background?.bonuses].forEach((modifiers) => {
    if (!modifiers) return;

    Object.entries(modifiers).forEach(([key, value]) => {
      result[key] += value;
    });
  });

  return result;
}

function renderChoices() {
  document.getElementById("tribe-options").innerHTML = Object.entries(tribes).map(([id, tribe]) => `
    <button class="choice-card" data-tribe="${id}">
      <strong>${escapeHTML(tribe.name)}</strong>
      <small>${escapeHTML(tribe.tendency)}</small>
    </button>
  `).join("");

  document.getElementById("background-options").innerHTML = Object.entries(backgrounds).map(([id, background]) => `
    <button class="choice-card" data-background="${id}">
      <strong>${escapeHTML(background.name)}</strong>
      <small>${Object.entries(background.bonuses)
        .map(([key, value]) => `${key} +${value}`).join(" / ")}</small>
    </button>
  `).join("");

  document.querySelectorAll("[data-tribe]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.creation.tribe = button.dataset.tribe;
      document.querySelectorAll("[data-tribe]").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      document.getElementById("tribe-description").textContent =
        tribes[button.dataset.tribe].description;
      updateSummary();
    });
  });

  document.querySelectorAll("[data-background]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.creation.background = button.dataset.background;
      document.querySelectorAll("[data-background]").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      document.getElementById("background-description").textContent =
        backgrounds[button.dataset.background].description;
      updateSummary();
    });
  });
}

function updateSummary() {
  const name = document.getElementById("character-name").value.trim();
  const values = getSelectedAttributes();
  const derived = getDerivedStats(values);
  const tribe = tribes[gameState.creation.tribe];
  const background = backgrounds[gameState.creation.background];

  document.getElementById("summary-content").innerHTML = `
    <div class="summary-block">
      <h4>IDENTITY</h4>
      <p class="summary-value">${escapeHTML(name || "UNNAMED WARRIOR")}</p>
      <p class="summary-value">${tribe?.name || "TRIBE UNSELECTED"}</p>
      <p class="summary-value">${background?.name || "BACKGROUND UNSELECTED"}</p>
    </div>
    <div class="summary-block">
      <h4>CORE ATTRIBUTES</h4>
      ${attributes.map((key) => `
        <div class="stat-row"><span>${key}</span><span>${values[key]}</span></div>
      `).join("")}
    </div>
    <div class="summary-block">
      <h4>DERIVED STATISTICS</h4>
      ${Object.entries(derived).map(([key, value]) => `
        <div class="stat-row"><span>${key}</span><span>${value}</span></div>
      `).join("")}
    </div>
    <div class="summary-block">
      <h4>STARTING EQUIPMENT</h4>
      <ul class="equipment-list">${equipment.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;

  document.getElementById("forge-button").disabled =
    !(name && tribe && background);
}

function createCharacter() {
  const name = document.getElementById("character-name").value.trim();

  if (!name || !gameState.creation.tribe || !gameState.creation.background) return;

  const selectedAttributes = getSelectedAttributes();
  const character = {
    id: `nerial-${Date.now()}`,
    name,
    tribe: tribes[gameState.creation.tribe].name,
    background: backgrounds[gameState.creation.background].name,
    attributes: selectedAttributes,
    derivedStats: getDerivedStats(selectedAttributes),
    equipment: [...equipment],
    level: 1,
    experience: 0,
    honor: 0,
    morale: 50,
    injuries: []
  };

  gameState.playerCharacter = character;
  localStorage.setItem("nerial_character", JSON.stringify(character));

  document.getElementById("forged-details").innerHTML =
    `<strong>${escapeHTML(character.name)}</strong><br />${escapeHTML(character.tribe)}`;

  initializeSquad();
  showScreen("forged");
}

// ------------------------------
// Squad system
// ------------------------------

function createCompanion(template) {
  const derivedStats = getDerivedStats(template.attributes);

  return {
    ...template,
    attributes: { ...template.attributes },
    strengths: [...template.strengths],
    weaknesses: [...template.weaknesses],
    equipment: [...template.equipment],
    derivedStats,
    level: 1,
    experience: 0,
    honor: 0,
    morale: derivedStats.Morale,
    injuries: [],
    status: "ACTIVE"
  };
}

function initializeSquad() {
  const saved = localStorage.getItem("nerial_squad");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 3) {
        gameState.squad = parsed;
        return;
      }
    } catch {
      localStorage.removeItem("nerial_squad");
    }
  }

  gameState.squad = companionTemplates.map(createCompanion);
  localStorage.setItem("nerial_squad", JSON.stringify(gameState.squad));
}

function renderSquad() {
  const character = gameState.playerCharacter;

  document.getElementById("commander-summary").innerHTML = character
    ? `COMMANDER // ${escapeHTML(character.name)} // ${escapeHTML(character.tribe)}`
    : "COMMANDER // PERSONNEL RECORD UNAVAILABLE";

  const mission = gameState.currentMission;
  const missionStatus = mission?.status === "COMPLETED"
    ? `
      <div class="summary-block mission-status-panel">
        <h4>CURRENT MISSION</h4>
        <p class="summary-value">THE SILENT SETTLEMENT</p>
        <p class="summary-value">STATUS: COMPLETED</p>
        <p class="summary-value">NEXT OBJECTIVE: Investigate the structure beneath Kharos.</p>
      </div>
    `
    : "";

  document.getElementById("squad-roster").innerHTML = `
    ${missionStatus}
    ${gameState.squad.map((companion) => `
      <article class="companion-card" tabindex="0" role="button" data-companion="${companion.id}">
        <h3>${escapeHTML(companion.name.toUpperCase())}</h3>
        <p class="companion-role">${escapeHTML(companion.role.toUpperCase())}</p>
        <p class="companion-description">${escapeHTML(companion.description)}</p>
        <div class="card-meta">
          <span>RELATIONSHIP <strong>${formatRelationship(companion.relationship)}</strong></span>
          <span>STATUS <strong>${escapeHTML(companion.status)}</strong></span>
        </div>
        <div class="card-meta">
          <span>LEVEL <strong>${companion.level}</strong></span>
          <span>VIEW FILE →</span>
        </div>
      </article>
    `).join("")}
  `;

  document.querySelectorAll("[data-companion]").forEach((card) => {
    const select = () => showCompanion(card.dataset.companion);
    card.addEventListener("click", select);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
  });
}

function showCompanion(id) {
  const companion = gameState.squad.find((member) => member.id === id);
  if (!companion) return;

  document.getElementById("companion-detail").innerHTML = `
    <div class="detail-heading">
      <div>
        <h2 id="companion-title">${escapeHTML(companion.name.toUpperCase())}</h2>
        <p class="detail-role">${escapeHTML(companion.role.toUpperCase())}</p>
      </div>
      <p class="detail-status">${escapeHTML(companion.status)}</p>
    </div>
    <div class="detail-columns">
      <div>
        <section class="detail-section"><h4>PERSONALITY</h4><p>${escapeHTML(companion.personality)}</p></section>
        <section class="detail-section"><h4>DESCRIPTION</h4><p>${escapeHTML(companion.description)}</p></section>
        <section class="detail-section"><h4>STRENGTHS</h4><ul>${companion.strengths.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
        <section class="detail-section"><h4>WEAKNESSES</h4><ul>${companion.weaknesses.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
      </div>
      <div>
        <section class="detail-section"><h4>CORE ATTRIBUTES</h4>
          <div class="detail-stats">${attributes.map((key) => `
            <div class="stat-row"><span>${key}</span><span>${companion.attributes[key]}</span></div>
          `).join("")}</div>
        </section>
        <section class="detail-section"><h4>DERIVED STATISTICS</h4>
          ${Object.entries(companion.derivedStats).map(([key, value]) => `
            <div class="stat-row"><span>${key}</span><span>${value}</span></div>
          `).join("")}
        </section>
        <section class="detail-section"><h4>RELATIONSHIP</h4>
          <p>${formatRelationship(companion.relationship)} with commander</p>
          <p>LEVEL ${companion.level}</p>
        </section>
        <section class="detail-section"><h4>EQUIPMENT</h4>
          <ul>${companion.equipment.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
        </section>
      </div>
    </div>
  `;

  showScreen("companion");
}

// ------------------------------
// Mission 001
// ------------------------------

const missionTemplate = {
  missionId: "mission_001",
  missionName: "The Silent Settlement",
  title: "THE SILENT SETTLEMENT",
  subtitle: "MISSION 001",
  location: "KHAROS FRONTIER SETTLEMENT"
};

const missionChoices = {
  direct: {
    label: "APPROACH DIRECTLY",
    description: "Move immediately toward the settlement.",
    result: `
      <p>You move without hesitation.</p>
      <p>The settlement comes into view.</p>
      <p>Nothing moves.</p>
      <p>No guards.<br />No workers.<br />No vehicles.</p>
      <p>The gates are open.</p>
      <p>Whatever happened here did not leave normally.</p>
    `
  },
  scout: {
    label: "SCOUT WITH SERA",
    description: "Send Sera ahead to observe the settlement from a distance.",
    result: `
      <p>Sera disappears into the terrain.</p>
      <p>Minutes later she returns.</p>
      <p><strong>"There are no survivors on the surface."</strong></p>
      <p>She pauses.</p>
      <p><strong>"But there are tracks."</strong></p>
      <p>She points toward the settlement.</p>
      <p><strong>"They lead inward."</strong></p>
    `
  },
  terrain: {
    label: "SEARCH THE TERRAIN",
    description: "Search the surrounding terrain for tracks, signs, or evidence.",
    result: `
      <p>Your warband spreads across the surrounding ground.</p>
      <p>The evidence is subtle.</p>
      <p>Scratches in the soil.<br />Broken vegetation.</p>
      <p>And something stranger.</p>
      <p>The tracks do not lead away from Kharos.</p>
      <p>They lead toward it.</p>
    `
  },
  transmission: {
    label: "ANALYZE TRANSMISSION",
    description: "Allow Varn to examine the final transmission.",
    result: `
      <p>Varn studies the transmission.</p>
      <p>He plays it again.</p>
      <p>Then again.</p>
      <p>His expression changes.</p>
      <p><strong>"Commander."</strong></p>
      <p>He points toward the waveform.</p>
      <p><strong>"There is another signal beneath the transmission."</strong></p>
      <p>A repeating pulse.</p>
      <p>Something was transmitting from beneath Kharos.</p>
    `
  }
};

function saveMission() {
  localStorage.setItem("nerial_mission_001", JSON.stringify(gameState.currentMission));
  localStorage.setItem("nerial_world_history", JSON.stringify(gameState.worldHistory));
}

function ensureMission() {
  if (!gameState.currentMission) {
    gameState.currentMission = {
      ...missionTemplate,
      status: "STARTED",
      investigationChoice: null,
      scouted: false,
      terrainInvestigated: false,
      transmissionAnalyzed: false,
      combatVictory: false
    };
  }

  saveMission();
}

function renderMissionIntro() {
  ensureMission();

  screens.tactical.innerHTML = `
    <div class="mission-shell">
      <p class="eyebrow">NERIAL COMMAND ARCHIVE // MISSION BRIEFING</p>
      <p class="mission-code">MISSION 001</p>
      <h2>THE SILENT SETTLEMENT</h2>
      <p class="mission-subtitle">LOCATION: KHAROS FRONTIER SETTLEMENT</p>
      <p class="mission-subtitle">STATUS: COMMUNICATION LOST</p>
      <div class="mission-copy">
        <p>Three hours ago, Settlement Kharos stopped transmitting.</p>
        <p>No emergency beacon.<br />No evacuation request.<br />No response to repeated attempts at contact.</p>
        <p>The last transmission contained only six words.</p>
        <blockquote>THEY CAME FROM BENEATH US.</blockquote>
        <p>Your warband has been ordered to investigate.</p>
        <p>You are not being sent to conquer Kharos.</p>
        <p>You are being sent to discover what happened.</p>
      </div>
      <div class="mission-reactions">
        <p><strong>RAKKAR:</strong> "Then we stop wasting time and find whatever killed them."</p>
        <p><strong>SERA:</strong> "Something is wrong. There are no tracks leading away from the settlement."</p>
        <p><strong>VARN:</strong> "That transmission was not damaged. It was interrupted."</p>
      </div>
      <button class="action-button" data-mission-action="choices">
        <span>BEGIN INVESTIGATION</span><span class="arrow">→</span>
      </button>
    </div>
  `;

  showScreen("tactical");
}

function renderMissionChoices() {
  screens.tactical.innerHTML = `
    <div class="mission-shell">
      <p class="eyebrow">MISSION 001 // INVESTIGATION PROTOCOL</p>
      <h2>HOW WILL YOU APPROACH KHAROS?</h2>
      <div class="mission-choice-grid">
        ${Object.entries(missionChoices).map(([id, choice]) => `
          <button class="mission-choice" data-choice="${id}">
            <strong>${escapeHTML(choice.label)}</strong>
            <span>${escapeHTML(choice.description)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  screens.tactical.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => chooseInvestigation(button.dataset.choice));
  });

  showScreen("tactical");
}

function chooseInvestigation(choice) {
  const mission = gameState.currentMission;

  mission.investigationChoice = choice;
  mission.scouted = choice === "scout";
  mission.terrainInvestigated = choice === "terrain";
  mission.transmissionAnalyzed = choice === "transmission";
  mission.status = "INVESTIGATING";
  saveMission();

  renderMissionResult(choice);
}

function renderMissionResult(choice) {
  const result = missionChoices[choice];

  screens.tactical.innerHTML = `
    <div class="mission-shell">
      <p class="eyebrow">MISSION 001 // FIELD REPORT</p>
      <h2>${escapeHTML(result.label)}</h2>
      <div class="mission-copy">${result.result}</div>
      <button class="action-button" data-mission-action="enter-kharos">
        <span>ENTER KHAROS</span><span class="arrow">→</span>
      </button>
    </div>
  `;

  screens.tactical.querySelector("[data-mission-action]").addEventListener(
    "click",
    renderKharos
  );

  showScreen("tactical");
}

function renderKharos() {
  screens.tactical.innerHTML = `
    <div class="mission-shell">
      <p class="eyebrow">MISSION 001 // KHAROS FRONTIER SETTLEMENT</p>
      <h2>KHAROS</h2>
      <div class="mission-copy">
        <p>The settlement is silent.</p>
        <p>Abandoned structures.<br />Damaged equipment.<br />Empty streets.<br />Open gates.</p>
        <p>The silence is broken by movement.</p>
        <h3 class="hostile-warning">HOSTILES DETECTED</h3>
        <p class="enemy-label">IRON REAVERS</p>
      </div>
      <button class="action-button" data-mission-action="engage">
        <span>ENGAGE</span><span class="arrow">→</span>
      </button>
    </div>
  `;

  if (gameState.currentMission.transmissionAnalyzed) {
    const note = document.createElement("p");
    note.className = "mission-copy";
    note.textContent = "Varn's instruments detect movement beneath the settlement.";
    screens.tactical.querySelector(".mission-shell").appendChild(note);
  }

  screens.tactical.querySelector("[data-mission-action]").addEventListener(
    "click",
    beginCombat
  );

  showScreen("tactical");
}

function renderMissionCompletion() {
  const mission = gameState.currentMission;
  mission.status = "COMPLETED";
  mission.combatVictory = true;

  const historyEntry =
    "MISSION 001 — THE SILENT SETTLEMENT\n" +
    "The Nerial warband investigated the disappearance of Settlement Kharos.\n" +
    `The commander ${mission.investigationChoice === "scout"
      ? "ordered Sera to scout the settlement."
      : mission.investigationChoice === "terrain"
        ? "ordered the warband to search the terrain."
        : mission.investigationChoice === "transmission"
          ? "ordered Varn to analyze the transmission."
          : "approached the settlement directly."}`;

  if (!gameState.worldHistory.some((entry) => entry.startsWith("MISSION 001"))) {
    gameState.worldHistory.push(historyEntry);
  }

  saveMission();

  screens.tactical.innerHTML = `
    <div class="mission-shell">
      <p class="eyebrow">MISSION 001 // AFTER-ACTION REPORT</p>
      <h2>KHAROS SECURED</h2>
      <div class="mission-copy">
        <p>The Iron Reavers are dead.</p>
        <p>But something about the settlement is wrong.</p>
      </div>
      <div class="mission-reactions">
        <p><strong>RAKKAR:</strong> "They were waiting for us."</p>
        <p><strong>SERA:</strong> "No. They were running from something."</p>
        <p><strong>VARN:</strong> "Commander..."</p>
        <p>Varn looks toward the ground.</p>
        <p><strong>"Whatever they were running from is still here."</strong></p>
      </div>
      <div class="mission-copy">
        <p>Your warband discovers a damaged access shaft beneath the settlement.</p>
        <p>The shaft appears to descend far deeper than the settlement's original construction plans should allow.</p>
        <blockquote>Something has been built beneath Kharos.</blockquote>
      </div>
      <button class="action-button" data-mission-action="return-command">
        <span>RETURN TO COMMAND</span><span class="arrow">→</span>
      </button>
    </div>
  `;

  screens.tactical.querySelector("[data-mission-action]").addEventListener(
    "click",
    () => {
      renderSquad();
      showScreen("squad");
    }
  );

  showScreen("tactical");
}

// ------------------------------
// Tactical combat prototype
// ------------------------------

const combatConfig = {
  columns: 8,
  rows: 6,
  maxAP: 2,
  covers: new Set(["2,1", "4,1", "6,1", "1,4", "3,4", "6,4"])
};

function addCombatStyles() {
  if (combatStyleAdded) return;

  const style = document.createElement("style");
  style.textContent = `
    .mission-shell{width:min(100%,58rem);margin:auto;padding:2.5rem;border:1px solid var(--line);background:linear-gradient(135deg,rgba(27,34,39,.95),var(--panel));box-shadow:0 2rem 5rem rgba(0,0,0,.35)}
    .mission-shell h2{margin:.4rem 0 1rem;color:var(--ash);font-size:clamp(2rem,5vw,4rem);letter-spacing:.04em}
    .mission-code,.mission-subtitle{color:var(--blood-bright);font-size:.78rem;font-weight:bold;letter-spacing:.15em}
    .mission-copy{color:#b7b8ae;font-family:Georgia,serif;font-size:1rem;line-height:1.7;letter-spacing:.025em}
    .mission-copy blockquote{margin:1.5rem 0;padding:1rem;border-left:3px solid var(--blood-bright);color:var(--blood-bright);font-family:var(--font-ui);font-weight:bold;letter-spacing:.14em}
    .mission-reactions{margin-top:1.5rem;padding:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.8rem;line-height:1.6;letter-spacing:.04em}
    .mission-reactions strong{color:var(--ash)}
    .mission-choice-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-top:2rem}
    .mission-choice{min-height:8rem;padding:1.2rem;border:1px solid var(--line);background:rgba(0,0,0,.25);color:var(--iron);text-align:left}
    .mission-choice:hover{border-color:var(--blood-bright);background:rgba(169,71,62,.25);color:white}
    .mission-choice strong,.mission-choice span{display:block}
    .mission-choice strong{margin-bottom:.7rem;color:var(--blood-bright);letter-spacing:.1em}
    .mission-choice span{color:var(--muted);font-size:.78rem;line-height:1.5;letter-spacing:.03em}
    .hostile-warning{margin:2rem 0 .5rem;color:var(--blood-bright);letter-spacing:.18em}
    .enemy-label{color:var(--ash);font-weight:bold;letter-spacing:.15em}
    .combat-shell{width:min(100%,90rem);margin:auto}
    .combat-header{display:flex;justify-content:space-between;gap:1rem;align-items:end;margin-bottom:1.2rem}
    .combat-header h2{margin:0;font-size:clamp(1.7rem,4vw,3rem)}
    .combat-turn{text-align:right;color:var(--blood-bright);font-weight:bold;line-height:1.7}
    .combat-layout{display:grid;grid-template-columns:minmax(30rem,1fr) 18rem;gap:1rem;align-items:start}
    .combat-board-panel,.combat-side-panel,.combat-log-panel{border:1px solid var(--line);background:linear-gradient(135deg,rgba(27,34,39,.94),var(--panel));padding:1rem}
    .combat-board{display:grid;grid-template-columns:repeat(8,minmax(2.2rem,1fr));gap:.3rem;max-width:62rem}
    .combat-cell{position:relative;aspect-ratio:1;border:1px solid rgba(185,190,177,.25);background:rgba(5,8,10,.7);color:var(--ash);font-size:.7rem}
    .combat-cell.cover{background:linear-gradient(135deg,#454640,#22272a);box-shadow:inset 0 0 0 3px rgba(169,71,62,.4)}
    .combat-cell.move-target{border-color:var(--blood-bright);background:rgba(169,71,62,.35)}
    .combat-cell.selected-cell{outline:2px solid white;outline-offset:-2px}
    .unit-marker{position:absolute;inset:13%;display:flex;flex-direction:column;justify-content:center;align-items:center;border:1px solid var(--ash);background:#394247;color:white;font-size:.62rem;font-weight:bold;line-height:1.2}
    .unit-marker.enemy{border-color:#df624e;background:#542824}
    .unit-hp{width:80%;height:3px;margin-top:3px;background:#16191a}.unit-hp i{display:block;height:100%;background:#9bb35b}
    .combat-side-panel h3,.combat-log-panel h3{margin:0 0 .8rem;color:var(--blood-bright);font-size:.8rem;letter-spacing:.16em}
    .combat-stat{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:.42rem 0;font-size:.75rem}.combat-stat strong{color:var(--ash)}
    .momentum{color:var(--blood-bright)}
    .combat-log-panel{margin-top:1rem;max-height:14rem;overflow:auto}.combat-log{margin:0;padding-left:1.2rem;color:var(--muted);font-size:.72rem;line-height:1.7;letter-spacing:.03em}
    .combat-controls{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:1rem}.combat-control{border:1px solid var(--line);padding:.7rem .8rem;color:var(--iron);background:#151a1d;font-size:.7rem;letter-spacing:.08em}.combat-control:hover:not(:disabled),.combat-control.active{border-color:var(--blood-bright);color:white;background:rgba(169,71,62,.45)}.combat-control:disabled{opacity:.35;cursor:not-allowed}
    .combat-result{margin-top:1rem;padding:1.5rem;border:1px solid var(--blood);text-align:center}
    @media(max-width:800px){.mission-choice-grid{grid-template-columns:1fr}.combat-layout{grid-template-columns:1fr}.combat-board-panel{overflow:auto}.combat-board{min-width:34rem}.combat-header{align-items:start;flex-direction:column}.combat-turn{text-align:left}}
  `;
  document.head.appendChild(style);
  combatStyleAdded = true;
}

function createCombatUnit(source, side, position) {
  const stats = source.derivedStats || getDerivedStats(source.attributes);

  return {
    id: `${side}-${source.id}`,
    sourceId: source.id,
    name: source.name,
    role: source.role || "Commander",
    side,
    x: position.x,
    y: position.y,
    maxHealth: stats.Health,
    health: stats.Health,
    actionPoints: 2,
    movement: stats.Movement,
    meleePower: stats["Melee Power"],
    rangedAccuracy: stats["Ranged Accuracy"],
    morale: stats.Morale,
    momentum: 0,
    status: "ACTIVE"
  };
}

function createEnemy(id, name, x, y) {
  return {
    id,
    sourceId: id,
    name,
    role: "Basic Hostile Infantry",
    side: "enemy",
    x,
    y,
    maxHealth: 100,
    health: 100,
    actionPoints: 2,
    movement: 5,
    meleePower: 6,
    rangedAccuracy: 5,
    morale: 80,
    momentum: 0,
    status: "ACTIVE"
  };
}

function createCombatState() {
  const mission = gameState.currentMission;
  const character = gameState.playerCharacter;
  const playerPositions = mission?.scouted
    ? [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 3 }, { x: 1, y: 4 }]
    : [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }];

  const enemyPositions = mission?.transmissionAnalyzed
    ? [{ x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 4 }, { x: 7, y: 5 }]
    : [{ x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 3 }, { x: 7, y: 5 }];

  const playerUnits = [
    createCombatUnit({ ...character, role: "Commander" }, "player", playerPositions[0]),
    ...gameState.squad.map((member, index) =>
      createCombatUnit(member, "player", playerPositions[index + 1])
    )
  ];

  const covers = new Set(combatConfig.covers);
  if (mission?.terrainInvestigated) covers.add("5,3");

  return {
    units: [
      ...playerUnits,
      createEnemy("alpha", "Reaver Alpha", enemyPositions[0].x, enemyPositions[0].y),
createEnemy("bravo", "Reaver Bravo", enemyPositions[1].x, enemyPositions[1].y),
createEnemy("gamma", "Reaver Gamma", enemyPositions[2].x, enemyPositions[2].y),
createEnemy("delta", "Reaver Delta", enemyPositions[3].x, enemyPositions[3].y)
    ],
    covers,
    round: 1,
    phase: "PLAYER",
    selectedId: playerUnits[0].id,
    actionMode: null,
    brutalPush: false,
    log: ["ROUND 1", "PLAYER TURN"],
    result: null,
    stats: {
      attacks: 0,
      hits: 0,
      enemiesDefeated: 0,
      playerCasualties: 0,
      momentumGenerated: 0
    }
  };
}

function livingUnits(side) {
  return combatState.units.filter((unit) =>
    unit.side === side && unit.status === "ACTIVE"
  );
}

function unitAt(x, y) {
  return combatState.units.find((unit) =>
    unit.status === "ACTIVE" && unit.x === x && unit.y === y
  );
}

function selectedUnit() {
  return combatState.units.find((unit) => unit.id === combatState.selectedId);
}

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function isCover(x, y) {
  return combatState.covers.has(`${x},${y}`);
}

function addCombatLog(message) {
  combatState.log.push(message);
  combatState.log = combatState.log.slice(-80);
}

function beginCombat() {
  if (!gameState.playerCharacter) {
    showComingSoon();
    return;
  }

  if (!gameState.squad.length) initializeSquad();

  addCombatStyles();
  combatState = createCombatState();
  screens.tactical.innerHTML = `<div id="combat-root"></div>`;
  showScreen("tactical");
  renderCombat();
}

function renderCombat() {
  if (!combatState) return;

  const selected = selectedUnit();
  const cells = [];

  for (let y = 0; y < 6; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const unit = unitAt(x, y);
      const canMove = combatState.actionMode === "move" &&
        selected &&
        selected.side === "player" &&
        selected.status === "ACTIVE" &&
        selected.actionPoints >= 1 &&
        !unit &&
        !isCover(x, y) &&
        distance(selected, { x, y }) <= selected.movement;

      cells.push(`
        <button class="combat-cell ${isCover(x, y) ? "cover" : ""} ${canMove ? "move-target" : ""} ${selected && selected.x === x && selected.y === y ? "selected-cell" : ""}" data-cell-x="${x}" data-cell-y="${y}">
          ${unit ? `<span class="unit-marker ${unit.side === "enemy" ? "enemy" : ""}">${escapeHTML(unit.name.substring(0, 7).toUpperCase())}<i class="unit-hp"><i style="width:${Math.max(0, unit.health / unit.maxHealth * 100)}%"></i></i></span>` : ""}
        </button>
      `);
    }
  }

  const selectedPanel = selected ? `
    <h3>SELECTED UNIT</h3>
    <h2>${escapeHTML(selected.name.toUpperCase())}</h2>
    <p class="companion-role">${escapeHTML(selected.role.toUpperCase())}</p>
    <div class="combat-stat"><span>HEALTH</span><strong>${selected.health} / ${selected.maxHealth}</strong></div>
    <div class="combat-stat"><span>ACTION POINTS</span><strong>${selected.actionPoints} / 2</strong></div>
    <div class="combat-stat"><span>MOVEMENT</span><strong>${selected.movement}</strong></div>
    <div class="combat-stat"><span>MELEE POWER</span><strong>${selected.meleePower}</strong></div>
    <div class="combat-stat"><span>RANGED ACCURACY</span><strong>${selected.rangedAccuracy}</strong></div>
    <div class="combat-stat"><span>MOMENTUM</span><strong class="momentum">${selected.momentum} / 3</strong></div>
  ` : "<h3>SELECTED UNIT</h3><p>No unit selected.</p>";

  screens.tactical.innerHTML = `
    <div class="combat-shell">
      <header class="combat-header">
        <div><p class="eyebrow">PROJECT NERIAL // TACTICAL COMMAND</p><h2>IRON REAVERS</h2></div>
        <div class="combat-turn">ROUND ${combatState.round}<br />${combatState.phase} TURN</div>
      </header>
      <div class="combat-layout">
        <div class="combat-board-panel">
          <div class="combat-board">${cells.join("")}</div>
          <div class="combat-controls">
            <button class="combat-control" id="move-action">MOVE</button>
            <button class="combat-control" id="ranged-action">RANGED ATTACK</button>
            <button class="combat-control" id="melee-action">MELEE ATTACK</button>
            <button class="combat-control" id="push-action">BRUTAL PUSH</button>
            <button class="combat-control" id="end-unit-action">END UNIT TURN</button>
            <button class="combat-control" id="end-player-action">END PLAYER TURN</button>
          </div>
        </div>
        <aside>
          <div class="combat-side-panel">${selectedPanel}</div>
          <div class="combat-log-panel"><h3>COMBAT LOG</h3><ol class="combat-log">${combatState.log.map((entry) => `<li>${escapeHTML(entry)}</li>`).join("")}</ol></div>
        </aside>
      </div>
    </div>
  `;

  if (combatState.result) {
    screens.tactical.querySelector(".combat-board-panel").insertAdjacentHTML("beforeend", `
      <div class="combat-result">
        <h2>${combatState.result === "victory" ? "VICTORY" : "DEFEAT"}</h2>
        <p>${combatState.result === "victory" ? "THE ENEMY HAS BEEN BROKEN." : "THE WARBAND HAS FALLEN."}</p>
        <p>Rounds survived: ${combatState.round}<br />
        Enemies defeated: ${combatState.stats.enemiesDefeated}<br />
        Player casualties: ${combatState.stats.playerCasualties}<br />
        Total attacks: ${combatState.stats.attacks}<br />
        Successful attacks: ${combatState.stats.hits}<br />
        Momentum generated: ${combatState.stats.momentumGenerated}</p>
        <button class="action-button" id="return-command">RETURN TO COMMAND</button>
      </div>
    `);
  }

  bindCombatControls();
}

function bindCombatControls() {
  screens.tactical.querySelectorAll("[data-cell-x]").forEach((cell) => {
    cell.addEventListener("click", () => {
      const x = Number(cell.dataset.cellX);
      const y = Number(cell.dataset.cellY);
      const unit = unitAt(x, y);

      if (unit && unit.side === "player" && combatState.phase === "PLAYER") {
        combatState.selectedId = unit.id;
        combatState.actionMode = null;
        renderCombat();
        return;
      }

      if (combatState.actionMode === "move") moveSelected(x, y);
      if (combatState.actionMode === "ranged" || combatState.actionMode === "melee") {
        attackSelected(unit);
      }
    });
  });

  const bind = (id, mode, callback) => {
    const button = document.getElementById(id);
    if (!button) return;
    button.classList.toggle("active", combatState.actionMode === mode);
    button.disabled = Boolean(combatState.result);
    button.addEventListener("click", callback);
  };

  bind("move-action", "move", () => {
    if (canAct(1)) {
      combatState.actionMode = combatState.actionMode === "move" ? null : "move";
      renderCombat();
    }
  });

  bind("ranged-action", "ranged", () => {
    if (canAct(1)) {
      combatState.actionMode = combatState.actionMode === "ranged" ? null : "ranged";
      renderCombat();
    }
  });

  bind("melee-action", "melee", () => {
    if (canAct(1)) {
      combatState.actionMode = combatState.actionMode === "melee" ? null : "melee";
      renderCombat();
    }
  });

  bind("push-action", null, useBrutalPush);
  bind("end-unit-action", null, endUnitTurn);
  bind("end-player-action", null, endPlayerTurn);

  const returnButton = document.getElementById("return-command");
  if (returnButton) {
    returnButton.addEventListener("click", () => {
      if (combatState.result === "victory") {
        renderMissionCompletion();
      } else {
        renderSquad();
        showScreen("squad");
      }
    });
  }
}

function canAct(cost) {
  const unit = selectedUnit();

  return combatState.phase === "PLAYER" &&
    !combatState.result &&
    unit &&
    unit.side === "player" &&
    unit.status === "ACTIVE" &&
    unit.actionPoints >= cost;
}

function moveSelected(x, y) {
  const unit = selectedUnit();

  if (!canAct(1)) return;

  if (unitAt(x, y) || isCover(x, y) ||
      distance(unit, { x, y }) > unit.movement) {
    addCombatLog("That position cannot be reached.");
    combatState.actionMode = null;
    renderCombat();
    return;
  }

  unit.x = x;
  unit.y = y;
  unit.actionPoints -= 1;
  combatState.actionMode = null;
  addCombatLog(`${unit.name} moved to position (${x + 1},${y + 1}).`);
  renderCombat();
}

function attackSelected(target) {
  const attacker = selectedUnit();
  const mode = combatState.actionMode;

  if (!target || target.side === attacker.side) {
    addCombatLog("Select a hostile target.");
    combatState.actionMode = null;
    renderCombat();
    return;
  }

  const range = mode === "melee" ? 1 : 5;

  if (!canAct(1)) return;

  if (distance(attacker, target) > range) {
    addCombatLog("Target is out of range.");
    combatState.actionMode = null;
    renderCombat();
    return;
  }

  resolveAttack(attacker, target, mode);
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function resolveAttack(attacker, target, mode) {
  attacker.actionPoints -= 1;
  combatState.actionMode = null;
  combatState.stats.attacks += 1;

  const roll = rollD20();
  const bonus = mode === "melee" ? attacker.meleePower : attacker.rangedAccuracy;
  const defense = 10 + (isCover(target.x, target.y) ? 2 : 0);
  const total = roll + bonus;
  const baseDamage = mode === "melee" ? 25 : 20;

  addCombatLog(`${attacker.name} attacks ${target.name}.`);
  addCombatLog(`D20: ${roll} + ${bonus} = ${total}${isCover(target.x, target.y) ? " // COVER DEFENSE +2" : ""}`);

  if (roll === 1 || total < defense) {
    addCombatLog(roll === 1 ? "NATURAL 1 — AUTOMATIC MISS" : "MISS");
    renderCombat();
    return;
  }

  const critical = roll === 20;
  let damage = critical ? baseDamage * 2 : baseDamage;

  if (attacker.side === "player" && combatState.brutalPush) {
    damage += 15;
    attacker.momentum -= 2;
    combatState.brutalPush = false;
    addCombatLog("BRUTAL PUSH — +15 DAMAGE");
  }

  target.health = Math.max(0, target.health - damage);
  combatState.stats.hits += 1;

  addCombatLog(critical
    ? `NATURAL 20 — CRITICAL HIT — ${damage} DAMAGE`
    : `HIT — ${damage} DAMAGE`);

  if (attacker.side === "player") {
    attacker.momentum = Math.min(3, attacker.momentum + 1);
    combatState.stats.momentumGenerated += 1;
  }

  if (target.health <= 0) {
    target.status = "DEAD";
    target.actionPoints = 0;
    addCombatLog(`${target.name.toUpperCase()} HAS FALLEN.`);

    if (target.side === "enemy") {
      combatState.stats.enemiesDefeated += 1;

      if (attacker.side === "player") {
        attacker.momentum = Math.min(3, attacker.momentum + 1);
        combatState.stats.momentumGenerated += 1;
      }
    } else {
      combatState.stats.playerCasualties += 1;
    }
  }

  checkCombatResult();
  renderCombat();
}

function useBrutalPush() {
  const unit = selectedUnit();

  if (!canAct(0) || unit.momentum < 2) {
    addCombatLog("BRUTAL PUSH requires 2 Momentum.");
    renderCombat();
    return;
  }

  combatState.brutalPush = !combatState.brutalPush;
  addCombatLog(combatState.brutalPush
    ? `${unit.name} prepares a BRUTAL PUSH.`
    : "BRUTAL PUSH cancelled.");
  renderCombat();
}

function endUnitTurn() {
  const unit = selectedUnit();

  if (!unit || unit.side !== "player" || combatState.phase !== "PLAYER") return;

  unit.actionPoints = 0;
  combatState.actionMode = null;

  const next = livingUnits("player").find((member) => member.actionPoints > 0);
  if (next) combatState.selectedId = next.id;

  addCombatLog(`${unit.name}'s turn ended.`);
  renderCombat();
}

function endPlayerTurn() {
  if (combatState.phase !== "PLAYER" || combatState.result) return;

  livingUnits("player").forEach((unit) => {
    unit.actionPoints = 0;
  });

  combatState.phase = "ENEMY";
  combatState.actionMode = null;
  addCombatLog("ENEMY TURN");
  renderCombat();

  setTimeout(runEnemyTurn, 500);
}

function nearestPlayer(enemy) {
  return livingUnits("player")
    .sort((a, b) => distance(enemy, a) - distance(enemy, b))[0];
}

function moveEnemy(enemy, target) {
  const directions = [
    { x: Math.sign(target.x - enemy.x), y: 0 },
    { x: 0, y: Math.sign(target.y - enemy.y) }
  ];

  const direction = directions.find((step) => {
    const x = enemy.x + step.x;
    const y = enemy.y + step.y;

    return x >= 0 && x < 8 &&
      y >= 0 && y < 6 &&
      !unitAt(x, y) &&
      !isCover(x, y);
  });

  if (direction) {
    enemy.x += direction.x;
    enemy.y += direction.y;
    addCombatLog(`${enemy.name} moved toward the warband.`);
  }
}

function runEnemyTurn() {
  if (!combatState || combatState.result) return;

  livingUnits("enemy").forEach((enemy) => {
    const target = nearestPlayer(enemy);
    if (!target) return;

    if (distance(enemy, target) <= 1) {
      resolveAttack(enemy, target, "melee");
    } else if (distance(enemy, target) <= 5) {
      resolveAttack(enemy, target, "ranged");
    } else {
      moveEnemy(enemy, target);
    }
  });

  if (combatState.result) return;

  combatState.round += 1;
  combatState.phase = "PLAYER";

  livingUnits("player").forEach((unit) => {
    unit.actionPoints = 2;
  });

  const next = livingUnits("player")[0];
  combatState.selectedId = next ? next.id : null;

  addCombatLog(`ROUND ${combatState.round}`);
  addCombatLog("PLAYER TURN");
  renderCombat();
}

function checkCombatResult() {
  if (!livingUnits("enemy").length) {
    combatState.result = "victory";
    combatState.phase = "COMPLETE";
    addCombatLog("VICTORY — THE ENEMY HAS BEEN BROKEN.");
  } else if (!livingUnits("player").length) {
    combatState.result = "defeat";
    combatState.phase = "COMPLETE";
    addCombatLog("DEFEAT — THE WARBAND HAS FALLEN.");
  }
}

// ------------------------------
// Save data and navigation
// ------------------------------

function loadSavedData() {
  try {
    const savedCharacter = localStorage.getItem("nerial_character");
    const savedSquad = localStorage.getItem("nerial_squad");
    const savedMission = localStorage.getItem("nerial_mission_001");
    const savedHistory = localStorage.getItem("nerial_world_history");

    if (savedCharacter) gameState.playerCharacter = JSON.parse(savedCharacter);
    if (savedSquad) gameState.squad = JSON.parse(savedSquad);
    if (savedMission) gameState.currentMission = JSON.parse(savedMission);
    if (savedHistory) gameState.worldHistory = JSON.parse(savedHistory);
  } catch {
    gameState.playerCharacter = null;
    gameState.squad = [];
    gameState.currentMission = null;
    gameState.worldHistory = [];
  }
}

function handleAction(action) {
  if (action === "new-campaign") showScreen("intro");

  if (action === "begin") {
    gameState.creation = { tribe: null, background: null };
    document.getElementById("character-name").value = "";
    renderChoices();
    updateSummary();
    showScreen("creation");
  }

  if (action === "forge") createCharacter();

  if (action === "continue") {
    if (!gameState.squad.length) initializeSquad();
    renderSquad();
    showScreen("squad");
  }

  if (action === "tactical-command") {
    addCombatStyles();
    if (gameState.currentMission?.status === "COMPLETED") {
      renderSquad();
      showScreen("squad");
    } else {
      renderMissionIntro();
    }
  }

  if (action === "back-squad") {
    renderSquad();
    showScreen("squad");
  }

  if (action === "coming-soon") showComingSoon();
}

document.getElementById("character-name").addEventListener("input", updateSummary);

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => handleAction(button.dataset.action));
});

loadSavedData();
