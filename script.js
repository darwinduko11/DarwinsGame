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
          relation: { npc: "Vessa", delta: 1 },
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
  },
  test_hub: {
    id: "test_hub",
    title: "Old Road Shrine",
    location: "Developer Test Route",
    text: "A hidden shrine used for testing branching, checks, consequences, and returns.",
    choices: [
      { text: "Enter the ruined camp", next: "test_camp" },
      { text: "Follow the blood trail", next: "test_trail" },
      { text: "Return to the crossroads", next: "road_hub" }
    ]
  },
  test_camp: {
    id: "test_camp",
    title: "Ruined Camp",
    location: "Developer Test Route",
    text: "A collapsed camp with one intact chest and a nervy look to the shadows.",
    choices: [
      {
        text: "Open the chest",
        check: { stat: "Dexterity", dc: 10, success: "test_chest_success", fail: "test_chest_fail" }
      },
      {
        text: "Search for clues",
        consequences: { flag: "test_clue", memory: { key: "test_clue", text: "You found a clue at the ruined camp." } },
        next: "test_hall"
      }
    ]
  },
  test_chest_success: {
    id: "test_chest_success",
    title: "Chest Opened",
    location: "Developer Test Route",
    text: "The lid opens cleanly.",
    choices: [
      {
        text: "Take the contents",
        consequences: { gold: 5, item: "Lockpicks", xp: 2 },
        next: "test_hall"
      }
    ]
  },
  test_chest_fail: {
    id: "test_chest_fail",
    title: "Chest Trap",
    location: "Developer Test Route",
    text: "A needle trap snaps out from the lock.",
    choices: [
      { text: "Bandage the wound", consequences: { hp: -1 }, next: "test_hall" }
    ]
  },
  test_trail: {
    id: "test_trail",
    title: "Blood Trail",
    location: "Developer Test Route",
    text: "The trail leads into a narrow passage.",
    choices: [
      { text: "Sneak through", check: { stat: "Dexterity", dc: 11, success: "test_sneak_success", fail: "test_sneak_fail" } },
      { text: "Force the gate", check: { stat: "Strength", dc: 12, success: "test_force_success", fail: "test_force_fail" } }
    ]
  },
  test_sneak_success: {
    id: "test_sneak_success",
    title: "Silent Passage",
    location: "Developer Test Route",
    text: "You move without being seen.",
    choices: [
      { text: "Continue deeper", next: "test_hall" }
    ]
  },
  test_sneak_fail: {
    id: "test_sneak_fail",
    title: "Spotted",
    location: "Developer Test Route",
    text: "A watcher notices you.",
    choices: [
      { text: "Retreat quickly", consequences: { hp: -2 }, next: "test_hall" }
    ]
  },
  test_force_success: {
    id: "test_force_success",
    title: "Gate Broken",
    location: "Developer Test Route",
    text: "The gate gives way.",
    choices: [
      { text: "Take the shortcut", consequences: { xp: 3 }, next: "test_hall" }
    ]
  },
  test_force_fail: {
    id: "test_force_fail",
    title: "Bruised Knuckles",
    location: "Developer Test Route",
    text: "The gate does not move.",
    choices: [
      { text: "Fall back", consequences: { hp: -3 }, next: "test_hall" }
    ]
  },
  test_hall: {
    id: "test_hall",
    title: "Broken Hall",
    location: "Developer Test Route",
    text: "A central hall where your path can split again.",
    choices: [
      { text: "Open the sealed door", check: { stat: "Intelligence", dc: 12, success: "test_reconnect", fail: "test_sealed_fail" } },
      { text: "Go back to camp", next: "test_camp" },
      { text: "Return to the road", next: "road_hub" }
    ]
  },
  test_sealed_fail: {
    id: "test_sealed_fail",
    title: "Sealed Door Holds",
    location: "Developer Test Route",
    text: "The runes resist you.",
    choices: [
      { text: "Try a different route", next: "test_reconnect" }
    ]
  },
  test_reconnect: {
    id: "test_reconnect",
    title: "Hidden Exit",
    location: "Developer Test Route",
    text: "You find a passage that loops back to the road.",
    choices: [
      {
        text: "Return to the crossroads",
        consequences: { memory: { key: "test_route", text: "You navigated the test route and returned safely." } },
        next: "road_hub"
      }
    ]
  },

  // New mini-adventure events
  chapel_gate_approach: {
    id: "chapel_gate_approach",
    title: "Black Gate, Broken Bell",
    location: "Ashen Chapel District",
    text: "A half-collapsed stair leads to the chapel yard. Black candles burn in brass cups, and something scratches beneath the stone.",
    choices: [
      { text: "Approach the chapel doors", next: "chapel_warden" },
      { text: "Circle the yard", check: { stat: "Dexterity", dc: 11, success: "chapel_side_entrance", fail: "chapel_wardens_notice" } },
      { text: "Turn back to the road", next: "road_hub" }
    ]
  },
  chapel_warden: {
    id: "chapel_warden",
    title: "The Warden of Ash",
    location: "Ashen Chapel District",
    text: "A grim sentry blocks the way and asks why you have come.",
    choices: [
      { text: "Say Sister Mael sent you", requirements: { anyFlags: ["helped_mael", "heard_gate_secret"] }, next: "chapel_inner" },
      { text: "Show the Knight Signet", requirements: { item: "Knight Signet" }, next: "chapel_inner" },
      { text: "Lie and demand entry", check: { stat: "Charisma", dc: 13, success: "chapel_inner", fail: "chapel_wardens_notice" } }
    ]
  },
  chapel_side_entrance: {
    id: "chapel_side_entrance",
    title: "Side Door in Ruin",
    location: "Ashen Chapel District",
    text: "You find a cracked side door hidden behind ivy and soot.",
    choices: [
      { text: "Slip inside", next: "chapel_inner" },
      { text: "Search the outer yard", next: "chapel_courtyard" }
    ]
  },
  chapel_wardens_notice: {
    id: "chapel_wardens_notice",
    title: "Seen in the Ash",
    location: "Ashen Chapel District",
    text: "The sentry spots you and raises the alarm.",
    choices: [
      { text: "Run for cover", consequences: { hp: -2, reputation: -1 }, next: "road_hub" }
    ]
  },
  chapel_inner: {
    id: "chapel_inner",
    title: "Nave of Soot",
    location: "Ashen Chapel",
    text: "The nave is gutted by fire. At the altar, Sister Mael kneels beside a blood-stained ledger.",
    choices: [
      { text: "Speak to Mael", next: "maels_request" },
      { text: "Inspect the ledger", next: "ledger_secret" },
      { text: "Search the pews", next: "chapel_pews" }
    ]
  },
  maels_request: {
    id: "maels_request",
    title: "Mael's Plea",
    location: "Ashen Chapel",
    text: "Mael asks you to recover the chapel's missing votive relic from a crypt below. She fears the ledger is lying to her.",
    choices: [
      {
        text: "Accept the task",
        consequences: {
          quest: {
            id: "votive",
            name: "The Votive Relic",
            state: "active",
            stage: 1,
            objective: "Find the chapel's votive relic."
          },
          relation: { npc: "Mael", delta: 2 },
          flag: "accepted_votive",
          memory: { key: "accepted_votive", text: "You agreed to help recover the chapel's votive relic." },
          xp: 4
        },
        next: "chapel_courtyard"
      },
      {
        text: "Refuse and ask for payment",
        check: { stat: "Charisma", dc: 12, success: "mael_paid_deeper", fail: "mael_rebuke" }
      }
    ]
  },
  mael_paid_deeper: {
    id: "mael_paid_deeper",
    title: "A Silent Coin",
    location: "Ashen Chapel",
    text: "Mael pays you in silence, though her eyes harden.",
    choices: [
      { text: "Take the coin and continue", consequences: { gold: 12, reputation: 1 }, next: "chapel_courtyard" }
    ]
  },
  mael_rebuke: {
    id: "mael_rebuke",
    title: "A Cold Reproach",
    location: "Ashen Chapel",
    text: "Mael calls you mercenary and sends you from the altar.",
    choices: [
      { text: "Leave without a word", consequences: { relation: { npc: "Mael", delta: -1 } }, next: "road_hub" }
    ]
  },
  ledger_secret: {
    id: "ledger_secret",
    title: "Ledger of Candlewax",
    location: "Ashen Chapel",
    text: "The ledger records a hidden passage, a toll owed in blood, and a name scratched out in haste.",
    choices: [
      {
        text: "Memorize the passage",
        consequences: { flag: "knows_crypt_passage", memory: { key: "crypt_passage", text: "You learned a hidden passage to the crypt." }, xp: 3 },
        next: "chapel_courtyard"
      },
      { text: "Show the ledger to Mael", requirements: { anyFlags: ["accepted_votive"] }, next: "maels_warning" }
    ]
  },
  maels_warning: {
    id: "maels_warning",
    title: "Mael Warns You",
    location: "Ashen Chapel",
    text: "Mael says the scratched name belonged to her predecessor, who vanished below the chapel.",
    choices: [
      { text: "Ask about the vanished priest", next: "chapel_courtyard" }
    ]
  },
  chapel_pews: {
    id: "chapel_pews",
    title: "Broken Pews",
    location: "Ashen Chapel",
    text: "You find prayer ash, a cracked censer, and a hidden key wedged beneath a bench.",
    choices: [
      {
        text: "Take the key",
        consequences: { item: "Old Map", flag: "found_chapel_key", memory: { key: "chapel_key", text: "You found a chapel key hidden in the pews." } },
        next: "chapel_courtyard"
      },
      { text: "Leave the pews", next: "chapel_courtyard" }
    ]
  },
  chapel_courtyard: {
    id: "chapel_courtyard",
    title: "Ashen Courtyard",
    location: "Ashen Chapel",
    text: "The courtyard drops into a stairwell choked with cold air. A crypt door waits below.",
    choices: [
      { text: "Enter the crypt", requirements: { anyFlags: ["knows_crypt_passage", "found_chapel_key", "accepted_votive"] }, next: "crypt_entry" },
      { text: "Force the crypt door", check: { stat: "Strength", dc: 14, success: "crypt_entry", fail: "crypt_guardian" } },
      { text: "Search the courtyard shrine", next: "courtyard_shrine" }
    ]
  },
  courtyard_shrine: {
    id: "courtyard_shrine",
    title: "Courtyard Shrine",
    location: "Ashen Chapel",
    text: "A bent shrine holds a wax seal and a faintly warm ember of prayer.",
    choices: [
      {
        text: "Take the ember",
        consequences: { item: "Ashen Charm", flag: "ember_taken", memory: { key: "ember_taken", text: "You took an ember from the chapel shrine." }, xp: 2 },
        next: "chapel_courtyard"
      },
      {
        text: "Pray for guidance",
        consequences: { hp: 3, reputation: 1, memory: { key: "prayed_chapel", text: "You prayed at the chapel courtyard shrine." } },
        next: "chapel_courtyard"
      }
    ]
  },
  crypt_entry: {
    id: "crypt_entry",
    title: "Crypt Steps",
    location: "Beneath the Chapel",
    text: "The stairs descend into damp stone. A distant choir hums with no living throat.",
    choices: [
      { text: "Enter the ossuary", next: "ossuary" },
      { text: "Inspect the chains", check: { stat: "Intelligence", dc: 11, success: "chain_room", fail: "crypt_guardian" } }
    ]
  },
  chain_room: {
    id: "chain_room",
    title: "Chain Chamber",
    location: "Beneath the Chapel",
    text: "Broken chains hang from the ceiling, and one still leads into darkness.",
    choices: [
      { text: "Follow the chain", next: "ossuary" },
      { text: "Cut it free", check: { stat: "Strength", dc: 12, success: "chain_cut", fail: "crypt_guardian" } }
    ]
  },
  chain_cut: {
    id: "chain_cut",
    title: "Chain Broken",
    location: "Beneath the Chapel",
    text: "The chain snaps free, revealing a hidden niche.",
    choices: [
      {
        text: "Take the buried offering",
        consequences: { gold: 16, item: "Healer's Herb", memory: { key: "chain_loot", text: "You looted a hidden offering from the crypt." } },
        next: "ossuary"
      }
    ]
  },
  ossuary: {
    id: "ossuary",
    title: "Ossuary of Echoes",
    location: "Beneath the Chapel",
    text: "Skulls line the walls. In the center stands a sealed reliquary and a corpse that looks recently fed.",
    choices: [
      { text: "Open the reliquary", check: { stat: "Luck", dc: 12, success: "reliquary_open", fail: "reliquary_trap" } },
      { text: "Speak the dead's name", check: { stat: "Resolve", dc: 12, success: "whispered_truth", fail: "crypt_guardian" } },
      { text: "Take the corridor left", next: "mire_gate" }
    ]
  },
  reliquary_open: {
    id: "reliquary_open",
    title: "The Reliquary Yields",
    location: "Beneath the Chapel",
    text: "Inside lies a votive relic wrapped in ash cloth and a black pearl.",
    choices: [
      {
        text: "Claim both",
        consequences: {
          item: "Ashen Relic",
          gold: 10,
          quest: { id: "votive", name: "The Votive Relic", state: "completed", stage: 2, objective: "Decide whether to return the relic or keep it." },
          flag: "votive_found",
          xp: 10,
          memory: { key: "votive_found", text: "You found the chapel's votive relic." }
        },
        next: "votive_decision"
      }
    ]
  },
  votive_decision: {
    id: "votive_decision",
    title: "The Votive Decision",
    location: "Beneath the Chapel",
    text: "The relic lies in your hands. Return it to Mael, bring it to the tower, or keep its power for yourself.",
    choices: [
      { text: "Return the relic to Sister Mael", requirements: { item: "Ashen Relic", anyFlags: ["accepted_votive", "helped_mael"] }, next: "return_mael" },
      { text: "Seek Vessa's ritual", requirements: { anyFlags: ["vessa_bargain", "ritual_clue", "knows_truth"] }, next: "ritual_choice" },
      { text: "Cast the relic down", requirements: { item: "Ashen Relic" }, next: "relic_cast" },
      { text: "Keep the relic and leave", requirements: { item: "Ashen Relic" }, next: "ending_walkaway_adv" }
    ]
  },
  reliquary_trap: {
    id: "reliquary_trap",
    title: "Reliquary Trap",
    location: "Beneath the Chapel",
    text: "Needles of bone snap from the reliquary and nick your skin.",
    choices: [
      { text: "Pull free", consequences: { hp: -4, gold: 4 }, next: "ossuary" }
    ]
  },
  whispered_truth: {
    id: "whispered_truth",
    title: "A Whispered Truth",
    location: "Beneath the Chapel",
    text: "The dead name a stolen relic, a hidden bargain, and a priest who traded faith for safety.",
    choices: [
      {
        text: "Carry the truth to Mael",
        consequences: { flag: "knows_truth", memory: { key: "knows_truth", text: "You learned the chapel's hidden truth." }, reputation: 1 },
        next: "votive_decision"
      },
      { text: "Keep the truth to yourself", next: "mire_gate" }
    ]
  },
  crypt_guardian: {
    id: "crypt_guardian",
    title: "Crypt Guardian",
    location: "Beneath the Chapel",
    text: "A hollow guardian rises from the dark, lantern eyes burning.",
    choices: [
      { text: "Fight it", check: { stat: "Strength", dc: 13, success: "guardian_broken", fail: "guardian_wounded" } },
      { text: "Slip away", check: { stat: "Dexterity", dc: 12, success: "mire_gate", fail: "guardian_wounded" } }
    ]
  },
  guardian_broken: {
    id: "guardian_broken",
    title: "Guardian Broken",
    location: "Beneath the Chapel",
    text: "The guardian falls apart in a shower of dust and old iron.",
    choices: [
      { text: "Search the remains", consequences: { gold: 8, xp: 6 }, next: "ossuary" }
    ]
  },
  guardian_wounded: {
    id: "guardian_wounded",
    title: "Wounded by the Dead",
    location: "Beneath the Chapel",
    text: "You escape, but the dead mark you with their chill.",
    choices: [
      { text: "Retreat deeper", consequences: { hp: -3 }, next: "mire_gate" }
    ]
  },
  mire_gate: {
    id: "mire_gate",
    title: "Mire Gate",
    location: "Flooded Crypt Passage",
    text: "A flooded tunnel ends at a rusted gate. Beyond it lies a stink of swamp water and rot.",
    choices: [
      { text: "Force the gate", check: { stat: "Strength", dc: 11, success: "mire_shack", fail: "mire_snare" } },
      { text: "Pick the lock", requirements: { item: "Lockpicks" }, check: { stat: "Dexterity", dc: 10, success: "mire_shack", fail: "mire_snare" } },
      { text: "Listen for movement", check: { stat: "Resolve", dc: 10, success: "mire_secret", fail: "mire_snare" } }
    ]
  },
  mire_secret: {
    id: "mire_secret",
    title: "A Hidden Route",
    location: "Flooded Crypt Passage",
    text: "You hear footsteps on the other side and find a cracked wall leading around the gate.",
    choices: [
      { text: "Crawl through", next: "mire_shack" }
    ]
  },
  mire_snare: {
    id: "mire_snare",
    title: "Snared in the Dark",
    location: "Flooded Crypt Passage",
    text: "The gate is trapped. Black water floods the tunnel.",
    choices: [
      { text: "Wrench free", consequences: { hp: -5 }, next: "mire_shack" }
    ]
  },
  mire_shack: {
    id: "mire_shack",
    title: "Mire Shack",
    location: "Marsh Edge",
    text: "A witch's shack leans over the black water. Smoke leaks from a crooked chimney.",
    choices: [
      { text: "Knock on the door", next: "witch_vessa" },
      { text: "Snoop around the shack", check: { stat: "Dexterity", dc: 12, success: "shack_cache", fail: "shack_caught" } },
      { text: "Burn the shack", check: { stat: "Resolve", dc: 14, success: "shack_burned", fail: "shack_caught" } }
    ]
  },
  witch_vessa: {
    id: "witch_vessa",
    title: "Vessa of the Mire",
    location: "Marsh Edge",
    text: "Vessa offers you a bargain: the relic's true purpose, in exchange for a favor later.",
    choices: [
      {
        text: "Accept Vessa's bargain",
        consequences: {
          relation: { npc: "Vessa", delta: 3 },
          flag: "vessa_bargain",
          memory: { key: "vessa_bargain", text: "You made a bargain with Vessa." },
          xp: 4
        },
        next: "vessa_reveals"
      },
      {
        text: "Refuse and threaten her",
        check: { stat: "Charisma", dc: 13, success: "vessa_reveals", fail: "shack_caught" }
      }
    ]
  },
  shack_cache: {
    id: "shack_cache",
    title: "Hidden Cache",
    location: "Marsh Edge",
    text: "You find a bundle of herbs, coin, and a note naming the relic's buyer.",
    choices: [
      {
        text: "Take the cache",
        consequences: { gold: 14, item: "Healer's Herb", flag: "found_cache", memory: { key: "found_cache", text: "You found a hidden cache in Vessa's shack." } },
        next: "vessa_reveals"
      }
    ]
  },
  shack_burned: {
    id: "shack_burned",
    title: "The Shack Burns",
    location: "Marsh Edge",
    text: "Flame eats the rafters. Vessa appears in the smoke, furious.",
    choices: [
      { text: "Run", consequences: { reputation: -2, hp: -2 }, next: "mire_crossroads" }
    ]
  },
  shack_caught: {
    id: "shack_caught",
    title: "Caught in the Marsh",
    location: "Marsh Edge",
    text: "The shack's ward snaps shut around your ankle.",
    choices: [
      { text: "Pay the price", consequences: { hp: -3, gold: -4 }, next: "mire_crossroads" }
    ]
  },
  vessa_reveals: {
    id: "vessa_reveals",
    title: "Vessa's Warning",
    location: "Marsh Edge",
    text: "Vessa says the relic was stolen to awaken something beneath the chapel. She points you toward the old bell tower.",
    choices: [
      { text: "Trust her and leave", next: "mire_crossroads" },
      { text: "Ask for a way back later", consequences: { flag: "vessa_wayback", reputation: 1 }, next: "mire_crossroads" }
    ]
  },
  mire_crossroads: {
    id: "mire_crossroads",
    title: "Mire Crossroads",
    location: "Marsh Edge",
    text: "Three paths emerge: back to Veyr, deeper into the mire, or toward the bell tower.",
    choices: [
      { text: "Return to the road", next: "road_hub" },
      { text: "Seek the bell tower", requirements: { anyFlags: ["vessa_bargain", "knows_truth", "vessa_wayback"] }, next: "bell_tower" },
      { text: "Venture deeper into the mire", next: "mire_depths" }
    ]
  },
  mire_depths: {
    id: "mire_depths",
    title: "Mire Depths",
    location: "Marsh Depths",
    text: "The reeds close around you. A corpse-lantern floats ahead, leading to something half-buried in mud.",
    choices: [
      { text: "Follow the lantern", check: { stat: "Luck", dc: 11, success: "mire_cache", fail: "mire_sink" } },
      { text: "Turn back", next: "mire_crossroads" }
    ]
  },
  mire_cache: {
    id: "mire_cache",
    title: "Mud-Buried Cache",
    location: "Marsh Depths",
    text: "You find a rusted coffer and a diary describing a ritual under the chapel.",
    choices: [
      {
        text: "Take the coffer",
        consequences: { gold: 18, item: "Old Map", flag: "ritual_clue", memory: { key: "ritual_clue", text: "You found proof of a ritual beneath the chapel." }, xp: 6 },
        next: "mire_crossroads"
      }
    ]
  },
  mire_sink: {
    id: "mire_sink",
    title: "Sunk in the Mire",
    location: "Marsh Depths",
    text: "The mud pulls at your boots and steals your breath.",
    choices: [
      { text: "Struggle free", consequences: { hp: -4 }, next: "mire_crossroads" }
    ]
  },
  bell_tower: {
    id: "bell_tower",
    title: "Old Bell Tower",
    location: "Veyr Bell Tower",
    text: "The tower leans over the city like a broken finger. Its bell is gone, but the rope still sways.",
    choices: [
      { text: "Climb the tower", next: "tower_top" },
      { text: "Search the stairs", check: { stat: "Dexterity", dc: 12, success: "tower_archive", fail: "tower_fall" } },
      { text: "Call out for whoever watches", check: { stat: "Charisma", dc: 12, success: "tower_visitor", fail: "tower_fall" } }
    ]
  },
  tower_archive: {
    id: "tower_archive",
    title: "Bell Tower Archive",
    location: "Veyr Bell Tower",
    text: "You discover records of offerings sent to the chapel and a hidden name: the relic answers only to one who refuses it.",
    choices: [
      { text: "Pocket the records", consequences: { memory: { key: "tower_records", text: "You found records in the bell tower." }, xp: 4 }, next: "tower_top" }
    ]
  },
  tower_visitor: {
    id: "tower_visitor",
    title: "Watcher in the Bell Tower",
    location: "Veyr Bell Tower",
    text: "A pale watcher appears and offers you a final warning: keep or destroy the relic, but do not return it unmade.",
    choices: [
      {
        text: "Accept the warning",
        consequences: { flag: "tower_warning", reputation: 1, memory: { key: "tower_warning", text: "A watcher warned you about the relic." } },
        next: "tower_top"
      }
    ]
  },
  tower_fall: {
    id: "tower_fall",
    title: "Stumbling on the Steps",
    location: "Veyr Bell Tower",
    text: "The stairs crack and you tumble, catching yourself badly.",
    choices: [
      { text: "Climb on", consequences: { hp: -3 }, next: "tower_top" }
    ]
  },
  tower_top: {
    id: "tower_top",
    title: "At the Top of the Tower",
    location: "Veyr Bell Tower",
    text: "From above, you can see the chapel, the mire, and the road twisting through ruin. The relic's fate can still be changed.",
    choices: [
      { text: "Return to Mael with the relic", requirements: { item: "Ashen Relic", anyFlags: ["accepted_votive", "helped_mael"] }, next: "return_mael" },
      { text: "Seek Vessa's ritual", requirements: { anyFlags: ["vessa_bargain", "ritual_clue", "knows_truth"] }, next: "ritual_choice" },
      { text: "Cast the relic down", requirements: { item: "Ashen Relic" }, next: "relic_cast" },
      { text: "Keep the relic and leave", requirements: { item: "Ashen Relic" }, next: "ending_walkaway_adv" },
      { text: "Go back to the road", next: "road_hub" }
    ]
  },
  return_mael: {
    id: "return_mael",
    title: "Return to the Chapel",
    location: "Ashen Chapel",
    text: "Mael receives the relic with trembling hands. The chapel bells begin to ring again, though the sound is thin and sad.",
    choices: [
      {
        text: "Complete the vow",
        consequences: {
          quest: { id: "votive", name: "The Votive Relic", state: "completed", stage: 3, objective: "Return the relic to Sister Mael." },
          relation: { npc: "Mael", delta: 4 },
          reputation: 2,
          xp: 12,
          memory: { key: "returned_relic", text: "You returned the votive relic to Sister Mael." }
        },
        next: "ending_mael"
      }
    ]
  },
  ritual_choice: {
    id: "ritual_choice",
    title: "Ritual of Unmaking",
    location: "Veyr Bell Tower",
    text: "Vessa's notes describe a ritual that can bind, break, or defile the relic.",
    choices: [
      {
        text: "Bind the relic to the chapel",
        check: { stat: "Resolve", dc: 13, success: "ending_bond", fail: "ritual_backlash" }
      },
      {
        text: "Break the relic",
        check: { stat: "Strength", dc: 14, success: "ending_break", fail: "ritual_backlash" }
      },
      {
        text: "Defile the relic for power",
        check: { stat: "Charisma", dc: 13, success: "ending_corrupt", fail: "ritual_backlash" }
      }
    ]
  },
  ritual_backlash: {
    id: "ritual_backlash",
    title: "Ritual Backlash",
    location: "Veyr Bell Tower",
    text: "The ritual tears at your skin and fills the tower with black ash.",
    choices: [
      { text: "Survive the backlash", consequences: { hp: -6, reputation: -1 }, next: "ending_walkaway_adv" }
    ]
  },
  relic_cast: {
    id: "relic_cast",
    title: "The Relic Falls",
    location: "Veyr Bell Tower",
    text: "You cast the relic into the city below. The impact cracks the street like a curse breaking.",
    choices: [
      {
        text: "Watch the omen",
        consequences: { reputation: 2, xp: 6, flag: "relic_cast_down", memory: { key: "relic_cast", text: "You destroyed the relic by throwing it from the tower." } },
        next: "ending_break"
      }
    ]
  },
  ending_mael: {
    id: "ending_mael",
    title: "Ending: Chapel Restored",
    location: "Ashen Chapel",
    text: "The relic returns to the altar and the dead recede. Sister Mael grants you a name spoken with reverence, not fear.",
    ending: true
  },
  ending_bond: {
    id: "ending_bond",
    title: "Ending: The Chapel Binds",
    location: "Veyr Bell Tower",
    text: "The relic is bound to the chapel. Its power is sealed, and the bell tolls cleanly across the ruin.",
    ending: true
  },
  ending_break: {
    id: "ending_break",
    title: "Ending: The Relic Broken",
    location: "Veyr Bell Tower",
    text: "The relic shatters. The chapel's curse loosens, but something ancient wakes in the dark beyond the city.",
    ending: true
  },
  ending_corrupt: {
    id: "ending_corrupt",
    title: "Ending: Ash in the Veins",
    location: "Veyr Bell Tower",
    text: "Power floods into you with a bitter taste. The relic is defiled, and the ruin now knows your name.",
    ending: true
  },
  ending_walkaway_adv: {
    id: "ending_walkaway_adv",
    title: "Ending: A Road of Cinders",
    location: "Veyr Bell Tower",
    text: "You leave the relic behind or the ritual unfinished. The city remains broken, but you survive with its secrets.",
    ending: true
  }
};

