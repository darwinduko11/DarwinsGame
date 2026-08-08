const STATE_KEY = "ruinfall_save_v3";

const ITEM_DEFS = {
  "Ragged Blade": { type: "weapon", slot: "weapon", bonuses: { Strength: 1 } },
  "Ashen Charm": { type: "key", keyItem: true },
  "Lockpicks": { type: "consumable", usable: true },
  "Healer's Herb": { type: "consumable", usable: true },
  "Old Map": { type: "key", keyItem: true },
  "Knight Signet": { type: "key", keyItem: true },
  "Ashen Relic": { type: "key", keyItem: true }
};

const NPCS = {
  Mael: { name: "Sister Mael" },
  Vessa: { name: "Vessa" },
  Halven: { name: "Sir Halven" },
  Barkeep: { name: "Barkeep" }
};

const STORY = {
  intro: {
    id: "intro",
    title: "Ashes at the Gate",
    location: "Ruined Gate of Veyr",
    text: "You wake beneath a shattered archway while the bells of a dead city toll through the fog. A hooded priest searches the road. To the east, a candlelit inn leaks warmth into the rain. To the west, Blackwood Forest snarls in the dark.",
    choices: [
      { text: "Approach the priest", next: "priest_meeting" },
      { text: "Enter the inn", next: "inn_hub" },
      { text: "Go into Blackwood", next: "woods_edge" }
    ]
  },

  priest_meeting: {
    id: "priest_meeting",
    title: "Sister Mael",
    location: "Road of Broken Stones",
    text: "Sister Mael studies you with tired eyes. She says the Ashen Chapel lost a relic during the night, and the dead have begun to stir around the catacombs.",
    choices: [
      {
        text: "Vow to recover the relic",
        consequences: {
          quest: {
            id: "relic",
            name: "Recover the Ashen Relic",
            state: "active",
            stage: 1,
            objective: "Find the relic in the catacombs."
          },
          relation: { npc: "Mael", delta: 2 },
          memory: { key: "helped_mael", text: "You promised Sister Mael you would recover the relic." },
          flag: "helped_mael",
          item: "Ashen Charm",
          xp: 5
        },
        next: "road_hub"
      },
      {
        text: "Demand payment for danger",
        check: { stat: "Charisma", dc: 12, success: "mael_pay_success", fail: "mael_pay_fail" },
        successConsequences: { gold: 15, relation: { npc: "Mael", delta: 1 }, memory: { key: "mael_paid", text: "Sister Mael paid you and marked you as useful." } },
        failureConsequences: { relation: { npc: "Mael", delta: -1 } }
      },
      { text: "Leave for the crossroads", next: "road_hub" }
    ]
  },

  mael_pay_success: {
    id: "mael_pay_success",
    title: "A Reluctant Blessing",
    location: "Road of Broken Stones",
    text: "Mael grudgingly pays you and slips a prayer into your palm.",
    choices: [
      { text: "Accept the warning and move on", next: "road_hub" }
    ]
  },

  mael_pay_fail: {
    id: "mael_pay_fail",
    title: "Faith Unmoved",
    location: "Road of Broken Stones",
    text: "Mael refuses your demand. A grave-ghoul crawls from a ditch, drawn by your raised voice.",
    choices: [
      { text: "Flee to the crossroads", consequences: { hp: -2, relation: { npc: "Mael", delta: -1 } }, next: "road_hub" }
    ]
  },

  inn_hub: {
    id: "inn_hub",
    title: "The Hollow Cup",
    location: "The Hollow Cup Inn",
    text: "The inn smells of smoke and old fear. A barkeep watches your hands.",
    choices: [
      {
        text: "Buy rumors for 5 gold",
        requirements: { goldGte: 5 },
        consequences: {
          gold: -5,
          flag: "knows_catacombs",
          memory: { key: "rumors", text: "You learned rumors about the catacombs and the corpse-cart." }
        },
        next: "inn_rumors"
      },
      { text: "Ask about the city", next: "inn_rumors_free" },
      { text: "Return to the crossroads", next: "road_hub" }
    ]
  },

  inn_rumors: {
    id: "inn_rumors",
    title: "Rumors in the Smoke",
    location: "The Hollow Cup Inn",
    text: "The barkeep whispers that the catacombs answer to ash-marked blood. He also mentions a corpse-cart that passes the ash road after midnight.",
    choices: [{ text: "Return to the crossroads", next: "road_hub" }]
  },

  inn_rumors_free: {
    id: "inn_rumors_free",
    title: "Free Gossip",
    location: "The Hollow Cup Inn",
    text: "The barkeep says the chapel gate opens for those with a signet, or those bold enough to sneak past the sentry.",
    choices: [
      {
        text: "Listen carefully",
        consequences: { flag: "heard_gate_secret", memory: { key: "gate_secret", text: "You learned a rumor about the chapel gate." } },
        next: "road_hub"
      }
    ]
  },

  road_hub: {
    id: "road_hub",
    title: "Crossroads of Veyr",
    location: "Road to Veyr",
    text: "North lies the chapel district, east the inn, west the Blackwood trees, and south the ash road.",
    choices: [
      { text: "Go to the chapel district", requirements: { anyFlags: ["heard_gate_secret", "helped_mael"] }, next: "chapel_gate" },
      { text: "Return to the inn", next: "inn_hub" },
      { text: "Enter Blackwood", next: "woods_edge" },
      { text: "Take the ash road", next: "ash_road" }
    ]
  },

  woods_edge: {
    id: "woods_edge",
    title: "Blackwood Edge",
    location: "Blackwood Forest",
    text: "The forest is dense with mist and old malice. A wounded knight leans against a tree, breathing through clenched teeth.",
    choices: [
      { text: "Help the wounded knight", next: "sir_halven" },
      { text: "Press deeper into Blackwood", check: { stat: "Dexterity", dc: 11, success: "woods_path", fail: "woods_lost" } },
      { text: "Return to the road", next: "road_hub" }
    ]
  },

  sir_halven: {
    id: "sir_halven",
    title: "Sir Halven",
    location: "Blackwood Forest",
    text: "Sir Halven, a knight of the chapel order, hands you a signet ring. He asks you to carry word to the chapel if he survives the night.",
    choices: [
      {
        text: "Promise to help",
        consequences: {
          relation: { npc: "Halven", delta: 3 },
          item: "Knight Signet",
          flag: "chapel_access",
          memory: { key: "halven_promised", text: "You promised Sir Halven you'd carry his message." }
        },
        next: "woods_edge"
      },
      {
        text: "Take the ring and flee",
        consequences: {
          item: "Knight Signet",
          relation: { npc: "Halven", delta: -3 },
          memory: { key: "stole_signet", text: "You betrayed Sir Halven and took his signet." }
        },
        next: "woods_edge"
      }
    ]
  },

  woods_path: {
    id: "woods_path",
    title: "Hidden Trail",
    location: "Blackwood Forest",
    text: "You find a hidden trail and a half-buried shrine stone.",
    choices: [
      { text: "Take the shrine stone", consequences: { item: "Old Map", flag: "found_map", memory: { key: "found_map", text: "You found a map hidden in Blackwood." } }, next: "road_hub" },
      { text: "Continue onward", next: "shrine" }
    ]
  },

  shrine: {
    id: "shrine",
    title: "Shrine of the Root",
    location: "Blackwood Depths",
    text: "A broken shrine pulses with faint blue light. The air smells of wet ash.",
    choices: [
      {
        text: "Pray at the shrine",
        consequences: { hp: 4, memory: { key: "shrine_prayed", text: "You prayed at the shrine of the root." }, xp: 3 },
        next: "road_hub"
      },
      {
        text: "Desecrate the shrine",
        consequences: { hp: -3, gold: 12, flag: "desecrated_shrine", memory: { key: "shrine_desecrated", text: "You desecrated the shrine and took its offerings." } },
        next: "road_hub"
      }
    ]
  },

  woods_lost: {
    id: "woods_lost",
    title: "Lost in Blackwood",
    location: "Blackwood Forest",
    text: "The forest shifts around you. You lose the path and stumble back out with scratches and cold fear.",
    choices: [
      { text: "Escape the woods", consequences: { hp: -3 }, next: "road_hub" }
    ]
  },

  ash_road: {
    id: "ash_road",
    title: "Ash Road",
    location: "South Road",
    text: "The road south is lined with dead carts and broken prayer stones. A lantern flickers in the fog.",
    choices: [
      { text: "Inspect the lantern", next: "lantern_choice" },
      { text: "Hide and wait", check: { stat: "Dexterity", dc: 11, success: "hidden_watch", fail: "bandit_ambush" } },
      { text: "Push onward", next: "corpse_cart" }
    ]
  },

  lantern_choice: {
    id: "lantern_choice",
    title: "Lantern in the Fog",
    location: "South Road",
    text: "A pilgrim begs for protection from the marsh.",
    choices: [
      {
        text: "Escort the pilgrim",
        consequences: {
          relation: { npc: "Barkeep", delta: 1 },
          flag: "knows_mire",
          memory: { key: "pilgrim", text: "A pilgrim pointed you toward the mire." },
          xp: 3
        },
        next: "road_hub"
      },
      {
        text: "Rob him",
        check: { stat: "Strength", dc: 10, success: "rob_pilgrim", fail: "pilgrim_curse" }
      }
    ]
  },

  rob_pilgrim: {
    id: "rob_pilgrim",
    title: "Stolen Mercy",
    location: "South Road",
    text: "You take the pilgrim's satchel and leave him trembling in the rain.",
    choices: [
      {
        text: "Keep the spoils",
        consequences: { gold: 10, item: "Healer's Herb", reputation: -1, memory: { key: "robbed_pilgrim", text: "You robbed a pilgrim on the road." } },
        next: "road_hub"
      }
    ]
  },

  pilgrim_curse: {
    id: "pilgrim_curse",
    title: "The Pilgrim's Curse",
    location: "South Road",
    text: "The pilgrim spits a prayer and flees. Your hand trembles with a sudden ache.",
    choices: [
      { text: "Continue anyway", consequences: { hp: -2 }, next: "road_hub" }
    ]
  },

  hidden_watch: {
    id: "hidden_watch",
    title: "Watching from the Stones",
    location: "South Road",
    text: "You remain hidden as ash bandits pass by. One drops a map.",
    choices: [
      {
        text: "Take the map",
        consequences: { item: "Old Map", flag: "found_map", xp: 4, memory: { key: "map_found", text: "You found a map on the road." } },
        next: "road_hub"
      }
    ]
  },

  bandit_ambush: {
    id: "bandit_ambush",
    title: "Road Ambush",
    location: "South Road",
    text: "Bandits spring from the road edge, blades wet with old blood.",
    choices: [
      {
        text: "Pay them off with 8 gold",
        requirements: { goldGte: 8 },
        consequences: { gold: -8, reputation: -1, memory: { key: "paid_bandits", text: "You paid bandits to leave you alone." } },
        next: "road_hub"
      },
      {
        text: "Fight them off",
        check: { stat: "Strength", dc: 12, success: "bandits_defeated", fail: "bandits_hurt" }
      }
    ]
  },

  bandits_defeated: {
    id: "bandits_defeated",
    title: "Bandits Broken",
    location: "South Road",
    text: "You drive them off and search their bodies.",
    choices: [
      { text: "Take their coin", consequences: { gold: 14, item: "Lockpicks", xp: 8 }, next: "road_hub" }
    ]
  },

  bandits_hurt: {
    id: "bandits_hurt",
    title: "Wounded on the Road",
    location: "South Road",
    text: "You win the struggle, but not cleanly.",
    choices: [
      { text: "Stagger away", consequences: { hp: -4, gold: 6 }, next: "road_hub" }
    ]
  },

  corpse_cart: {
    id: "corpse_cart",
    title: "Corpse Cart",
    location: "Ash Road",
    text: "A corpse-cart carrying pyre-bound bodies, coin, and locked crates blocks the road. A guard lantern swings near the driver seat.",
    choices: [
      { text: "Pick the lock", check: { stat: "Dexterity", dc: 10, success: "cart_success", fail: "cart_fail" } },
      { text: "Ambush the driver", check: { stat: "Strength", dc: 12, success: "cart_ambush", fail: "cart_fail" } }
    ]
  },

  cart_success: {
    id: "cart_success",
    title: "Heist Complete",
    location: "Ash Road",
    text: "You slip open the crate and steal supplies before the guards notice.",
    choices: [
      {
        text: "Take the loot and leave",
        consequences: {
          gold: 20,
          item: "Lockpicks",
          relation: { npc: "Vessa", delta: 1 },
          flag: "cart_raided",
          xp: 8
        },
        next: "road_hub"
      }
    ]
  },

  cart_ambush: {
    id: "cart_ambush",
    title: "Silent Strike",
    location: "Ash Road",
    text: "You catch the driver off guard and force the cart to stop.",
    choices: [
      {
        text: "Take the spoils",
        consequences: { gold: 15, items: ["Lockpicks", "Healer's Herb"], flag: "cart_raided", relation: { npc: "Vessa", delta: 1 }, xp: 10 },
        next: "road_hub"
      }
    ]
  },

  cart_fail: {
    id: "cart_fail",
    title: "Caught in the Act",
    location: "Ash Road",
    text: "A guard spots you. Steel flashes in the moonlight as the corpse-cart lurches forward.",
    choices: [
      { text: "Flee wounded", consequences: { hp: -5, gold: -3 }, next: "road_hub" }
    ]
  },

  chapel_gate: {
    id: "chapel_gate",
    title: "The Chapel Gate",
    location: "Ashen Chapel District",
    text: "The chapel stands blackened and cracked. An iron gate blocks the stair to the catacombs.",
    choices: [
      {
        text: "Show Sir Halven's signet",
        requirements: { anyFlags: ["chapel_access"] },
        consequences: { relation: { npc: "Mael", delta: 1 }, flag: "gate_opened_by_signet", xp: 4 },
        next: "catacombs_entry"
      },
      {
        text: "Bribe the sentry",
        requirements: { goldGte: 10 },
        consequences: { gold: -10, flag: "gate_bribed", xp: 4 },
        next: "catacombs_entry"
      },
      { text: "Sneak inside", check: { stat: "Dexterity", dc: 13, success: "catacombs_entry", fail: "gate_fail" } }
    ]
  },

  gate_fail: {
    id: "gate_fail",
    title: "Gate Refused",
    location: "Ashen Chapel District",
    text: "The sentry shoves you back and calls for help.",
    choices: [
      { text: "Retreat", consequences: { hp: -2 }, next: "road_hub" }
    ]
  },

  catacombs_entry: {
    id: "catacombs_entry",
    title: "Catacomb Mouth",
    location: "Beneath Veyr",
    text: "The air turns cold. Bone lanterns and carved doors line the corridor.",
    choices: [
      { text: "Solve the seal", check: { stat: "Intelligence", dc: 12, success: "gate_open", fail: "catacombs_fail" } },
      { text: "Brute force the gate", check: { stat: "Strength", dc: 15, success: "gate_open", fail: "catacombs_fail" } }
    ]
  },

  catacombs_fail: {
    id: "catacombs_fail",
    title: "The Seal Holds",
    location: "Beneath Veyr",
    text: "The seal rejects your attempt. You are forced back into the corridor.",
    choices: [
      { text: "Try again later", consequences: { hp: -2 }, next: "road_hub" }
    ]
  },

  gate_open: {
    id: "gate_open",
    title: "The Gate Opens",
    location: "Beneath Veyr",
    text: "The seal yields, revealing a forgotten chamber where the Ashen Relic rests on a stone plinth.",
    choices: [
      {
        text: "Claim the relic",
        consequences: {
          item: "Ashen Relic",
          flag: "relic_found",
          quest: {
            id: "relic",
            name: "Recover the Ashen Relic",
            state: "completed",
            stage: 2,
            objective: "Return the relic or decide its fate."
          },
          xp: 12,
          memory: { key: "found_relic", text: "You claimed the Ashen Relic from the catacombs." }
        },
        next: "ending_relic"
      },
      {
        text: "Leave it and return",
        consequences: { reputation: 1, memory: { key: "left_relic", text: "You left the Ashen Relic untouched." } },
        next: "ending_walkaway"
      }
    ]
  },

  ending_relic: {
    id: "ending_relic",
    title: "Ending: Relic Reclaimed",
    location: "Beneath Veyr",
    text: "You return from the catacombs with the Ashen Relic. The chapel breathes again, and Sister Mael remembers your name.",
    ending: true
  },

  ending_walkaway: {
    id: "ending_walkaway",
    title: "Ending: The Road Continues",
    location: "Beneath Veyr",
    text: "You leave the relic behind and walk back into the ruined city. The night is not over, but your path has changed.",
    ending: true
  }
};

