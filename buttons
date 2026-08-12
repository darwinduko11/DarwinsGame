const storyState = {
  scene: null,
  index: 0,
  allowInvestigation: false,
  allowKharos: false,
  aftermathShown: false,
  originalCombatReturnButton: null,
  afterChoice: null,
  awaitingStructure: false
};


const storyFlags = {};

const relationships = {
  rakkar: 0,
  sera: 0,
  varn: 0
};


// ============================================================
// SAVE / LOAD
// ============================================================

function loadStoryState() {
  try {
    Object.assign(
      storyFlags,
      JSON.parse(
        localStorage.getItem("nerial_story_flags") || "{}"
      )
    );

    Object.assign(
      relationships,
      JSON.parse(
        localStorage.getItem("nerial_relationships") || "{}"
      )
    );
  } catch {
    Object.keys(storyFlags).forEach(
      (key) => delete storyFlags[key]
    );

    relationships.rakkar = 0;
    relationships.sera = 0;
    relationships.varn = 0;
  }
}


function saveStoryState() {
  localStorage.setItem(
    "nerial_story_flags",
    JSON.stringify(storyFlags)
  );

  localStorage.setItem(
    "nerial_relationships",
    JSON.stringify(relationships)
  );
}


function setStoryFlag(flag, value = true) {
  storyFlags[flag] = value;
  saveStoryState();
}


function addRelationship(member, amount = 1) {
  relationships[member] =
    (relationships[member] || 0) + amount;

  saveStoryState();
}


function storyCondition(condition) {
  return !condition ||
    condition(storyFlags, relationships);
}


// ============================================================
// STORY STYLES
// ============================================================

function createStoryStyles() {
  if (
    document.getElementById(
      "story-engine-styles"
    )
  ) {
    return;
  }

  const style =
    document.createElement("style");

  style.id = "story-engine-styles";

  style.textContent = `
    .story-dialogue-shell {
      width: min(100%, 58rem);
      margin: auto;
      padding: clamp(1.5rem, 5vw, 3.5rem);
      border: 1px solid var(--line);
      background: linear-gradient(
        135deg,
        rgba(27,34,39,.96),
        var(--panel)
      );
      box-shadow:
        0 2rem 5rem rgba(0,0,0,.45);
    }

    .story-dialogue-shell h2 {
      margin: .4rem 0 2rem;
      color: var(--ash);
      font-size:
        clamp(1.8rem, 5vw, 3.5rem);
      letter-spacing: .04em;
    }

    .story-speaker {
      margin: 0 0 .7rem;
      color: var(--blood-bright);
      font-size: .78rem;
      font-weight: bold;
      letter-spacing: .2em;
    }

    .story-text {
      min-height: 7rem;
      color: var(--ash);
      font-family: Georgia, serif;
      font-size:
        clamp(1rem, 2vw, 1.25rem);
      line-height: 1.7;
      letter-spacing: .025em;
    }

    .story-description {
      color: var(--muted);
      font-size: .78rem;
      line-height: 1.5;
      letter-spacing: .04em;
    }

    .story-controls {
      display: flex;
      flex-wrap: wrap;
      gap: .7rem;
      margin-top: 2rem;
    }

    .story-choice {
      display: block;
      width: 100%;
      padding: 1rem;
      border: 1px solid var(--line);
      color: var(--iron);
      background: rgba(0,0,0,.25);
      text-align: left;
      letter-spacing: .05em;
      cursor: pointer;
    }

    .story-choice:hover,
    .story-choice:focus-visible {
      border-color:
        var(--blood-bright);
      color: white;
      background:
        rgba(169,71,62,.3);
      outline: none;
    }
  `;

  document.head.appendChild(style);
}


// ============================================================
// RENDER DIALOGUE
// ============================================================

