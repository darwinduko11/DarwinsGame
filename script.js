@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&display=swap");

:root{
  --bg:#07070b;
  --bg-2:#12111a;
  --panel:#12121bcc;
  --panel-2:#171724e6;
  --panel-border:#4b3d58;
  --panel-glow:rgba(200,168,107,.18);
  --text:#efe7db;
  --muted:#b8aa99;
  --accent:#d5b06d;
  --accent-2:#8f6b3f;
  --danger:#d56d6d;
  --success:#79d39a;
  --shadow:0 20px 50px rgba(0,0,0,.45);
}

*{box-sizing:border-box}

html, body{min-height:100%}

body{
  margin:0;
  color:var(--text);
  font-family:"IM Fell English", Georgia, "Times New Roman", serif;
  background:
    radial-gradient(circle at 20% 0%, rgba(105,74,125,.16), transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(203,140,70,.10), transparent 28%),
    linear-gradient(180deg, var(--bg-2) 0%, #09090d 45%, #050507 100%);
  overflow-x:hidden;
}

.background{
  position:fixed;
  inset:0;
  background:
    linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.72)),
    url("https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80") center/cover no-repeat;
  opacity:.14;
  pointer-events:none;
  filter:sepia(.18) contrast(1.05) saturate(.9);
}

.ambient{
  position:fixed;
  inset:auto;
  border-radius:50%;
  pointer-events:none;
  filter:blur(80px);
  opacity:.24;
}

.ambient-1{
  width:320px;
  height:320px;
  top:-90px;
  left:-60px;
  background:rgba(125,92,160,.22);
}

.ambient-2{
  width:280px;
  height:280px;
  right:-80px;
  bottom:-90px;
  background:rgba(180,120,58,.18);
}

.app{
  position:relative;
  max-width:1440px;
  margin:0 auto;
  padding:24px;
}

.panel{
  background:linear-gradient(180deg, var(--panel), var(--panel-2));
  border:1px solid rgba(255,255,255,.06);
  border-color:var(--panel-border);
  border-radius:18px;
  box-shadow:var(--shadow), inset 0 1px 0 rgba(255,255,255,.04);
  backdrop-filter:blur(10px);
}

.topbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:16px;
  padding:18px 20px;
  margin-bottom:18px;
}

.brand h1,
h2,
h3{
  font-family:"Cinzel", serif;
  letter-spacing:.04em;
}

h1,h2,h3{margin:0 0 10px}

h1{
  font-size:2.1rem;
  text-transform:uppercase;
}

.subtitle{
  margin:0;
  color:var(--muted);
  letter-spacing:.03em;
}

.save-actions,
.choices{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

button{
  appearance:none;
  border:1px solid rgba(213,176,109,.35);
  border-bottom-color:rgba(120,92,58,.8);
  background:
    linear-gradient(180deg, rgba(48,37,24,.96), rgba(23,18,15,.98));
  color:var(--text);
  padding:11px 15px;
  border-radius:12px;
  cursor:pointer;
  font:inherit;
  box-shadow:0 8px 18px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.05);
  transition:transform .15s ease, border-color .15s ease, box-shadow .15s ease, filter .15s ease;
}

button:hover{
  transform:translateY(-1px);
  border-color:rgba(213,176,109,.8);
  box-shadow:0 12px 22px rgba(0,0,0,.3), 0 0 0 1px rgba(213,176,109,.08) inset;
  filter:brightness(1.06);
}

button:active{
  transform:translateY(1px) scale(.99);
}

button:disabled{
  opacity:.5;
  cursor:not-allowed;
  transform:none;
}

button.primary{
  background:linear-gradient(180deg, rgba(108,78,38,.98), rgba(54,38,20,.98));
  border-color:rgba(213,176,109,.55);
}

.layout{
  display:grid;
  grid-template-columns:280px minmax(0, 1fr) 280px;
  gap:16px;
}

.stats-panel,
.inventory-panel,
.story-panel{
  padding:18px;
}

.story-panel{
  min-height:74vh;
}

.story-meta{
  display:flex;
  justify-content:space-between;
  gap:12px;
  color:var(--muted);
  font-size:.95rem;
  margin-bottom:12px;
  text-transform:uppercase;
  letter-spacing:.06em;
}

#eventTitle{
  font-size:1.8rem;
  margin-bottom:12px;
}

.story-text{
  line-height:1.75;
  font-size:1.08rem;
  min-height:96px;
  margin:0;
  color:#f1e8da;
}

.choices{
  margin:18px 0 14px;
}

.choice{
  width:100%;
  text-align:left;
}

.choice small{
  display:block;
  color:var(--muted);
  margin-top:4px;
}

.list{
  display:grid;
  gap:8px;
  margin-bottom:14px;
}

.item,
.quest,
.rel,
.memory-item{
  padding:9px 11px;
  border-radius:12px;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.06);
  margin-bottom:8px;
}

.item{
  color:#f2eadf;
}

.good{color:var(--success)}
.bad{color:var(--danger)}

.log-wrap{
  margin-top:10px;
}

.log{
  max-height:240px;
  overflow:auto;
  font-size:.95rem;
  color:var(--muted);
  display:grid;
  gap:6px;
  padding-right:4px;
}

.dice-box{
  display:inline-flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  min-width:140px;
  padding:14px 16px;
  border:1px solid rgba(213,176,109,.35);
  border-radius:16px;
  background:linear-gradient(180deg, rgba(16,13,18,.85), rgba(8,8,10,.92));
  margin:8px 0 16px;
  box-shadow:0 0 24px rgba(213,176,109,.08);
}

.dice-label{
  color:var(--muted);
  font-size:.9rem;
  letter-spacing:.05em;
  text-transform:uppercase;
}

.dice-result{
  font-size:2.5rem;
  color:var(--accent);
  font-weight:700;
  line-height:1;
}

.hidden{display:none}

#notifications{
  margin-top:14px;
  display:grid;
  gap:8px;
}

#notifications .item{
  border-color:rgba(213,176,109,.18);
}

#status .item:first-child{
  font-size:1.02rem;
  color:var(--accent);
}

#gold .item{
  font-size:1.15rem;
  color:var(--accent);
}

@media (max-width: 1100px){
  .layout{
    grid-template-columns:1fr;
  }

  .story-panel{
    min-height:auto;
  }
}

@media (max-width: 720px){
  .app{
    padding:14px;
  }

  .topbar{
    flex-direction:column;
    align-items:flex-start;
  }

  .save-actions{
    width:100%;
  }

  .save-actions button{
    flex:1 1 0;
  }

  .story-meta{
    flex-direction:column;
  }

  h1{
    font-size:1.8rem;
  }
}