const defaultState = () => ({
  currentEventId: "intro",
  hp: 30,
  maxHp: 30,
  level: 1,
  xp: 0,
  xpToNext: 20,
  stats: {
    Strength: 2,
    Dexterity: 2,
    Intelligence: 2,
    Constitution: 2,
    Luck: 2,
    Charisma: 2,
    Resolve: 2
  },
  baseStats: {
    Strength: 2,
    Dexterity: 2,
    Intelligence: 2,
    Constitution: 2,
    Luck: 2,
    Charisma: 2,
    Resolve: 2
  },
  gold: 10,
  inventory: ["Ragged Blade"],
  equipment: { weapon: "Ragged Blade", armor: null, trinket: null },
  quests: [],
  relationships: { Mael: 0, Vessa: 0, Halven: 0, Barkeep: 0 },
  reputation: 0,
  flags: [],
  memories: [],
  log: ["You awaken in the ruins of Veyr."],
  notifications: [],
  lastRoll: "",
  statusEffects: []
});

let state = loadGame() || defaultState();

const el = (id) => document.getElementById(id);

function hasFlag(flag) {
  return state.flags.includes(flag);
}

function addFlag(flag) {
  if (!hasFlag(flag)) state.flags.push(flag);
}

function hasMemory(key) {
  return state.memories.some((m) => m.key === key);
}