function renderDialogueNode(node) {

  if (
    !node ||
    !storyCondition(node.condition)
  ) {
    advanceDialogue();
    return;
  }

  const target =
    document.getElementById(
      "tactical-screen"
    );

  if (!target) {
    console.error(
      "tactical-screen was not found."
    );
    return;
  }

  target.innerHTML = `
    <div class="story-dialogue-shell">

      <p class="eyebrow">
        PROJECT NERIAL // STORY ARCHIVE
      </p>

      <h2>
        ${node.title ||
          "FIELD TRANSMISSION"}
      </h2>

      <p class="story-speaker">
        ${node.speaker || "SYSTEM"}
      </p>

      ${
        node.description
          ? `
            <p class="story-description">
              ${node.description}
            </p>
          `
          : ""
      }

      <div class="story-text">
        ${node.text}
      </div>

      <div class="story-controls">

        ${
          node.choices
            ? node.choices
                .map(
                  (choice, index) => `
                    <button
                      class="story-choice"
                      data-story-choice="${index}"
                    >
                      ${choice.label}
                    </button>
                  `
                )
                .join("")
            : `
              <button
                class="action-button"
                data-story-continue
              >
                <span>
                  ${node.continueLabel ||
                    "CONTINUE"}
                </span>

                <span class="arrow">
                  →
                </span>
              </button>
            `
        }

      </div>

    </div>
  `;

  if (
    typeof showScreen === "function"
  ) {
    showScreen("tactical");
  }


  // CONTINUE BUTTON

  target
    .querySelectorAll(
      "[data-story-continue]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        advanceDialogue
      );

    });


  // CHOICE BUTTONS

  target
    .querySelectorAll(
      "[data-story-choice]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const choice =
            node.choices[
              Number(
                button.dataset.storyChoice
              )
            ];

          if (!choice) {
            console.error(
              "Story choice not found."
            );
            return;
          }

          applyDialogueConsequences(
            choice
          );

          storyState.scene =
            choice.next;

          storyState.index = 0;

          storyState.afterChoice =
            choice.after || null;

          renderDialogueNode(
            storyState.scene[0]
          );

        }
      );

    });
}


// ============================================================
// START / ADVANCE
// ============================================================

function startDialogue(scene) {

  if (!scene || !scene.length) {
    console.error(
      "Attempted to start an empty dialogue scene."
    );
    return;
  }

  createStoryStyles();

  storyState.scene = scene;
  storyState.index = 0;
  storyState.afterChoice = null;

  renderDialogueNode(scene[0]);
}


function advanceDialogue() {

  storyState.index += 1;

  if (
    !storyState.scene ||
    storyState.index >=
      storyState.scene.length
  ) {

    endDialogue();
    return;
  }

  renderDialogueNode(
    storyState.scene[
      storyState.index
    ]
  );
}


// ============================================================
// CONSEQUENCES
// ============================================================

function applyDialogueConsequences(choice) {

  if (choice.flag) {
    setStoryFlag(
      choice.flag
    );
  }

  if (choice.relationship) {

    addRelationship(
      choice.relationship.member,
      choice.relationship.amount
    );

  }
}


// ============================================================
// END DIALOGUE
// ============================================================

