const photoWall = document.getElementById("photoWall");
const photoUpload = document.getElementById("photoUpload");
const themeToggle = document.getElementById("themeToggle");
const uploadStatus = document.getElementById("uploadStatus");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const favoritesOnly = document.getElementById("favoritesOnly");
const tagInput = document.getElementById("tagInput");
const dropZone = document.getElementById("dropZone");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");
const prevLightboxBtn = document.getElementById("prevLightboxBtn");
const nextLightboxBtn = document.getElementById("nextLightboxBtn");
const photoCounter = document.getElementById("photoCounter");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const bulkActionBtn = document.getElementById("bulkActionBtn");
const bulkBar = document.getElementById("bulkBar");
const bulkCount = document.getElementById("bulkCount");
const bulkFavoriteBtn = document.getElementById("bulkFavoriteBtn");
const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
const bulkClearBtn = document.getElementById("bulkClearBtn");
const undoBar = document.getElementById("undoBar");
const undoText = document.getElementById("undoText");
const undoBtn = document.getElementById("undoBtn");
const musicUpload = document.getElementById("musicUpload");
const musicUrlInput = document.getElementById("musicUrlInput");
const addUrlBtn = document.getElementById("addUrlBtn");
const playlist = document.getElementById("playlist");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevTrackBtn = document.getElementById("prevTrackBtn");
const nextTrackBtn = document.getElementById("nextTrackBtn");
const loopBtn = document.getElementById("loopBtn");
const volumeSlider = document.getElementById("volumeSlider");
const nowPlaying = document.getElementById("nowPlaying");

const STORAGE_KEYS = { photos: "capybara-photos", theme: "capybara-theme", music: "capybara-music" };

const defaultPhotos = Array.from({ length: 100 }, (_, i) => ({
  id: crypto.randomUUID(),
  image: `https://picsum.photos/seed/capybara-${i + 1}/${400 + (i % 5) * 20}/${400 + (i % 5) * 20}`,
  caption: `memory ${String(i + 1).padStart(2, "0")}`,
  note: "",
  tags: [],
  favorite: false,
  createdAt: Date.now() - i * 1000,
}));

let photos = loadPhotos();
let selectedIds = new Set();
let undoState = null;
let undoTimer = null;
let tracks = loadTracks();
let currentTrackIndex = 0;
let isLooping = false;
let currentVisiblePhotos = [];
let currentLightboxIndex = -1;

function loadPhotos() {
  const saved = localStorage.getItem(STORAGE_KEYS.photos);
  if (!saved) return defaultPhotos;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed.map(sanitizePhoto) : defaultPhotos;
  } catch {
    return defaultPhotos;
  }
}

function loadTracks() {
  const saved = localStorage.getItem(STORAGE_KEYS.music);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((t) => t && typeof t.url === "string" && typeof t.name === "string") : [];
  } catch {
    return [];
  }
}

function saveTracks() {
  localStorage.setItem(STORAGE_KEYS.music, JSON.stringify(tracks));
}

function savePhotos() {
  localStorage.setItem(STORAGE_KEYS.photos, JSON.stringify(photos));
}

function setUploadStatus(message) {
  if (uploadStatus) uploadStatus.textContent = message;
}

function sanitizePhoto(photo) {
  return {
    id: photo.id || crypto.randomUUID(),
    image: photo.image || "",
    caption: typeof photo.caption === "string" ? photo.caption : "memory",
    note: typeof photo.note === "string" ? photo.note : "",
    tags: Array.isArray(photo.tags) ? photo.tags.filter((t) => typeof t === "string") : [],
    favorite: Boolean(photo.favorite),
    createdAt: Number(photo.createdAt) || Date.now(),
  };
}

function getFilteredPhotos() {
  const query = searchInput.value.trim().toLowerCase();
  const tagQuery = tagInput.value.trim().toLowerCase();
  let list = [...photos];

  if (favoritesOnly.checked) list = list.filter((p) => p.favorite);
  if (query) list = list.filter((p) => (p.caption + " " + (p.note || "")).toLowerCase().includes(query));
  if (tagQuery) list = list.filter((p) => (p.tags || []).some((t) => t.toLowerCase().includes(tagQuery)));

  switch (sortSelect.value) {
    case "oldest":
      list.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case "favorites":
      list.sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt);
      break;
    default:
      list.sort((a, b) => b.createdAt - a.createdAt);
  }

  return list;
}