function addMemory(key, text) {
  if (!hasMemory(key)) {
    state.memories.push({ key, text });
    notify(`Memory unlocked: ${text}`);
  }
}

function notify(text) {
  state.notifications.unshift(text);
  state.notifications = state.notifications.slice(0, 8);
}

function addLog(text) {
  state.log.unshift(text);
  state.log = state.log.slice(0, 25);
}

function statValue(stat) {
  const base = state.baseStats[stat] || 0;
  const eq = Object.values(state.equipment).reduce((sum, itemName) => {
    if (!itemName) return sum;
    const def = ITEM_DEFS[itemName];
    return sum + (def?.bonuses?.[stat] || 0);
  }, 0);
  return base + eq;
}

function rollD20(mod = 0) {
  const d20 = Math.ceil(Math.random() * 20);
  return { d20, total: d20 + mod };
}

function meetsRequirements(req = {}) {
  if (req.goldGte != null && state.gold < req.goldGte) return false;
  if (req.hpGte != null && state.hp < req.hpGte) return false;
  if (req.levelGte != null && state.level < req.levelGte) return false;
  if (req.flag && !hasFlag(req.flag)) return false;
  if (req.flags && !req.flags.every(hasFlag)) return false;
  if (req.anyFlags && !req.anyFlags.some(hasFlag)) return false;
  if (req.notFlags && req.notFlags.some(hasFlag)) return false;
  if (req.memory && !hasMemory(req.memory)) return false;
  if (req.item && !state.inventory.includes(req.item)) return false;
  if (req.items && !req.items.every((item) => state.inventory.includes(item))) return false;
  if (req.anyItem && !req.anyItem.some((item) => state.inventory.includes(item))) return false;
  if (req.quest) {
    const q = state.quests.find((x) => x.id === req.quest.id);
    if (!q) return false;
    if (req.quest.state && q.state !== req.quest.state) return false;
    if (req.quest.stage != null && q.stage !== req.quest.stage) return false;
  }
  if (req.relationship) {
    const value = state.relationships[req.relationship.npc] || 0;
    if (req.relationship.gte != null && value < req.relationship.gte) return false;
    if (req.relationship.lte != null && value > req.relationship.lte) return false;
  }
  if (req.statGte) {
    for (const [stat, value] of Object.entries(req.statGte)) {
      if (statValue(stat) < value) return false;
    }
  }
  return true;
}