function endDialogue() {

  // ==========================================================
  // CORPSE INVESTIGATION FINISHED
  // ==========================================================

  if (
    storyState.afterChoice ===
    "investigation"
  ) {

    storyState.afterChoice = null;

    const target =
      document.getElementById(
        "tactical-screen"
      );

    if (!target) {
      return;
    }

    target.innerHTML = `
      <div class="story-dialogue-shell">

        <p class="eyebrow">
          PROJECT NERIAL // STORY ARCHIVE
        </p>

        <h2>
          INVESTIGATION COMPLETE
        </h2>

        <p class="story-speaker">
          SYSTEM
        </p>

        <div class="story-text">
          The squad has confirmed
          that the damage began
          from within.

          <br><br>

          Whatever happened to
          the victim started
          inside the settlement.

          <br><br>

          The evidence suggests
          that something entered
          the victim before death.
        </div>

        <div class="story-controls">

          <button
            class="action-button"
            data-investigation-complete
          >
            <span>
              RETURN TO KHAROS
            </span>

            <span class="arrow">
              →
            </span>
          </button>

        </div>

      </div>
    `;


    const continueButton =
      target.querySelector(
        "[data-investigation-complete]"
      );


    if (continueButton) {

      continueButton.addEventListener(
        "click",
        () => {

          storyState.allowInvestigation =
            false;

          if (
            typeof renderKharos ===
            "function"
          ) {

            renderKharos();

          } else {

            console.error(
              "renderKharos() was not found."
            );

          }

        }
      );

    }

    return;
  }


  // ==========================================================
  // OPENING DIALOGUE FINISHED
  // ==========================================================

  if (
    storyState.scene ===
    mission001Opening
  ) {

    storyState.allowInvestigation =
      true;

    const button =
      document.createElement(
        "button"
      );

    button.className =
      "action-button";

    button.dataset.missionAction =
      "choices";

    const target =
      document.getElementById(
        "tactical-screen"
      );

    if (target) {

      target.appendChild(
        button
      );

      button.click();

    }

    return;
  }


  // ==========================================================
  // ENTRY DIALOGUE FINISHED
  // ==========================================================

  if (
    storyState.scene ===
    mission001Entry
  ) {

    storyState.allowKharos =
      true;

    if (
      typeof renderKharos ===
      "function"
    ) {

      renderKharos();

    }

    return;
  }


  // ==========================================================
  // AFTERMATH FINISHED
  // ==========================================================

  if (
    storyState.scene ===
    mission001Aftermath
  ) {

    const target =
      document.getElementById(
        "tactical-screen"
      );

    if (!target) {
      return;
    }

    storyState.aftermathShown =
      true;

    target.innerHTML = `
      <div class="story-dialogue-shell">

        <p class="eyebrow">
          PROJECT NERIAL // STORY ARCHIVE
        </p>

        <h2>
          THE ACCESS SHAFT
        </h2>

        <p class="story-speaker">
          SYSTEM
        </p>

        <div class="story-text">

          The last Reaver falls.

          <br><br>

          The squad moves deeper
          into the abandoned
          settlement.

          <br><br>

          Beneath the ruins,
          Varn discovers a hidden
          access shaft.

          <br><br>

          The structure was not
          included on any known
          settlement plans.

          <br><br>

          Something below is still
          transmitting.

        </div>

        <div class="story-controls">

          <button
            class="action-button"
            data-enter-structure
          >
            <span>
              ENTER THE STRUCTURE
            </span>

            <span class="arrow">
              →
            </span>
          </button>

        </div>

      </div>
    `;


    const structureButton =
      target.querySelector(
        "[data-enter-structure]"
      );


    if (structureButton) {

      structureButton.addEventListener(
        "click",
        () => {

          storyState.awaitingStructure =
            false;

          startDialogue(
            mission001Structure
          );

        }
      );

    }

    return;
  }


  // ==========================================================
  // UNDERGROUND STRUCTURE FINISHED
  // ==========================================================

  if (
    storyState.scene ===
    mission001Structure
  ) {

    const target =
      document.getElementById(
        "tactical-screen"
      );

    if (!target) {
      return;
    }

    target.innerHTML = `
      <div class="story-dialogue-shell">

        <p class="eyebrow">
          PROJECT NERIAL // STORY ARCHIVE
        </p>

        <h2>
          MISSION 001 COMPLETE
        </h2>

        <p class="story-speaker">
          SYSTEM
        </p>

        <div class="story-text">

          THE SILENT SETTLEMENT

          <br><br>

          The squad has confirmed
          that the settlement was
          abandoned under unknown
          circumstances.

          <br><br>

          Evidence indicates that
          the victims were killed
          by something that began
          inside their bodies.

          <br><br>

          A concealed structure
          beneath Kharos has been
          discovered.

          <br><br>

          Something beneath the
          settlement is still
          transmitting.

          <br><br>

          <strong>
            NEXT OBJECTIVE:
          </strong>

          <br>

          INVESTIGATE THE STRUCTURE
          BENEATH KHAROS.

        </div>

        <div class="story-controls">

          <button
            class="action-button"
            data-mission-complete
          >
            <span>
              CONTINUE
            </span>

            <span class="arrow">
              →
            </span>
          </button>

        </div>

      </div>
    `;


    const completeButton =
      target.querySelector(
        "[data-mission-complete]"
      );


    if (completeButton) {

      completeButton.addEventListener(
        "click",
        () => {

          if (
            typeof renderKharos ===
            "function"
          ) {

            renderKharos();

          }

        }
      );

    }

    return;
  }
}


// ============================================================
// MISSION 001 OPENING
// ============================================================