const SCENE_MAP = {
  intro: "scene-crossroads",
  road_hub: "scene-crossroads",
  priest_meeting: "scene-crossroads",
  mael_pay_success: "scene-crossroads",
  mael_pay_fail: "scene-crossroads",
  inn_hub: "scene-inn",
  inn_rumors: "scene-inn",
  inn_rumors_free: "scene-inn",
  woods_edge: "scene-woods",
  sir_halven: "scene-woods",
  woods_path: "scene-woods",
  shrine: "scene-woods",
  woods_lost: "scene-woods",
  ash_road: "scene-crossroads",
  lantern_choice: "scene-crossroads",
  rob_pilgrim: "scene-crossroads",
  pilgrim_curse: "scene-crossroads",
  hidden_watch: "scene-crossroads",
  bandit_ambush: "scene-crossroads",
  bandits_defeated: "scene-crossroads",
  bandits_hurt: "scene-crossroads",
  corpse_cart: "scene-crossroads",
  cart_success: "scene-crossroads",
  cart_ambush: "scene-crossroads",
  cart_fail: "scene-crossroads",
  chapel_gate: "scene-chapel",
  gate_fail: "scene-chapel",
  catacombs_entry: "scene-catacombs",
  catacombs_fail: "scene-catacombs",
  gate_open: "scene-catacombs",
  ending_relic: "scene-catacombs",
  ending_walkaway: "scene-catacombs",
  test_hub: "scene-crossroads",
  test_camp: "scene-crossroads",
  test_chest_success: "scene-crossroads",
  test_chest_fail: "scene-crossroads",
  test_trail: "scene-crossroads",
  test_sneak_success: "scene-crossroads",
  test_sneak_fail: "scene-crossroads",
  test_force_success: "scene-crossroads",
  test_force_fail: "scene-crossroads",
  test_hall: "scene-crossroads",
  test_sealed_fail: "scene-crossroads",
  test_reconnect: "scene-crossroads",
  chapel_gate_approach: "scene-chapel",
  chapel_warden: "scene-chapel",
  chapel_side_entrance: "scene-chapel",
  chapel_wardens_notice: "scene-chapel",
  chapel_inner: "scene-chapel",
  maels_request: "scene-chapel",
  maels_paid_deeper: "scene-chapel",
  mael_rebuke: "scene-chapel",
  ledger_secret: "scene-chapel",
  maels_warning: "scene-chapel",
  chapel_pews: "scene-chapel",
  chapel_courtyard: "scene-chapel",
  courtyard_shrine: "scene-chapel",
  crypt_entry: "scene-catacombs",
  chain_room: "scene-catacombs",
  chain_cut: "scene-catacombs",
  ossuary: "scene-catacombs",
  reliquary_open: "scene-catacombs",
  reliquary_trap: "scene-catacombs",
  whispered_truth: "scene-catacombs",
  crypt_guardian: "scene-catacombs",
  guardian_broken: "scene-catacombs",
  guardian_wounded: "scene-catacombs",
  mire_gate: "scene-catacombs",
  mire_secret: "scene-catacombs",
  mire_snare: "scene-catacombs",
  mire_shack: "scene-woods",
  witch_vessa: "scene-woods",
  shack_cache: "scene-woods",
  shack_burned: "scene-woods",
  shack_caught: "scene-woods",
  vessa_reveals: "scene-woods",
  mire_crossroads: "scene-woods",
  mire_depths: "scene-woods",
  mire_cache: "scene-woods",
  mire_sink: "scene-woods",
  bell_tower: "scene-chapel",
  tower_archive: "scene-chapel",
  tower_visitor: "scene-chapel",
  tower_fall: "scene-chapel",
  tower_top: "scene-chapel",
  return_mael: "scene-chapel",
  ritual_choice: "scene-chapel",
  ritual_backlash: "scene-chapel",
  relic_cast: "scene-chapel",
  ending_mael: "scene-chapel",
  ending_bond: "scene-chapel",
  ending_break: "scene-chapel",
  ending_corrupt: "scene-chapel",
  ending_walkaway_adv: "scene-chapel"
};