function addItem(name) {
  state.inventory.push(name);
  notify(`Item gained: ${name}`);
}

function removeItem(name) {
  const idx = state.inventory.indexOf(name);
  if (idx >= 0) state.inventory.splice(idx, 1);
}

function changeRelation(npc, delta) {
  if (!(npc in state.relationships)) state.relationships[npc] = 0;
  state.relationships[npc] += delta;
  notify(`${NPCS[npc]?.name || npc} relationship ${delta >= 0 ? "+" : ""}${delta}`);
}

function changeQuest(q) {
  const existing = state.quests.find((x) => x.id === q.id);
  if (!existing) state.quests.push({ ...q });
  else Object.assign(existing, q);
  notify(`Quest updated: ${q.name || q.id}`);
}

function gainGold(amount) {
  state.gold = Math.max(0, state.gold + amount);
  notify(`${amount >= 0 ? "Gained" : "Lost"} ${Math.abs(amount)} gold`);
}

function changeHP(amount) {
  state.hp = Math.max(0, Math.min(state.maxHp, state.hp + amount));
  notify(`${amount >= 0 ? "Recovered" : "Lost"} ${Math.abs(amount)} HP`);
}

function gainXP(amount) {
  state.xp += amount;
  notify(`Gained ${amount} XP`);
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = Math.floor(state.xpToNext * 1.35);
    state.maxHp += 4;
    state.hp = state.maxHp;
    state.baseStats.Strength += 1;
    state.baseStats.Constitution += 1;
    notify(`Level up! You are now level ${state.level}.`);
  }
}