function updateCounters() {
  const filtered = getFilteredPhotos();
  const favs = photos.filter((p) => p.favorite).length;
  if (photoCounter) photoCounter.textContent = `${filtered.length} shown · ${photos.length} total · ${favs} favorites`;
  if (bulkCount) bulkCount.textContent = `${selectedIds.size} selected`;
  if (bulkBar) bulkBar.hidden = selectedIds.size === 0;
  if (bulkActionBtn) bulkActionBtn.disabled = selectedIds.size === 0;
}

function renderPhotos() {
  const list = getFilteredPhotos();
  currentVisiblePhotos = list;
  updateCounters();

  if (!list.length) {
    photoWall.innerHTML = `<div class="empty-state">no photos match your search yet. try clearing filters or upload new memories.</div>`;
    return;
  }

  photoWall.innerHTML = list
    .map(
      (photo) => `
      <article class="photo-card ${selectedIds.has(photo.id) ? "selected" : ""}" data-id="${photo.id}">
        <label class="select-photo">
          <input class="select-checkbox" type="checkbox" ${selectedIds.has(photo.id) ? "checked" : ""} aria-label="select ${photo.caption}" />
          select
        </label>
        <img loading="lazy" src="${photo.image}" alt="${photo.caption}" />
        <div class="photo-meta">
          <p class="caption-display" contenteditable="true" spellcheck="false" aria-label="caption for ${photo.caption}">${photo.caption}</p>
          <span aria-label="${photo.favorite ? "favorited" : "not favorited"}">${photo.favorite ? "★" : "☆"}</span>
        </div>
        <textarea class="photo-note" rows="2" aria-label="note for ${photo.caption}" placeholder="add a note...">${photo.note || ""}</textarea>
        <input class="photo-tags-input" type="text" value="${(photo.tags || []).join(", ")}" placeholder="tags: trip, family..." aria-label="tags for ${photo.caption}" />
        <div class="photo-actions">
          <button class="photo-action favorite-btn ${photo.favorite ? "favorited" : ""}" type="button">${photo.favorite ? "unfavorite" : "favorite"}</button>
          <button class="photo-action delete-btn" type="button">delete</button>
        </div>
      </article>`
    )
    .join("");
  renderPlaylist();
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", isDark ? "switch to light mode" : "switch to dark mode");
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function openLightboxByIndex(index) {
  const photo = currentVisiblePhotos[index];
  if (!photo) return;
  currentLightboxIndex = index;
  lightboxImage.src = photo.image;
  lightboxImage.alt = photo.caption;
  lightboxCaption.textContent = photo.caption;
  if (lightbox?.showModal) lightbox.showModal();
}

function openLightbox(photo) {
  const index = currentVisiblePhotos.findIndex((p) => p.id === photo.id);
  openLightboxByIndex(index);
}

function showUndo(message, state) {
  clearTimeout(undoTimer);
  undoState = state;
  undoText.textContent = message;
  undoBar.hidden = false;
  undoTimer = setTimeout(() => {
    undoBar.hidden = true;
    undoState = null;
  }, 5000);
}

async function addFiles(files) {
  const images = files.filter((f) => f.type.startsWith("image/"));
  if (!images.length) {
    setUploadStatus("please upload image files only.");
    return;
  }
  photoWall.classList.add("loading");
  setUploadStatus(`loading ${images.length} photo${images.length > 1 ? "s" : ""}...`);

  for (const file of images) {
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
    photos.unshift(
      sanitizePhoto({
        id: crypto.randomUUID(),
        image: dataUrl,
        caption: file.name.replace(/\.[^/.]+$/, ""),
        note: "",
        tags: [],
        favorite: false,
        createdAt: Date.now(),
      })
    );
  }

  savePhotos();
  renderPhotos();
  photoWall.classList.remove("loading");
  setUploadStatus(`${images.length} photo${images.length > 1 ? "s" : ""} added.`);
  photoUpload.value = "";
}

function deletePhotos(ids) {
  const removed = photos.filter((p) => ids.includes(p.id));
  photos = photos.filter((p) => !ids.includes(p.id));
  ids.forEach((id) => selectedIds.delete(id));
  savePhotos();
  renderPhotos();
  showUndo(`${removed.length} photo${removed.length > 1 ? "s" : ""} deleted.`, { removed: removed.map(sanitizePhoto) });
}

function exportBackup() {
  const payload = { version: 1, photos: photos.map(sanitizePhoto), tracks };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "capybara-scrapbook-backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || ""));
      const incomingPhotos = Array.isArray(data) ? data : Array.isArray(data.photos) ? data.photos : null;
      const incomingTracks = Array.isArray(data?.tracks) ? data.tracks : null;
      if (!incomingPhotos) throw new Error("invalid");
      photos = incomingPhotos.map(sanitizePhoto);
      if (incomingTracks) {
        tracks = incomingTracks.filter((t) => t && typeof t.url === "string" && typeof t.name === "string");
        saveTracks();
      }
      selectedIds.clear();
      savePhotos();
      renderPhotos();
      setUploadStatus("backup imported.");
    } catch {
      setUploadStatus("could not import backup.");
    }
  };
  reader.readAsText(file);
}