const mission001Opening = [

  {
    speaker: "COMMANDER",
    text:
      "The settlement is too quiet."
  },

  {
    speaker: "RAKKAR",
    text:
      "Quiet isn't the word I'd use."
  },

  {
    speaker: "SERA",
    text:
      "There are no workers."
  },

  {
    speaker: "VARN",
    text:
      "No response from the communication tower either."
  },

  {
    speaker: "COMMANDER",
    text:
      "Then we find out why."
  },

  {
    speaker: "SYSTEM",

    description:
      "A figure is visible near the settlement gate. Rakkar notices it first.",

    text:
      "The body hangs from the gate."
  },

  {
    speaker: "RAKKAR",
    text:
      "Commander."
  },

  {
    speaker: "SERA",
    text:
      "Don't touch it."
  },

  {
    speaker: "VARN",
    text:
      "That's strange."
  },

  {
    speaker: "COMMANDER",
    text:
      "What?"
  },

  {
    speaker: "VARN",
    text:
      "The wounds."
  },

  {
    speaker: "VARN",
    text:
      "They weren't made from outside."
  },

  {
    speaker: "VARN",
    text:
      "Something opened the body from within."
  },


  // ==========================================================
  // INVESTIGATION CHOICE
  // ==========================================================

  {
    speaker: "SYSTEM",

    text:
      "What do you order?",

    choices: [


      // ------------------------------------------------------
      // EXAMINE CORPSE
      // ------------------------------------------------------

      {
        label:
          "Examine the corpse.",

        flag:
          "kharosCorpseExamined",

        after:
          "investigation",

        next: [

          {
            speaker: "VARN",
            text:
              "Look at the damage carefully."
          },

          {
            speaker: "COMMANDER",
            text:
              "What am I looking for?"
          },

          {
            speaker: "VARN",
            text:
              "Not what happened. Where it started."
          },

          {
            speaker: "SYSTEM",
            text:
              "Varn points toward a narrow tear beneath the body's rib cage."
          },

          {
            speaker: "VARN",
            text:
              "The damage began inside the chest."
          },

          {
            speaker: "COMMANDER",
            text:
              "So something was already inside them."
          },

          {
            speaker: "VARN",
            text:
              "That's what I'm afraid of."
          }

        ]
      },


      // ------------------------------------------------------
      // RAKKAR
      // ------------------------------------------------------

      {
        label:
          "Rakkar, search the settlement.",

        flag:
          "rakkarSearched",

        relationship: {
          member:
            "rakkar",

          amount:
            1
        },

        next: [

          {
            speaker: "RAKKAR",
            text:
              "Finally."
          },

          {
            speaker: "SYSTEM",
            text:
              "He enters the settlement."
          }

        ]
      },


      // ------------------------------------------------------
      // SERA
      // ------------------------------------------------------

      {
        label:
          "Sera, scout ahead.",

        flag:
          "seraScouted",

        relationship: {
          member:
            "sera",

          amount:
            1
        },

        next: [

          {
            speaker: "SERA",
            text:
              "I'll be back before they know I'm gone."
          },

          {
            speaker: "SYSTEM",
            text:
              "She disappears into the ruins."
          }

        ]
      },


      // ------------------------------------------------------
      // VARN
      // ------------------------------------------------------

      {
        label:
          "Varn, analyze the transmission.",

        flag:
          "varnInvestigated",

        relationship: {
          member:
            "varn",

          amount:
            1
        },

        next: [

          {
            speaker: "VARN",
            text:
              "There's another signal beneath the transmission."
          },

          {
            speaker: "COMMANDER",
            text:
              "Beneath?"
          },

          {
            speaker: "VARN",
            text:
              "Something is transmitting from underground."
          }

        ]
      }

    ]
  }

];


// ============================================================
// MISSION 001 ENTRY / KHAROS
// ============================================================

const mission001Entry = [

  {
    speaker: "SYSTEM",
    text:
      "The settlement is abandoned."
  },

  {
    speaker: "SYSTEM",
    text:
      "Doors hang open. Equipment has been left behind. No bodies."
  },

  {
    speaker: "SYSTEM",
    text:
      "A metallic sound echoes from the street."
  },

  {
    speaker: "RAKKAR",
    text:
      "We aren't alone."
  },

  {
    speaker: "SYSTEM",
    text:
      "HOSTILES DETECTED // IRON REAVERS"
  }

];


// ============================================================
// MISSION 001 AFTERMATH
// ============================================================