function applyConsequences(cons = {}) {
  if (cons.hp != null) changeHP(cons.hp);
  if (cons.gold != null) gainGold(cons.gold);
  if (cons.xp != null) gainXP(cons.xp);
  if (cons.flag) addFlag(cons.flag);
  if (cons.flags) cons.flags.forEach(addFlag);
  if (cons.memory) addMemory(cons.memory.key, cons.memory.text);
  if (cons.relation) changeRelation(cons.relation.npc, cons.relation.delta);
  if (cons.quest) changeQuest(cons.quest);
  if (cons.item) addItem(cons.item);
  if (cons.items) cons.items.forEach(addItem);
  if (cons.removeItem) removeItem(cons.removeItem);
  if (cons.equip) state.equipment.weapon = cons.equip;
  if (cons.reputation != null) {
    state.reputation = (state.reputation || 0) + cons.reputation;
    notify(`Reputation ${cons.reputation >= 0 ? "+" : ""}${cons.reputation}`);
  }
}

function showEvent(id) {
  if (STORY[id]) {
    state.currentEventId = id;
    return true;
  }
  state.currentEventId = "intro";
  return false;
}

function startNewGame() {
  state = defaultState();
  saveGame();
  render();
}

function resolveCheck(choice) {
  const mod = statValue(choice.check.stat);
  const { d20, total } = rollD20(mod);
  const criticalSuccess = d20 === 20;
  const criticalFailure = d20 === 1;
  const success = criticalSuccess || total >= choice.check.dc;
  const outcome = criticalSuccess ? "CRITICAL SUCCESS" : criticalFailure ? "CRITICAL FAILURE" : success ? "SUCCESS" : "FAILURE";
  state.lastRoll = `${outcome} — ${d20} + ${mod} = ${total} vs DC ${choice.check.dc}`;
  addLog(state.lastRoll);

  if (success) {
    if (choice.successConsequences) applyConsequences(choice.successConsequences);
    if (choice.successConsequences?.next) showEvent(choice.successConsequences.next);
    else showEvent(choice.check.success || choice.next);
    addLog(criticalSuccess ? "Critical success." : "Success.");
  } else {
    if (choice.failureConsequences) applyConsequences(choice.failureConsequences);
    if (choice.failureConsequences?.next) showEvent(choice.failureConsequences.next);
    else showEvent(choice.check.fail || choice.next);
    addLog(criticalFailure ? "Critical failure." : "Failure.");
  }
}

