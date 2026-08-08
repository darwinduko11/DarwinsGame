:root{
  --bg:#0b0b10;
  --panel:#141420cc;
  --panel-border:#3c3349;
  --text:#e8e2d6;
  --muted:#b4a89a;
  --accent:#c8a86b;
  --danger:#d36b6b;
  --success:#7ad08b;
}

*{box-sizing:border-box}
body{
  margin:0;
  min-height:100vh;
  font-family:Georgia, "Times New Roman", serif;
  color:var(--text);
  background:
    radial-gradient(circle at top, #2a2034 0%, #111018 45%, #06060a 100%);
}
.background{
  position:fixed;
  inset:0;
  background:
    linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.65)),
    url("https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=80") center/cover no-repeat;
  opacity:.16;
  pointer-events:none;
}
.app{
  position:relative;
  max-width:1400px;
  margin:0 auto;
  padding:24px;
}
.topbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:16px;
  margin-bottom:18px;
}
h1,h2,h3{margin:0 0 10px}
.subtitle{margin:0;color:var(--muted)}
.save-actions, .choices{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}
button{
  background:linear-gradient(#2c2438, #1b1524);
  color:var(--text);
  border:1px solid var(--panel-border);
  padding:10px 14px;
  border-radius:10px;
  cursor:pointer;
}
button:hover{border-color:var(--accent)}
button:disabled{
  opacity:.5;
  cursor:not-allowed;
}
.layout{
  display:grid;
  grid-template-columns: 280px 1fr 280px;
  gap:16px;
}
.panel{
  background:var(--panel);
  border:1px solid var(--panel-border);
  border-radius:16px;
  padding:16px;
  backdrop-filter:blur(8px);
  box-shadow:0 0 0 1px rgba(255,255,255,.03) inset;
}
.story-panel{
  min-height:72vh;
}
.story-meta{
  display:flex;
  justify-content:space-between;
  gap:12px;
  color:var(--muted);
  font-size:.95rem;
  margin-bottom:10px;
}
.story-text{
  line-height:1.6;
  font-size:1.05rem;
  min-height:90px;
}
.choices{
  margin:18px 0;
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
.item, .quest, .rel, .memory-item{
  padding:8px 10px;
  border-radius:10px;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.05);
  margin-bottom:8px;
}
.good{color:var(--success)}
.bad{color:var(--danger)}
.log{
  max-height:220px;
  overflow:auto;
  font-size:.95rem;
  color:var(--muted);
  display:grid;
  gap:6px;
}
.dice-box{
  display:inline-flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  min-width:120px;
  padding:12px;
  border:1px solid var(--panel-border);
  border-radius:14px;
  background:rgba(0,0,0,.25);
  margin:8px 0 14px;
}
.dice-result{
  font-size:2.3rem;
  color:var(--accent);
  font-weight:bold;
}
.hidden{display:none}
@media (max-width: 1100px){
  .layout{grid-template-columns:1fr}
}