function loadTrack(track) {
  audioPlayer.src = track.url;
  nowPlaying.textContent = `now playing: ${track.name}`;
  renderPlaylist();
}

function renderPlaylist() {
  playlist.innerHTML = tracks.length
    ? tracks
        .map(
          (track, index) => `
            <div class="playlist-item ${index === currentTrackIndex ? "active" : ""}">
              <span>${track.name}</span>
              <div class="photo-actions">
                <button class="photo-action" type="button" data-play-index="${index}">play</button>
                <button class="photo-action" type="button" data-remove-index="${index}">remove</button>
              </div>
            </div>`
        )
        .join("")
    : `<div class="empty-state">no songs yet. add your favorite private tracks above.</div>`;
}

function addTrack(url, name) {
  tracks.push({ url, name });
  saveTracks();
  renderPlaylist();
  if (tracks.length === 1) {
    currentTrackIndex = 0;
    loadTrack(tracks[0]);
  }
}

function playTrack(index) {
  if (!tracks[index]) return;
  currentTrackIndex = index;
  loadTrack(tracks[index]);
  audioPlayer.play().catch(() => {});
  playPauseBtn.textContent = "pause";
}

renderPhotos();
renderPlaylist();

photoWall.addEventListener("click", (e) => {
  const card = e.target.closest(".photo-card");
  if (!card) return;
  const photo = photos.find((p) => p.id === card.dataset.id);
  if (!photo) return;

  if (e.target.matches("img")) return openLightbox(photo);

  if (e.target.classList.contains("favorite-btn")) {
    photo.favorite = !photo.favorite;
    savePhotos();
    renderPhotos();
  }

  if (e.target.classList.contains("delete-btn")) {
    if (!confirm(`Delete "${photo.caption}"?`)) return;
    deletePhotos([photo.id]);
  }

  if (e.target.classList.contains("select-checkbox")) {
    if (e.target.checked) selectedIds.add(photo.id);
    else selectedIds.delete(photo.id);
    renderPhotos();
  }
});

photoWall.addEventListener("focusout", (e) => {
  const card = e.target.closest(".photo-card");
  if (!card) return;
  const photo = photos.find((p) => p.id === card.dataset.id);
  if (!photo) return;

  if (e.target.classList.contains("caption-display")) photo.caption = e.target.textContent.trim() || photo.caption;
  if (e.target.classList.contains("photo-note")) photo.note = e.target.value;
  if (e.target.classList.contains("photo-tags-input")) photo.tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
  savePhotos();
});

if (photoUpload) photoUpload.addEventListener("change", () => addFiles(Array.from(photoUpload.files || [])));
dropZone?.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone?.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  addFiles(Array.from(e.dataTransfer.files || []));
});
dropZone?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") photoUpload.click();
});

closeLightbox?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});
prevLightboxBtn?.addEventListener("click", () =>
  openLightboxByIndex((currentLightboxIndex - 1 + currentVisiblePhotos.length) % currentVisiblePhotos.length)
);
nextLightboxBtn?.addEventListener("click", () =>
  openLightboxByIndex((currentLightboxIndex + 1) % currentVisiblePhotos.length)
);