function validateStoryGraph() {
  const errors = [];
  const ids = new Set(Object.keys(STORY));

  for (const [id, ev] of Object.entries(STORY)) {
    if (!ev || ev.id !== id) errors.push(`Event key "${id}" has missing or mismatched id field.`);
    const choices = Array.isArray(ev.choices) ? ev.choices : [];
    for (const [index, choice] of choices.entries()) {
      const pathBase = `${id}.choices[${index}]`;
      if (choice.next && !ids.has(choice.next)) errors.push(`Broken destination: ${pathBase}.next -> "${choice.next}"`);
      if (choice.check) {
        if (choice.check.success && !ids.has(choice.check.success)) errors.push(`Broken destination: ${pathBase}.check.success -> "${choice.check.success}"`);
        if (choice.check.fail && !ids.has(choice.check.fail)) errors.push(`Broken destination: ${pathBase}.check.fail -> "${choice.check.fail}"`);
        if (choice.check.critSuccess && !ids.has(choice.check.critSuccess)) errors.push(`Broken destination: ${pathBase}.check.critSuccess -> "${choice.check.critSuccess}"`);
        if (choice.check.critFailure && !ids.has(choice.check.critFailure)) errors.push(`Broken destination: ${pathBase}.check.critFailure -> "${choice.check.critFailure}"`);
      }
      if (choice.successConsequences?.next && !ids.has(choice.successConsequences.next)) errors.push(`Broken destination: ${pathBase}.successConsequences.next -> "${choice.successConsequences.next}"`);
      if (choice.failureConsequences?.next && !ids.has(choice.failureConsequences.next)) errors.push(`Broken destination: ${pathBase}.failureConsequences.next -> "${choice.failureConsequences.next}"`);
    }
  }

  const inbound = new Map([...ids].map((k) => [k, 0]));
  for (const ev of Object.values(STORY)) {
    for (const choice of ev.choices || []) {
      const mark = (dest) => { if (dest && inbound.has(dest)) inbound.set(dest, inbound.get(dest) + 1); };
      mark(choice.next);
      mark(choice.successConsequences?.next);
      mark(choice.failureConsequences?.next);
      mark(choice.check?.success);
      mark(choice.check?.fail);
      mark(choice.check?.critSuccess);
      mark(choice.check?.critFailure);
    }
  }

  if (errors.length) {
    console.error("[Ruinfall] Story validation errors:");
    errors.forEach((err) => console.error(" - " + err));
  } else {
    console.info("[Ruinfall] Story validation passed:", Object.keys(STORY).length, "events");
  }

  const unreachable = [...inbound.entries()].filter(([id, count]) => count === 0 && id !== "intro");
  if (unreachable.length) {
    console.warn("[Ruinfall] Potentially unreachable events:", unreachable.map(([id]) => id));
  }

  return { errors, unreachable };
}

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
  if (Array.isArray(req.flags) && !req.flags.every(hasFlag)) return false;
  if (Array.isArray(req.anyFlags) && !req.anyFlags.some(hasFlag)) return false;
  if (Array.isArray(req.notFlags) && req.notFlags.some(hasFlag)) return false;
  if (req.memory && !hasMemory(req.memory)) return false;
  if (req.item && !state.inventory.includes(req.item)) return false;
  if (Array.isArray(req.items) && !req.items.every((item) => state.inventory.includes(item))) return false;
  if (Array.isArray(req.anyItem) && !req.anyItem.some((item) => state.inventory.includes(item))) return false;
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
  if (!state.inventory.includes(name)) {
    state.inventory.push(name);
    notify(`Item gained: ${name}`);
  }
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
  if (Array.isArray(cons.flags)) cons.flags.forEach(addFlag);
  if (cons.memory) addMemory(cons.memory.key, cons.memory.text);
  if (cons.relation) changeRelation(cons.relation.npc, cons.relation.delta);
  if (cons.quest) changeQuest(cons.quest);
  if (cons.item) addItem(cons.item);
  if (Array.isArray(cons.items)) cons.items.forEach(addItem);
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
  console.warn(`[Ruinfall] Attempted to show missing event: "${id}"`);
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

  if (criticalSuccess && choice.check.critSuccess) {
    if (choice.critSuccessConsequences) applyConsequences(choice.critSuccessConsequences);
    showEvent(choice.check.critSuccess);
    addLog("Critical success.");
  } else if (criticalFailure && choice.check.critFailure) {
    if (choice.critFailureConsequences) applyConsequences(choice.critFailureConsequences);
    showEvent(choice.check.critFailure);
    addLog("Critical failure.");
  } else if (success) {
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

function getSceneClass(eventId, locationText) {
  if (SCENE_MAP[eventId]) return SCENE_MAP[eventId];
  const loc = (locationText || "").toLowerCase();
  if (loc.includes("chapel") || loc.includes("catacomb")) return "scene-chapel";
  if (loc.includes("forest") || loc.includes("woods")) return "scene-woods";
  if (loc.includes("inn")) return "scene-inn";
  return "scene-crossroads";
}

function renderScene(ev) {
  const scene = document.getElementById("sceneBackground");
  if (!scene) return;
  scene.className = `scene-background ${getSceneClass(ev.id, ev.location)}`;
}

function render() {
  const ev = STORY[state.currentEventId] || STORY.intro;
  renderScene(ev);

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
  merged.flags = Array.isArray(loaded.flags) ? loaded.flags.filter((flag) => typeof flag === "string" && flag.length > 0) : [];
  merged.memories = Array.isArray(loaded.memories) ? loaded.memories.filter((m) => m && typeof m.key === "string" && m.key.length > 0) : [];
  merged.inventory = Array.isArray(loaded.inventory) ? loaded.inventory.filter((item) => typeof item === "string" && item.length > 0) : ["Ragged Blade"];
  if (!merged.inventory.length) merged.inventory = ["Ragged Blade"];
  merged.notifications = Array.isArray(loaded.notifications) ? loaded.notifications.filter((n) => typeof n === "string" && n.length > 0) : [];
  merged.log = Array.isArray(loaded.log) ? loaded.log.filter((entry) => typeof entry === "string" && entry.length > 0) : ["Game loaded."];
  merged.lastRoll = typeof loaded.lastRoll === "string" ? loaded.lastRoll : "";
  merged.currentEventId = STORY[loaded.currentEventId] ? loaded.currentEventId : "intro";

  merged.maxHp = Number.isFinite(loaded.maxHp) ? Math.max(1, loaded.maxHp) : base.maxHp;
  merged.hp = Number.isFinite(loaded.hp) ? Math.max(0, Math.min(merged.maxHp, loaded.hp)) : base.hp;
  merged.gold = Number.isFinite(loaded.gold) ? Math.max(0, loaded.gold) : base.gold;
  merged.level = Number.isFinite(loaded.level) ? Math.max(1, loaded.level) : base.level;
  merged.xp = Number.isFinite(loaded.xp) ? Math.max(0, loaded.xp) : base.xp;
  merged.xpToNext = Number.isFinite(loaded.xpToNext) ? Math.max(5, loaded.xpToNext) : base.xpToNext;
  merged.reputation = Number.isFinite(loaded.reputation) ? loaded.reputation : base.reputation;
  merged.statusEffects = Array.isArray(loaded.statusEffects) ? loaded.statusEffects : [];

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

validateStoryGraph();

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