const mission001Aftermath = [

  {
    speaker: "SYSTEM",
    text:
      "The last Reaver falls."
  },

  {
    speaker: "SERA",

    text:
      "I told you something was wrong.",

    condition:
      (flags) =>
        flags.seraScouted
  },

  {
    speaker: "RAKKAR",

    text:
      "They weren't guarding this place. They were running from something.",

    condition:
      (flags) =>
        flags.rakkarSearched
  },

  {
    speaker: "VARN",

    text:
      "The signal is still active.",

    condition:
      (flags) =>
        flags.varnInvestigated
  },

  {
    speaker: "VARN",

    text:
      "Whatever killed those people wasn't human.",

    condition:
      (flags) =>
        flags.kharosCorpseExamined
  },

  {
    speaker: "SYSTEM",

    text:
      "The squad discovers an underground access shaft."
  },

  {
    speaker: "VARN",

    text:
      "This wasn't on the settlement plans."
  },

  {
    speaker: "RAKKAR",

    text:
      "Then someone built it."
  },

  {
    speaker: "SERA",

    text:
      "How deep?"
  },

  {
    speaker: "VARN",

    text:
      "I don't know."
  },

  {
    speaker: "VARN",

    text:
      "But something down there is still transmitting."
  }

];


// ============================================================
// NEW: UNDERGROUND STRUCTURE
// ============================================================

const mission001Structure = [

  {
    speaker: "SYSTEM",
    text:
      "The squad descends into the access shaft."
  },

  {
    speaker: "SYSTEM",
    text:
      "The walls are older than the settlement above."
  },

  {
    speaker: "SERA",
    text:
      "These aren't mining tunnels."
  },

  {
    speaker: "RAKKAR",
    text:
      "Then what are they?"
  },

  {
    speaker: "VARN",
    text:
      "A facility."
  },

  {
    speaker: "COMMANDER",
    text:
      "How old?"
  },

  {
    speaker: "VARN",
    text:
      "Older than Kharos."
  },

  {
    speaker: "SYSTEM",
    text:
      "A low-frequency transmission begins pulsing through the corridor."
  },

  {
    speaker: "SERA",
    text:
      "That's the signal."
  },

  {
    speaker: "VARN",
    text:
      "No."
  },

  {
    speaker: "COMMANDER",
    text:
      "What?"
  },

  {
    speaker: "VARN",
    text:
      "The signal isn't coming from the facility."
  },

  {
    speaker: "RAKKAR",
    text:
      "Then where is it coming from?"
  },

  {
    speaker: "VARN",
    text:
      "Something deeper."
  },

  {
    speaker: "SYSTEM",
    text:
      "The corridor lights flicker on one by one."
  },

  {
    speaker: "SYSTEM",
    text:
      "A sealed door appears at the end of the passage."
  },

  {
    speaker: "COMMANDER",
    text:
      "Can you open it?"
  },

  {
    speaker: "VARN",
    text:
      "I can try."
  },

  {
    speaker: "SYSTEM",
    text:
      "The door unlocks."
  },

  {
    speaker: "SYSTEM",
    text:
      "Something moves on the other side."
  },

  {
    speaker: "RAKKAR",
    text:
      "We're not alone down here."
  }

];


// ============================================================
// INITIALIZE
// ============================================================

loadStoryState();


// ============================================================
// BUTTON HANDLING
// ============================================================

document.addEventListener(
  "click",
  (event) => {


    // --------------------------------------------------------
    // INVESTIGATION / CHOICES BUTTON
    // --------------------------------------------------------

    const beginButton =
      event.target.closest(
        '[data-mission-action="choices"]'
      );


    if (beginButton) {

      if (
        !storyState.allowInvestigation
      ) {

        event.preventDefault();
        event.stopImmediatePropagation();

        startDialogue(
          mission001Opening
        );

      } else {

        storyState.allowInvestigation =
          false;

      }

      return;
    }


    // --------------------------------------------------------
    // ENTER KHAROS
    // --------------------------------------------------------

    const enterButton =
      event.target.closest(
        '[data-mission-action="enter-kharos"]'
      );


    if (enterButton) {

      if (
        !storyState.allowKharos
      ) {

        event.preventDefault();
        event.stopImmediatePropagation();

        startDialogue(
          mission001Entry
        );

      } else {

        storyState.allowKharos =
          false;

      }

      return;
    }


    // --------------------------------------------------------
    // COMBAT RETURN
    // --------------------------------------------------------

    const combatReturnButton =
      event.target.closest(
        "#return-command"
      );


    if (
      combatReturnButton &&
      typeof combatState !==
        "undefined" &&
      combatState.result ===
        "victory" &&
      !storyState.aftermathShown
    ) {

      event.preventDefault();
      event.stopImmediatePropagation();

      storyState
        .originalCombatReturnButton =
        combatReturnButton;

      startDialogue(
        mission001Aftermath
      );

    }

  },
  true
);