function choose(choice) {
  if (choice.check) {
    resolveCheck(choice);
    saveGame();
    render();
    return;
  }

  if (choice.consequences) applyConsequences(choice.consequences);
  if (choice.next) showEvent(choice.next);
  addLog(choice.text);
  saveGame();
  render();
}

function renderChoices(ev) {
  const box = el("choices");
  box.innerHTML = "";

  if (ev.ending) {
    const restart = document.createElement("button");
    restart.className = "choice";
    restart.textContent = "Start New Game";
    restart.onclick = startNewGame;
    box.appendChild(restart);
    return;
  }

  const available = (ev.choices || []).filter((choice) => meetsRequirements(choice.requirements || {}));
  if (!available.length) {
    const fallback = document.createElement("button");
    fallback.className = "choice";
    fallback.textContent = "Return to the crossroads";
    fallback.onclick = () => {
      showEvent("road_hub");
      addLog("You seek another path.");
      saveGame();
      render();
    };
    box.appendChild(fallback);
    return;
  }

  available.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.text;
    btn.onclick = () => choose(choice);
    box.appendChild(btn);
  });
}

function render() {
  const ev = STORY[state.currentEventId] || STORY.intro;
  el("eventTitle").textContent = ev.title;
  el("location").textContent = ev.location || "";
  el("description").textContent = ev.text || "";
  el("flags").textContent = state.lastRoll || "";

  el("status").innerHTML = `
    <div class="list">
      <div class="item">Level ${state.level} | XP ${state.xp}/${state.xpToNext}</div>
      <div class="item">HP: ${state.hp} / ${state.maxHp}</div>
      <div class="item">Strength: ${statValue("Strength")}</div>
      <div class="item">Dexterity: ${statValue("Dexterity")}</div>
      <div class="item">Intelligence: ${statValue("Intelligence")}</div>
      <div class="item">Constitution: ${statValue("Constitution")}</div>
      <div class="item">Luck: ${statValue("Luck")}</div>
      <div class="item">Charisma: ${statValue("Charisma")}</div>
      <div class="item">Resolve: ${statValue("Resolve")}</div>
      <div class="item">Reputation: ${state.reputation || 0}</div>
    </div>
  `;

  el("relationships").innerHTML = Object.entries(state.relationships)
    .map(([k, v]) => `<div class="rel">${NPCS[k]?.name || k}: ${v}</div>`)
    .join("") || "<div class='rel'>No relationships yet</div>";

  el("quests").innerHTML = state.quests.length
    ? state.quests.map((q) => `<div class="quest">${q.name} — ${q.state}${q.stage ? ` (Stage ${q.stage})` : ""}</div>`).join("")
    : "<div class='quest'>No active quests</div>";

  el("inventory").innerHTML = state.inventory.length
    ? state.inventory.map((i) => `<div class="item">${i}</div>`).join("")
    : "<div class='item'>Empty</div>";

  el("gold").innerHTML = `<div class="item">${state.gold} gold</div>`;

  el("memory").innerHTML = state.memories.length
    ? state.memories.map((m) => `<div class="memory-item">${m.text}</div>`).join("")
    : "<div class='memory-item'>Nothing yet</div>";

  el("log").innerHTML = state.log.map((t) => `<div>${t}</div>`).join("");

  renderChoices(ev);
  renderNotifications();
}