themeToggle?.addEventListener("click", () => setTheme(document.body.classList.contains("dark") ? "light" : "dark"));

searchInput?.addEventListener("input", renderPhotos);
sortSelect?.addEventListener("change", renderPhotos);
favoritesOnly?.addEventListener("change", renderPhotos);
tagInput?.addEventListener("input", renderPhotos);

exportBtn?.addEventListener("click", exportBackup);
importInput?.addEventListener("change", () => importInput.files[0] && importBackup(importInput.files[0]));

bulkActionBtn?.addEventListener("click", () => {
  if (!selectedIds.size) return;
  bulkBar.hidden = false;
});
bulkFavoriteBtn?.addEventListener("click", () => {
  photos = photos.map((p) => (selectedIds.has(p.id) ? { ...p, favorite: !p.favorite } : p));
  savePhotos();
  renderPhotos();
});
bulkDeleteBtn?.addEventListener("click", () => {
  if (!selectedIds.size) return;
  if (!confirm(`Delete ${selectedIds.size} selected photo(s)?`)) return;
  deletePhotos([...selectedIds]);
});
bulkClearBtn?.addEventListener("click", () => {
  selectedIds.clear();
  renderPhotos();
});

undoBtn?.addEventListener("click", () => {
  if (!undoState?.removed?.length) return;
  photos = [...undoState.removed, ...photos];
  savePhotos();
  undoBar.hidden = true;
  undoState = null;
  renderPhotos();
});

musicUpload?.addEventListener("change", () => {
  const files = Array.from(musicUpload.files || []).filter((f) => f.type.startsWith("audio/"));
  if (!files.length) {
    nowPlaying.textContent = "please upload audio files only.";
    return;
  }
  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    addTrack(url, file.name.replace(/\.[^/.]+$/, ""));
  });
  musicUpload.value = "";
  nowPlaying.textContent = `${files.length} song${files.length > 1 ? "s" : ""} added.`;
});

addUrlBtn?.addEventListener("click", () => {
  const url = musicUrlInput.value.trim();
  if (!url) return;
  const name = url.split("/").pop() || "song";
  addTrack(url, name);
  musicUrlInput.value = "";
  nowPlaying.textContent = "url song added.";
});

playlist?.addEventListener("click", (e) => {
  const playIndex = e.target.getAttribute("data-play-index");
  const removeIndex = e.target.getAttribute("data-remove-index");
  if (playIndex !== null) playTrack(Number(playIndex));
  if (removeIndex !== null) {
    tracks.splice(Number(removeIndex), 1);
    if (currentTrackIndex >= tracks.length) currentTrackIndex = Math.max(0, tracks.length - 1);
    saveTracks();
    renderPlaylist();
  }
});

playPauseBtn?.addEventListener("click", async () => {
  if (!tracks.length) return;
  if (!audioPlayer.src) loadTrack(tracks[currentTrackIndex]);
  if (audioPlayer.paused) {
    await audioPlayer.play().catch(() => {});
    playPauseBtn.textContent = "pause";
  } else {
    audioPlayer.pause();
    playPauseBtn.textContent = "play";
  }
});

prevTrackBtn?.addEventListener("click", () => playTrack((currentTrackIndex - 1 + tracks.length) % tracks.length));
nextTrackBtn?.addEventListener("click", () => playTrack((currentTrackIndex + 1) % tracks.length));
loopBtn?.addEventListener("click", () => {
  isLooping = !isLooping;
  audioPlayer.loop = isLooping;
  loopBtn.textContent = isLooping ? "loop on" : "loop off";
});

volumeSlider?.addEventListener("input", () => {
  audioPlayer.volume = Number(volumeSlider.value);
});

audioPlayer?.addEventListener("ended", () => {
  if (!isLooping && tracks.length) playTrack((currentTrackIndex + 1) % tracks.length);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape" && lightbox?.open) lightbox.close();
});

const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
if (savedTheme) setTheme(savedTheme);
else setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
audioPlayer.volume = Number(volumeSlider.value);
renderPlaylist();