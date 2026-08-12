(function () {
  "use strict";

  const STYLE_ID = "tactical-enhancement-styles";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      :root {
        --nerial-black: #050709;
        --nerial-deep: #0b0f11;
        --nerial-steel: #252d31;
        --nerial-iron: #b8b9ae;
        --nerial-ash: #e0ded0;
        --nerial-red: #8e3934;
        --nerial-red-bright: #d15d4d;
        --nerial-rust: #71352e;
        --nerial-grid: rgba(185,190,177,.18);
        --nerial-damage: #f0c2a8;
      }

      .combat-shell {
        position: relative;
        width: min(100%, 94rem);
        margin: auto;
        isolation: isolate;
      }

      .combat-shell::before {
        position: absolute;
        z-index: -1;
        inset: -1rem;
        content: "";
        border: 1px solid rgba(185,190,177,.08);
        background:
          linear-gradient(rgba(185,190,177,.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(185,190,177,.035) 1px, transparent 1px);
        background-size: 2rem 2rem;
        pointer-events: none;
      }

      .combat-header {
        position: relative;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--nerial-grid);
      }

      .combat-header::after {
        position: absolute;
        right: 0;
        bottom: -1px;
        width: 28%;
        height: 2px;
        content: "";
        background: var(--nerial-red-bright);
      }

      .combat-header h2 {
        color: var(--nerial-ash);
        text-shadow: 3px 3px 0 rgba(0,0,0,.65);
        letter-spacing: .09em;
      }

      .combat-turn {
        padding: .55rem .8rem;
        border-left: 2px solid var(--nerial-red-bright);
        color: var(--nerial-red-bright);
        background: rgba(8,10,12,.78);
        font-size: .7rem;
        letter-spacing: .14em;
      }

      .tactical-progress {
        display: grid;
        gap: .7rem;
        margin: 0 0 1rem;
        padding: .9rem 1rem;
        border: 1px solid var(--nerial-grid);
        background: linear-gradient(135deg,rgba(36,42,45,.92),rgba(5,7,9,.9));
        clip-path: polygon(0 0,99% 0,100% 18%,100% 100%,1% 100%,0 82%);
      }

      .tactical-progress-title {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        color: var(--nerial-ash);
        font-size: .7rem;
        font-weight: bold;
        letter-spacing: .14em;
      }

      .tactical-progress-title span:last-child {
        color: var(--nerial-red-bright);
      }

      .tactical-progress-steps {
        display: flex;
        flex-wrap: wrap;
        gap: .35rem;
      }

      .tactical-progress-step {
        padding: .35rem .5rem;
        border: 1px solid var(--nerial-grid);
        color: #707775;
        background: rgba(0,0,0,.25);
        font-size: .6rem;
        letter-spacing: .08em;
      }

      .tactical-progress-step.active {
        border-color: var(--nerial-red-bright);
        color: white;
        background: rgba(169,71,62,.28);
        box-shadow: inset 2px 0 var(--nerial-red-bright);
      }

      .combat-board-panel,
      .combat-side-panel,
      .combat-log-panel {
        position: relative;
        border-color: var(--nerial-grid);
        background: linear-gradient(135deg,rgba(28,34,38,.96),rgba(6,9,11,.94));
        clip-path: polygon(0 0,98% 0,100% 4%,100% 100%,2% 100%,0 96%);
      }

      .combat-board-panel::before,
      .combat-side-panel::before,
      .combat-log-panel::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 4rem;
        height: 2px;
        content: "";
        background: var(--nerial-red);
      }

      .combat-board {
        position: relative;
        padding: .4rem;
        border: 1px solid rgba(185,190,177,.12);
        background:
          linear-gradient(rgba(185,190,177,.045) 1px, transparent 1px),
          linear-gradient(90deg,rgba(185,190,177,.045) 1px, transparent 1px),
          #080b0d;
        background-size: 2rem 2rem;
      }

      .combat-cell {
        position: relative;
        overflow: visible;
        border: 1px solid var(--nerial-grid);
        background: linear-gradient(135deg,rgba(33,40,43,.7),rgba(5,8,10,.94));
        transition: background .16s ease,border-color .16s ease,box-shadow .16s ease;
      }

      .combat-cell::before {
        position: absolute;
        top: .25rem;
        left: .3rem;
        width: .35rem;
        height: .35rem;
        content: "";
        border-top: 1px solid rgba(185,190,177,.32);
        border-left: 1px solid rgba(185,190,177,.32);
        pointer-events: none;
      }

      .combat-cell:hover {
        border-color: rgba(209,93,77,.72);
      }

      .combat-cell.cover {
        background: linear-gradient(135deg,rgba(92,86,75,.72),rgba(27,31,32,.95));
        box-shadow: inset 0 0 0 2px rgba(113,53,46,.65);
      }

      .combat-cell.move-target {
        border-color: rgba(184,185,174,.75);
        background: linear-gradient(135deg,rgba(169,71,62,.3),rgba(70,53,49,.22));
        box-shadow: inset 0 0 0 1px rgba(209,93,77,.45);
      }

      .combat-cell.attack-target {
        border-color: var(--nerial-red-bright);
        background: radial-gradient(circle,rgba(190,61,48,.38),transparent 68%),rgba(65,25,23,.72);
        box-shadow: inset 0 0 0 2px rgba(209,93,77,.35);
      }

      .combat-cell.selected-cell {
        outline: 1px solid var(--nerial-ash);
        outline-offset: -3px;
        box-shadow: inset 0 0 0 2px var(--nerial-red-bright),
          0 0 1rem rgba(209,93,77,.32);
      }

      /*
       * NERIAL TACTICAL UNITS
       */

      .unit-marker {
        position: absolute;
        inset: 8%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        min-width: 2.3rem;
        min-height: 2.5rem;
        border: 1px solid var(--nerial-iron);
        background: #111719;
        color: var(--nerial-ash);
        font-size: .52rem;
        font-weight: bold;
        line-height: 1;
        animation: nerial-breathe 3.4s ease-in-out infinite;
      }

      .unit-marker::before {
        position: absolute;
        top: 9%;
        left: 31%;
        width: 38%;
        height: 27%;
        content: "";
        border: 1px solid var(--nerial-iron);
        background: #303838;
        clip-path: polygon(18% 0,82% 0,100% 35%,80% 100%,20% 100%,0 35%);
      }

      .unit-marker::after {
        position: absolute;
        right: -20%;
        bottom: 34%;
        width: 48%;
        height: 8%;
        content: "";
        background: currentColor;
        transform: rotate(-24deg);
        transform-origin: left center;
      }

      .unit-marker.enemy {
        border-color: var(--nerial-red-bright);
        background: linear-gradient(155deg,#743a32 0 14%,#3e1d1b 15% 72%,#160d0c 73%);
        color: #e0705c;
      }

      .unit-marker.selected-unit {
        filter: drop-shadow(0 0 .55rem rgba(209,93,77,.8));
        animation: nerial-selected 1.6s ease-in-out infinite;
      }

      .unit-marker.incapacitated,
      .unit-marker.dead {
        opacity: .32;
        filter: grayscale(1);
        transform: rotate(8deg) translateY(.2rem);
        animation: none;
      }

      .unit-label {
        position: relative;
        z-index: 1;
        max-width: 90%;
        overflow: hidden;
        color: white;
        font-size: .53rem;
        letter-spacing: .04em;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .unit-hp {
        position: absolute;
        right: 10%;
        bottom: 8%;
        left: 10%;
        height: 3px;
        background: #090b0c;
      }

      .unit-hp i {
        display: block;
        height: 100%;
        background: #a6b870;
      }

      .enemy .unit-hp i {
        background: var(--nerial-red-bright);
      }

      .unit-status {
        position: absolute;
        right: -1px;
        bottom: -1px;
        padding: 1px 3px;
        color: var(--nerial-ash);
        background: rgba(0,0,0,.82);
        font-size: .43rem;
      }

      .combat-controls {
        padding-top: .8rem;
        border-top: 1px solid var(--nerial-grid);
      }

      .combat-control {
        border-color: var(--nerial-grid);
        background: #101518;
        color: var(--nerial-iron);
        clip-path: polygon(0 0,94% 0,100% 20%,100% 100%,6% 100%,0 80%);
      }

      .combat-control:hover:not(:disabled),
      .combat-control.active {
        border-color: var(--nerial-red-bright);
        color: white;
        background: rgba(169,71,62,.42);
        box-shadow: inset 3px 0 var(--nerial-red-bright);
      }

      /*
       * SQUAD CARDS
       */

      .companion-card {
        position: relative;
        min-height: 25rem;
        overflow: hidden;
        padding: 1rem;
        background: linear-gradient(135deg,rgba(27,34,39,.97),rgba(5,8,10,.96));
        transition: border-color .2s ease,box-shadow .2s ease,transform .2s ease;
      }

      .companion-card::before {
        position: absolute;
        top: 0;
        right: 0;
        width: 42%;
        height: 2px;
        content: "";
        background: var(--nerial-red);
      }

      .companion-card:hover,
      .companion-card:focus-visible,
      .companion-card.selected {
        border-color: var(--nerial-red-bright);
        box-shadow: inset 0 0 0 1px rgba(209,93,77,.38),
          0 1rem 2rem rgba(0,0,0,.35);
        outline: none;
        transform: translateY(-3px);
      }

      .companion-card.incapacitated {
        filter: brightness(.58) grayscale(.4);
      }

      .companion-card.damaged {
        animation: card-damage .3s ease-out;
      }

      .companion-visual {
        position: relative;
        width: 100%;
        height: 15rem;
        margin: -.2rem 0 1rem;
        overflow: hidden;
        border-bottom: 1px solid var(--nerial-grid);
        background:
          linear-gradient(rgba(185,190,177,.035) 1px,transparent 1px),
          linear-gradient(90deg,rgba(185,190,177,.035) 1px,transparent 1px),
          radial-gradient(ellipse at 50% 92%,rgba(169,71,62,.2),transparent 62%),
          #080b0d;
        background-size: 1rem 1rem,1rem 1rem,auto,auto;
        clip-path: polygon(0 0,98% 0,100% 8%,100% 100%,2% 100%,0 92%);
      }

      .companion-visual::before {
        position: absolute;
        top: .55rem;
        left: .7rem;
        content: "PERSONNEL // VISUAL ID";
        color: rgba(224,222,208,.48);
        font-size: .5rem;
        letter-spacing: .13em;
      }

      /*
       * The old mannequin is intentionally not used.
       * These are separate layered silhouettes for each warrior.
       */

      .character-visual {
        position: absolute;
        inset: 1.7rem 8% 0;
        isolation: isolate;
        filter: drop-shadow(.5rem .7rem .3rem rgba(0,0,0,.78));
        transform-origin: 50% 100%;
        animation: character-idle 3.8s ease-in-out infinite;
      }

      .character-visual span {
        position: absolute;
        display: block;
      }

      .character-shadow {
        z-index: -1;
        right: 6%;
        bottom: .2rem;
        left: 6%;
        height: 1rem;
        border-radius: 50%;
        background: rgba(0,0,0,.82);
        filter: blur(5px);
      }

      .character-cloak {
        z-index: 1;
        bottom: 0;
        left: 18%;
        width: 64%;
        height: 48%;
        background: linear-gradient(90deg,#0b0f10,#3b4240 48%,#111617);
        clip-path: polygon(20% 0,80% 0,100% 100%,0 100%);
      }

      .character-head {
        z-index: 8;
        top: 3%;
        left: 34%;
        width: 32%;
        height: 24%;
        border: 1px solid #aeb1a5;
        background: linear-gradient(145deg,#777d78,#202729 65%,#0d1012);
        clip-path: polygon(24% 0,76% 0,100% 38%,84% 100%,16% 100%,0 38%);
      }

      .character-face {
        z-index: 9;
        top: 14%;
        left: 40%;
        width: 20%;
        height: 8%;
        background: #090c0d;
        border-top: 2px solid var(--nerial-red-bright);
        opacity: .9;
      }

      .character-helmet {
        z-index: 10;
        top: 0;
        left: 25%;
        width: 50%;
        height: 13%;
        border: 1px solid #9a9e94;
        background: #252c2e;
        clip-path: polygon(18% 0,82% 0,100% 100%,0 100%);
      }

      .character-neck {
        z-index: 6;
        top: 23%;
        left: 41%;
        width: 18%;
        height: 10%;
        background: #171d1e;
      }

      .character-torso {
        z-index: 4;
        top: 25%;
        left: 25%;
        width: 50%;
        height: 50%;
        background: #1b2224;
      }

      .character-chest-armor {
        z-index: 7;
        top: 27%;
        left: 29%;
        width: 42%;
        height: 35%;
        border: 1px solid #858d87;
        background:
          linear-gradient(135deg,rgba(224,222,208,.2),transparent 30%),
          linear-gradient(160deg,#5b6561,#20282a 58%,#0d1112);
        clip-path: polygon(17% 0,83% 0,100% 22%,82% 100%,18% 100%,0 22%);
      }

      .character-chest-armor::after {
        top: 16%;
        left: 47%;
        width: 7%;
        height: 65%;
        content: "";
        background: var(--nerial-red);
        clip-path: polygon(50% 0,100% 20%,68% 100%,32% 100%,0 20%);
      }

      .character-shoulder-left,
      .character-shoulder-right {
        z-index: 8;
        top: 27%;
        width: 35%;
        height: 26%;
        border: 1px solid #8e958d;
        background: linear-gradient(145deg,#636b66,#20282a 70%);
      }

      .character-shoulder-left {
        left: 0;
        transform: rotate(-13deg);
        clip-path: polygon(12% 0,100% 12%,84% 100%,0 78%);
      }

      .character-shoulder-right {
        right: 0;
        transform: rotate(13deg);
        clip-path: polygon(0 12%,88% 0,100% 78%,16% 100%);
      }

      .character-arm-left,
      .character-arm-right {
        z-index: 3;
        top: 45%;
        width: 15%;
        height: 37%;
        border: 1px solid #727b76;
        background: linear-gradient(#3d4745,#151b1d);
      }

      .character-arm-left {
        left: 11%;
        transform: rotate(8deg);
      }

      .character-arm-right {
        right: 11%;
        transform: rotate(-8deg);
      }

      .character-forearm {
        z-index: 9;
        top: 64%;
        left: 8%;
        width: 18%;
        height: 10%;
        border: 1px solid #999e94;
        background: #414b49;
        transform: rotate(8deg);
      }

      .character-belt {
        z-index: 10;
        top: 68%;
        left: 18%;
        width: 64%;
        height: 8%;
        border-top: 2px solid #8d8172;
        border-bottom: 1px solid #352925;
        background: #292b28;
      }

      .character-leg-left,
      .character-leg-right {
        z-index: 2;
        bottom: 5%;
        width: 19%;
        height: 34%;
        border: 1px solid #727a74;
        background: linear-gradient(135deg,#343e3d,#101516);
      }

      .character-leg-left {
        left: 27%;
        transform: skewX(4deg);
      }

      .character-leg-right {
        right: 27%;
        transform: skewX(-4deg);
      }

      .character-boot {
        z-index: 5;
        bottom: 0;
        width: 28%;
        height: 12%;
        border: 1px solid #94998e;
        background: #171d1e;
      }

      .character-boot.left {
        left: 18%;
        transform: skewX(-12deg);
      }

      .character-boot.right {
        right: 18%;
        transform: skewX(12deg);
      }

      .character-weapon {
        z-index: 12;
        right: -2%;
        top: 38%;
        width: 8%;
        height: 61%;
        background: #9c9e93;
        box-shadow: 0 0 0 2px #171b1c;
        transform: rotate(18deg);
        transform-origin: top center;
        animation: weapon-sway 3.8s ease-in-out infinite;
      }

      .character-equipment {
        z-index: 11;
        right: -1%;
        top: 39%;
        width: 17%;
        height: 26%;
        border: 1px solid var(--nerial-rust);
        background: repeating-linear-gradient(0deg,#20282a 0 8px,#3c4543 9px 12px);
      }

      .character-tribal-mark {
        z-index: 14;
        top: 38%;
        left: 44%;
        width: 12%;
        height: 15%;
        background: var(--nerial-red-bright);
        clip-path: polygon(50% 0,100% 25%,68% 100%,32% 100%,0 25%);
        opacity: .85;
      }

      /* Rakkar: broad, armored and axe-bearing */

      .nerial-rakkar {
        inset-inline: 1%;
      }

      .nerial-rakkar .character-head {
        left: 31%;
        width: 38%;
        height: 23%;
      }

      .nerial-rakkar .character-helmet {
        left: 18%;
        width: 64%;
        height: 14%;
        background: linear-gradient(90deg,#303a39,#737b73 50%,#252b2b);
      }

      .nerial-rakkar .character-torso {
        left: 10%;
        width: 80%;
        height: 52%;
      }

      .nerial-rakkar .character-chest-armor {
        left: 17%;
        width: 66%;
        height: 39%;
        background: linear-gradient(145deg,#737a70,#303836 48%,#111617);
      }

      .nerial-rakkar .character-shoulder-left,
      .nerial-rakkar .character-shoulder-right {
        width: 48%;
        height: 32%;
      }

      .nerial-rakkar .character-arm-left,
      .nerial-rakkar .character-arm-right {
        width: 22%;
        height: 43%;
      }

      .nerial-rakkar .character-forearm {
        width: 25%;
        height: 13%;
      }

      .nerial-rakkar .character-leg-left,
      .nerial-rakkar .character-leg-right {
        width: 25%;
        height: 37%;
      }

      .nerial-rakkar .character-boot {
        width: 34%;
        height: 14%;
      }

      .nerial-rakkar .character-weapon {
        right: -7%;
        top: 31%;
        width: 19%;
        height: 69%;
        background: linear-gradient(90deg,#472b27 0 34%,#aeb0a5 35% 52%,#70352e 53%);
        transform: rotate(21deg);
      }

      .nerial-rakkar .character-weapon::after {
        position: absolute;
        top: -12%;
        left: -70%;
        width: 180%;
        height: 22%;
        content: "";
        border: 2px solid #aeb0a5;
        background: #4a2925;
        clip-path: polygon(10% 50%,30% 0,100% 0,82% 100%,30% 100%);
      }

      .nerial-rakkar .character-cloak {
        left: 5%;
        width: 90%;
        height: 42%;
        background: linear-gradient(90deg,#15191a,#4a4138 50%,#111516);
      }

      /* Sera: narrow, hooded and agile */

      .nerial-sera {
        inset-inline: 18%;
      }

      .nerial-sera .character-head {
        top: 5%;
        left: 28%;
        width: 44%;
        height: 24%;
        background: #161c1e;
        clip-path: polygon(50% 0,100% 35%,84% 100%,16% 100%,0 35%);
      }

      .nerial-sera .character-helmet {
        top: 0;
        left: 8%;
        width: 84%;
        height: 20%;
        background: #202829;
        clip-path: polygon(10% 0,90% 0,100% 100%,0 100%);
      }

      .nerial-sera .character-face {
        left: 34%;
        width: 32%;
        background: #050708;
      }

      .nerial-sera .character-torso {
        left: 29%;
        width: 42%;
        height: 46%;
      }

      .nerial-sera .character-chest-armor {
        left: 31%;
        width: 38%;
        height: 31%;
        background: linear-gradient(145deg,#68706b,#242d2e 70%);
      }

      .nerial-sera .character-shoulder-left,
      .nerial-sera .character-shoulder-right {
        width: 28%;
        height: 19%;
      }

      .nerial-sera .character-cloak {
        bottom: 0;
        left: -3%;
        width: 106%;
        height: 60%;
        background: linear-gradient(90deg,#0c1112,#4a504b 50%,#0e1314);
        clip-path: polygon(20% 0,80% 0,100% 100%,0 100%);
      }

      .nerial-sera .character-weapon {
        right: -8%;
        top: 39%;
        width: 6%;
        height: 54%;
        background: #aaa99a;
        transform: rotate(9deg);
      }

      .nerial-sera .character-weapon::after {
        position: absolute;
        top: -3%;
        left: -220%;
        width: 420%;
        height: 5%;
        content: "";
        background: var(--nerial-iron);
        transform: rotate(-18deg);
      }

      .nerial-sera .character-forearm {
        left: 5%;
        width: 20%;
        background: #4d5752;
      }

      .nerial-sera .character-tribal-mark {
        display: none;
      }

      /* Varn: technical harness, pack and drone */

      .nerial-varn {
        inset-inline: 8%;
      }

      .nerial-varn .character-head {
        left: 35%;
        width: 30%;
        height: 22%;
      }

      .nerial-varn .character-helmet {
        left: 25%;
        width: 50%;
        height: 14%;
      }

      .nerial-varn .character-torso {
        left: 22%;
        width: 56%;
        height: 49%;
      }

      .nerial-varn .character-chest-armor {
        left: 25%;
        width: 50%;
        height: 34%;
        background: repeating-linear-gradient(0deg,#303a3b 0 10px,#555d58 11px 14px);
      }

      .nerial-varn .character-shoulder-left,
      .nerial-varn .character-shoulder-right {
        width: 32%;
        height: 22%;
      }

      .nerial-varn .character-equipment {
        right: -5%;
        top: 27%;
        width: 32%;
        height: 53%;
        border-color: #9a9e93;
      }

      .nerial-varn .character-equipment::before,
      .nerial-varn .character-equipment::after {
        position: absolute;
        content: "";
        background: var(--nerial-red-bright);
      }

      .nerial-varn .character-equipment::before {
        top: 35%;
        right: -55%;
        width: 55%;
        height: 2px;
        box-shadow: 0 7px #8b8d82,0 -7px #8b8d82;
      }

      .nerial-varn .character-equipment::after {
        right: -3rem;
        top: -1.5rem;
        width: 1.8rem;
        height: 1.8rem;
        border: 1px solid var(--nerial-red-bright);
        border-radius: 50%;
        background: rgba(142,57,52,.18);
        box-shadow: 0 0 0 4px rgba(142,57,52,.08);
        animation: drone-hover 2.2s ease-in-out infinite;
      }

      .nerial-varn .character-weapon {
        right: -2%;
        top: 43%;
        width: 11%;
        height: 42%;
        background: #a9aaa0;
        transform: rotate(12deg);
      }

      .nerial-varn .character-cloak {
        left: 13%;
        width: 74%;
        height: 42%;
        background: linear-gradient(90deg,#151a1b,#353e3d,#15191a);
      }

      .character-readout {
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: .35rem;
        clear: both;
        margin-top: .7rem;
        padding-top: .7rem;
        border-top: 1px solid var(--nerial-grid);
        color: #777d7b;
        font-size: .57rem;
        letter-spacing: .08em;
      }

      .character-readout strong {
        display: block;
        margin-top: .15rem;
        color: var(--nerial-ash);
        font-size: .72rem;
      }

      .companion-card {
        position: relative;
        min-height: 25rem;
        overflow: hidden;
        padding: 1rem;
        background: linear-gradient(135deg,rgba(27,34,39,.97),rgba(5,8,10,.96));
        transition: border-color .2s ease,box-shadow .2s ease,transform .2s ease;
      }

      .companion-card::before {
        position: absolute;
        top: 0;
        right: 0;
        width: 42%;
        height: 2px;
        content: "";
        background: var(--nerial-red);
      }

      .companion-card:hover,
      .companion-card:focus-visible,
      .companion-card.selected {
        border-color: var(--nerial-red-bright);
        box-shadow: inset 0 0 0 1px rgba(209,93,77,.38),
          0 1rem 2rem rgba(0,0,0,.35);
        outline: none;
        transform: translateY(-3px);
      }

      .companion-card.incapacitated {
        filter: brightness(.58) grayscale(.4);
      }

      .companion-card.damaged {
        animation: card-damage .3s ease-out;
      }

      @keyframes character-idle {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      @keyframes weapon-sway {
        0%,100% { margin-top: 0; }
        50% { margin-top: 2px; }
      }

      @keyframes drone-hover {
        0%,100% { transform: translate(0,0); opacity: .45; }
        50% { transform: translate(-3px,-5px); opacity: 1; }
      }

      @keyframes nerial-breathe {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      @keyframes nerial-selected {
        0%,100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-2px) scale(1.04); }
      }

      @keyframes card-damage {
        0%,100% { filter: none; }
        35% { filter: brightness(1.8) sepia(.3); }
      }

      @media (max-width: 800px) {
        .combat-board-panel {
          overflow-x: auto;
        }

        .combat-board {
          min-width: 34rem;
        }

        .combat-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 600px) {
        .tactical-progress-title {
          flex-direction: column;
          gap: .35rem;
        }

        .tactical-progress-step {
          flex: 1 1 auto;
          text-align: center;
        }

        .companion-visual {
          height: 13rem;
        }

        .companion-card {
          min-height: 23rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .character-visual,
        .character-weapon,
        .nerial-varn .character-equipment::after,
        .unit-marker {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function getUnitClass(name, side) {
    const value = String(name || "").toLowerCase();

    if (side === "enemy") return "enemy";
    if (value.includes("rakkar")) return "rakkar";
    if (value.includes("sera")) return "sera";
    if (value.includes("varn")) return "varn";
    return "commander";
  }

  function createPortrait(type, enemy = false) {
    const visualType = enemy ? "enemy" : type;
    const visual = document.createElement("div");

    visual.className = `character-visual nerial-${visualType}`;
    visual.setAttribute("aria-hidden", "true");

    visual.innerHTML = `
      <span class="character-shadow"></span>
      <span class="character-cloak"></span>
      <span class="character-leg-left"></span>
      <span class="character-leg-right"></span>
      <span class="character-boot left"></span>
      <span class="character-boot right"></span>
      <span class="character-torso"></span>
      <span class="character-chest-armor"></span>
      <span class="character-shoulder-left"></span>
      <span class="character-shoulder-right"></span>
      <span class="character-arm-left"></span>
      <span class="character-arm-right"></span>
      <span class="character-forearm"></span>
      <span class="character-belt"></span>
      <span class="character-neck"></span>
      <span class="character-head"></span>
      <span class="character-face"></span>
      <span class="character-helmet"></span>
      <span class="character-equipment"></span>
      <span class="character-weapon"></span>
      <span class="character-tribal-mark"></span>
    `;

    if (enemy) {
      visual.classList.add("nerial-rakkar");
      visual.setAttribute("data-faction", "hostile");
    }

    return visual;
  }

  function addMissionProgress() {
    const layout = document.querySelector(".combat-layout");

    if (!layout || document.querySelector(".tactical-progress")) return;

    const progress = document.createElement("section");
    progress.className = "tactical-progress";
    progress.setAttribute("aria-label", "Mission progress");

    progress.innerHTML = `
      <div class="tactical-progress-title">
        <span>MISSION 001 // THE SILENT SETTLEMENT</span>
        <span>OBJECTIVE: SURVIVE</span>
      </div>
      <div class="tactical-progress-steps">
        ${["ARRIVE", "INVESTIGATE", "ENTER KHAROS", "SURVIVE", "DESCEND"]
          .map((step, index) => `
            <span class="tactical-progress-step ${index === 3 ? "active" : ""}">
              ${String(index + 1).padStart(2, "0")} // ${step}
            </span>
          `).join("")}
      </div>
    `;

    layout.parentNode.insertBefore(progress, layout);
  }

  function decorateUnits() {
    document.querySelectorAll(".combat-cell").forEach((cell) => {
      const marker = cell.querySelector(".unit-marker");
      if (!marker) return;

      const enemy = marker.classList.contains("enemy");
      const label = marker.querySelector(".unit-label");

      if (!label) {
        const text = marker.childNodes[0]?.textContent?.trim() || "UNIT";
        const healthBar = marker.querySelector(".unit-hp");
        const healthHTML = healthBar
          ? healthBar.outerHTML
          : `<span class="unit-hp"><i style="width:100%"></i></span>`;

        marker.innerHTML = `
          <span class="unit-label">${text}</span>
          ${healthHTML}
          <span class="unit-status">${enemy ? "HOSTILE" : "ACTIVE"}</span>
        `;
      }

      const name = marker.querySelector(".unit-label")?.textContent || "UNIT";
      const type = getUnitClass(name, enemy ? "enemy" : "player");

      marker.classList.add(`unit-${type}`);
      marker.classList.toggle(
        "selected-unit",
        cell.classList.contains("selected-cell")
      );

      marker.setAttribute(
        "aria-label",
        `${name} ${enemy ? "hostile" : "Nerial unit"}`
      );
    });
  }

  function decorateSquadCards() {
    document.querySelectorAll("[data-companion]").forEach((card) => {
      const name = card.querySelector("h3")?.textContent || "";
      const type = getUnitClass(name, "player");

      card.classList.add(`card-${type}`);

      const member = typeof gameState !== "undefined"
        ? gameState.squad.find((item) => item.id === card.dataset.companion)
        : null;

      if (member) {
        const status = String(member.status || "ACTIVE").toLowerCase();

        card.classList.toggle(
          "incapacitated",
          status.includes("incapacitated") || status.includes("down")
        );

        card.classList.toggle(
          "damaged",
          Array.isArray(member.injuries) && member.injuries.length > 0
        );
      }

      const existingVisual = card.querySelector(".companion-visual");

      if (!existingVisual) {
        const visual = document.createElement("div");
        visual.className = "companion-visual";
        visual.appendChild(createPortrait(type));
        card.prepend(visual);
      } else if (!existingVisual.querySelector(".character-visual")) {
        existingVisual.replaceChildren(createPortrait(type));
      }

      if (member && !card.querySelector(".character-readout")) {
        const stats = member.derivedStats || {};
        const readout = document.createElement("div");

        readout.className = "character-readout";
        readout.innerHTML = `
          <span>HP<strong>${stats.Health || "—"}</strong></span>
          <span>ARMOR<strong>${member.armor || "—"}</strong></span>
          <span>STATUS<strong>${member.status || "ACTIVE"}</strong></span>
        `;

        card.appendChild(readout);
      }
    });
  }

  function enhanceCombatRender() {
    addMissionProgress();
    decorateUnits();
  }

  const originalRenderCombat = window.renderCombat;

  if (
    typeof originalRenderCombat === "function" &&
    !originalRenderCombat.__nerialEnhanced
  ) {
    const enhancedRenderCombat = function () {
      originalRenderCombat.apply(this, arguments);
      enhanceCombatRender();
    };

    enhancedRenderCombat.__nerialEnhanced = true;
    window.renderCombat = enhancedRenderCombat;
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector(".combat-layout")) {
      enhanceCombatRender();
    }

    if (document.querySelector(".squad-roster")) {
      decorateSquadCards();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  decorateSquadCards();
})();