function renderNotifications() {
  let box = document.getElementById("notifications");
  if (!box) {
    box = document.createElement("div");
    box.id = "notifications";
    box.className = "notifications";
    document.querySelector(".inventory-panel").appendChild(box);
  }
  box.innerHTML = state.notifications.map((n) => `<div class="item">${n}</div>`).join("");
}

function saveGame() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    notify("Save failed.");
  }
}

function normalizeState(loaded) {
  const base = defaultState();
  const merged = { ...base, ...loaded };

  merged.stats = { ...base.stats, ...(loaded.stats || {}) };
  merged.baseStats = { ...base.baseStats, ...(loaded.baseStats || {}) };
  merged.relationships = { ...base.relationships, ...(loaded.relationships || {}) };
  merged.equipment = { ...base.equipment, ...(loaded.equipment || {}) };

  merged.quests = Array.isArray(loaded.quests) ? loaded.quests.filter((q) => q && q.id) : [];
  merged.flags = Array.isArray(loaded.flags) ? loaded.flags : [];
  merged.memories = Array.isArray(loaded.memories) ? loaded.memories.filter((m) => m && m.key) : [];
  merged.inventory = Array.isArray(loaded.inventory) ? loaded.inventory : ["Ragged Blade"];
  merged.notifications = Array.isArray(loaded.notifications) ? loaded.notifications : [];
  merged.log = Array.isArray(loaded.log) ? loaded.log : ["Game loaded."];
  merged.lastRoll = typeof loaded.lastRoll === "string" ? loaded.lastRoll : "";
  merged.currentEventId = STORY[loaded.currentEventId] ? loaded.currentEventId : "intro";

  merged.hp = Number.isFinite(merged.hp) ? Math.max(0, Math.min(merged.maxHp, merged.hp)) : base.hp;
  merged.maxHp = Number.isFinite(merged.maxHp) ? Math.max(1, merged.maxHp) : base.maxHp;
  merged.gold = Number.isFinite(merged.gold) ? Math.max(0, merged.gold) : base.gold;
  merged.level = Number.isFinite(merged.level) ? Math.max(1, merged.level) : base.level;
  merged.xp = Number.isFinite(merged.xp) ? Math.max(0, merged.xp) : base.xp;
  merged.xpToNext = Number.isFinite(merged.xpToNext) ? Math.max(5, merged.xpToNext) : base.xpToNext;

  return merged;
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

function safeLoad() {
  const loaded = loadGame();
  if (!loaded) return;
  state = loaded;
  addLog("Game loaded.");
  saveGame();
  render();
}

el("saveBtn").onclick = () => {
  saveGame();
  addLog("Game saved.");
  render();
};

el("loadBtn").onclick = () => {
  safeLoad();
};

el("newGameBtn").onclick = startNewGame;

safeLoad();
if (!state.currentEventId || !STORY[state.currentEventId]) state.currentEventId = "intro";
render();
