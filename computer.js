// === Development Toggle ===
const devEditMode = false;
const devPopupId = "worksPopup"; // dev-only popup

document.addEventListener("DOMContentLoaded", () => {

  // --- Preload hover images and other assets ---
  const assetsToPreload = [
    // App icons normal
    "assets/cd_audio_cd_a-4.webp",
    "assets/steam-1.webp",
    "assets/recycle_bin_empty-4.webp",
    "assets/typewriter-2.webp",
    "assets/palette-1.webp",
    "assets/cat-1.webp",
    "assets/credits-1.webp",
    "assets/film-1.webp",

    // App icons hover
    "assets/cd_audio_cd_a-3.webp",
    "assets/steam-2.webp",
    "assets/recycle_bin_empty-5.webp",
    "assets/typewriter-1.webp",
    "assets/palette-2.webp",
    "assets/credits-2.webp",
    "assets/film-2.webp",

    // Clock images
    "assets/clock_body-1.webp",

    // Welcome popup assets
    "assets/sonnyboy_profile.gif",
    "assets/wave-1.gif",

    // Profile popup assets
    "assets/profile_kid-1.webp",
    "assets/snow1.gif",

    // Works popup assets
    "assets/juggle-2.gif",
    "assets/space3.gif",

    // Lightbox background
    "assets/space4.gif",

    // Taskbar images
    "assets/hi-1.webp",
    "assets/hi-2.webp",
    "assets/msagent-2.webp",
    "assets/msagent-3.webp",
    "assets/directory_open_file_mydocs-4.webp",
    "assets/directory_open_file_mydocs-5.webp",
    "assets/mail-1.webp",
    "assets/mail-2.webp"
  ];

  // Preload all assets
  assetsToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // --- Handle initial popup ---
  if (devEditMode) {
    keepPopupOpen(devPopupId); // dev opens profile popup
  } else if (!localStorage.getItem("welcomePopupClosed")) {
    togglePopup("welcomePopup"); // first visit opens welcome popup
  }

  // --- Icon tapped state ---
  document.querySelectorAll(".icon").forEach(icon => {
    icon.addEventListener("click", () => {
      document.querySelectorAll(".icon").forEach(i => i !== icon && i.classList.remove("tapped"));
      icon.classList.toggle("tapped");
    });
  });
  // --- Analog clock ---
  function updateClock() {
    const now = new Date();
    const secDeg = now.getSeconds() * 6;
    const minDeg = now.getMinutes() * 6 + now.getSeconds() * 0.1;
    const hourDeg = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;

    const secHand = document.querySelector(".hand.second");
    const minHand = document.querySelector(".hand.minute");
    const hourHand = document.querySelector(".hand.hour");

    if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
    if (minHand) minHand.style.transform = `rotate(${minDeg}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
  }

  setInterval(updateClock, 1000);
  updateClock();

// --- Works Popup ---
const worksPopupBody = document.querySelector('#worksPopup .popup-body');
if (worksPopupBody) {
  const animationContainer = document.createElement('div');
  animationContainer.className = 'popup-animation';
  worksPopupBody.parentNode.insertBefore(animationContainer, worksPopupBody); 

  fetch('works.json')
    .then(res => res.json())
    .then(data => {
      const categories = ["Animation", ...Object.keys(data).filter(c => c !== "Animation")];

      categories.forEach(category => {
        const divider = document.createElement('div');
        divider.className = 'works-divider';
        divider.textContent = category;

        // Decide container
        const container = category === "Animation" ? animationContainer : worksPopupBody;
        container.appendChild(divider);

        data[category].forEach(work => {
          const card = document.createElement('div');
          card.className = 'work-item';

          if (work.image) {
            // Covers jpg, webp, gif, etc.
            const img = document.createElement('img');
            img.src = work.image;
            img.alt = work.title || "Untitled";
            card.appendChild(img);

            card.addEventListener('click', () => openLightbox(work, 'worksPopup'));
          } 
          else if (work.video) {
            // Still supports mp4 with thumbnail
            const thumb = document.createElement('img');
            thumb.src = work.thumbnail;
            thumb.alt = work.title || "Untitled";
            card.appendChild(thumb);

            card.addEventListener('click', () => openLightbox(work, 'worksPopup', true));
          }

          container.appendChild(card);
        });
      });
    })
    .catch(err => console.error("Failed to load works.json:", err));
}
});

// --- Lightbox helper ---
function openLightbox(work, popupId, isVideo = false) {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';

  if (isVideo) {
    const video = document.createElement('video');
    video.src = work.video;
    video.controls = true;
    video.autoplay = true;
    video.style.maxWidth = '90vw';
    video.style.maxHeight = '90vh';
    video.style.borderRadius = '6px';
    lightbox.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = work.image;
    img.alt = work.title || "Untitled";
    lightbox.appendChild(img);
  }

  if (work.title || work.description) {
    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    if (work.title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = work.title;
      caption.appendChild(titleEl);
    }
    if (work.description) {
      const descEl = document.createElement('p');
      descEl.textContent = work.description;
      caption.appendChild(descEl);
    }
    lightbox.appendChild(caption);
  }

  document.body.appendChild(lightbox);
  popup.style.display = 'none';

  lightbox.addEventListener('click', e => {
    if (!isVideo || e.target === lightbox) {
      lightbox.remove();
      popup.style.display = 'flex';
      restoreScrollable(popup);
    }
  });
}

// --- Popup utility functions ---
function keepPopupOpen(id) {
  const popup = document.getElementById(id);
  if (!popup) return;

  popup.style.display = popup.classList.contains('popup-works') || popup.classList.contains('popup-profile')
    ? 'flex' : 'block';

  restoreScrollable(popup);
}

function togglePopup(id) {
  if (devEditMode && id === devPopupId) {
    keepPopupOpen(id);
    return;
  }

  const popup = document.getElementById(id);
  if (!popup) return;

  const isOpen = getComputedStyle(popup).display !== 'none';
  document.querySelectorAll('.popup').forEach(p => (p.style.display = 'none'));

  if (!isOpen) keepPopupOpen(id);
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.style.display = 'none';
  if (id === 'welcomePopup') localStorage.setItem('welcomePopupClosed', 'true');
}

// --- Scrollable reflow helper ---
function restoreScrollable(popup) {
  const scrollable = popup.querySelector('.profile-scrollable, .work-scrollable');
  if (!scrollable) return;

  scrollable.style.overflowY = 'hidden';
  scrollable.offsetHeight; // trigger reflow
  scrollable.style.overflowY = 'auto';
}
const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const volUpBtn = document.getElementById('volUpBtn');
const volDownBtn = document.getElementById('volDownBtn');
const muteBtn = document.getElementById('muteBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const musicList = document.querySelector('.music-list');
const scrubber = document.getElementById('scrubber');
const songImg = document.querySelector('.song-img img');

let tracks = [];
let trackItems = [];
let currentTrack = 0;
let isPlaying = false;
let previousVolume = 0.5;

fetch('tracks.json')
  .then(res => res.json())
  .then(data => {
    tracks = data;

    // Populate tracklist
    musicList.innerHTML = '';
    tracks.forEach((track, index) => {
      const div = document.createElement('div');
      div.className = 'track-item';
      div.dataset.index = index;
      div.textContent = track.title;
      musicList.appendChild(div);
    });

    trackItems = document.querySelectorAll('.track-item');

    // Track click
    trackItems.forEach(item => {
      item.addEventListener('click', () => loadTrack(Number(item.dataset.index)));
    });

    // Prev/Next buttons
    nextBtn.addEventListener('click', () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      loadTrack(currentTrack);
    });

    prevBtn.addEventListener('click', () => {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrack);
    });

    // Load first track with 50% volume
    musicPlayer.volume = 0.3;
    previousVolume = 0.3;
    loadTrack(0);
  });
  // --- Auto next track when current ends ---
musicPlayer.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) musicPlayer.play(); // continue playing automatically
});
// --- Load Track ---
function loadTrack(index) {
  currentTrack = index;
  musicPlayer.src = tracks[currentTrack].src;
  songImg.src = tracks[currentTrack].cover;
  highlightActiveTrack();
  if (isPlaying) musicPlayer.play();

  // Toggle emoji only
  playPauseBtn.textContent = isPlaying ? "⏸️" : "▶️";
  playPauseBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  playPauseBtn.setAttribute("title", isPlaying ? "Pause" : "Play");
}

// --- Play/Pause ---
playPauseBtn.addEventListener('click', () => {
  if (!isPlaying) {
    musicPlayer.play();
    playPauseBtn.textContent = "⏸️";
    playPauseBtn.setAttribute("aria-label", "Pause");
    playPauseBtn.setAttribute("title", "Pause");
    isPlaying = true;
  } else {
    musicPlayer.pause();
    playPauseBtn.textContent = "▶️";
    playPauseBtn.setAttribute("aria-label", "Play");
    playPauseBtn.setAttribute("title", "Play");
    isPlaying = false;
  }
});
// --- Volume controls ---
volUpBtn.addEventListener('click', () => musicPlayer.volume = Math.min(1, musicPlayer.volume + 0.1));
volDownBtn.addEventListener('click', () => musicPlayer.volume = Math.max(0, musicPlayer.volume - 0.1));
muteBtn.addEventListener('click', () => {
  if (musicPlayer.volume > 0) {
    previousVolume = musicPlayer.volume;
    musicPlayer.volume = 0;
    muteBtn.innerHTML = "🔈";
  } else {
    musicPlayer.volume = previousVolume || 0.5;
    muteBtn.innerHTML = "🔇";
  }
});

// --- Scrubber ---
musicPlayer.addEventListener('timeupdate', () => {
  if (musicPlayer.duration) scrubber.value = (musicPlayer.currentTime / musicPlayer.duration) * 100;
});
scrubber.addEventListener('input', () => {
  if (musicPlayer.duration) musicPlayer.currentTime = (scrubber.value / 100) * musicPlayer.duration;
});

// --- Highlight active track ---
function highlightActiveTrack() {
  trackItems.forEach((item, index) => item.classList.toggle('active', index === currentTrack));
}