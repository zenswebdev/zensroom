// === Development Toggle ===
const devEditMode = false;
const devPopupId = "skillsLightbox"; // dev-only popup

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

          const container = category === "Animation" ? animationContainer : worksPopupBody;
          container.appendChild(divider);

          data[category].forEach(work => {
            const card = document.createElement('div');
            card.className = 'work-item';

            if (work.image) {
              const img = document.createElement('img');
              img.src = work.image;
              img.alt = work.title || "Untitled";
              card.appendChild(img);

              card.addEventListener('click', () => openLightbox(work, 'worksPopup'));
            } else if (work.video) {
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
function openSkillsLightbox() {
  const overlay = document.getElementById('skillsLightbox');
  if (!overlay) return;

  overlay.style.display = 'flex';

  const content = overlay.querySelector('.lightbox-content');
  const coreNode = content.querySelector('.skill-node.main');

setTimeout(() => {
  if (coreNode) {
    const rect = coreNode.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    content.scrollTop = coreNode.offsetTop - content.clientHeight / 2 + coreNode.clientHeight / 2;
    content.scrollLeft = coreNode.offsetLeft - content.clientWidth / 2 + coreNode.clientWidth / 2;
  }
}, 50);
}
const toggleBtn = document.getElementById('skillsToggle');
const treeWrapper = document.querySelector('.skills-scroll-wrapper');
const listView = document.querySelector('.skills-list');
const legend = document.querySelector('.skills-legend');

function updateViewOnResize() {
  if (window.innerWidth <= 600) {
    treeWrapper.style.display = 'none';
    listView.style.display = 'block';
    toggleBtn.style.display = 'none'; // hide toggle button
    legend.style.display = 'none'; // hide legend
  } else {
    treeWrapper.style.display = 'flex';
    listView.style.display = 'none';
    toggleBtn.style.display = 'block'; // show toggle button
    toggleBtn.textContent = 'Switch to List View';
    legend.style.display = 'flex'; // show legend
  }
}

// Initial check
updateViewOnResize();

// Listen to window resize
window.addEventListener('resize', updateViewOnResize);

// Manual toggle (for larger screens)
toggleBtn.addEventListener('click', () => {
  if (treeWrapper.style.display !== 'none') {
    treeWrapper.style.display = 'none';
    listView.style.display = 'block';
    toggleBtn.textContent = 'Switch to Tree View';
    legend.style.display = 'none'; // hide legend when in list view
  } else {
    treeWrapper.style.display = 'flex';
    listView.style.display = 'none';
    toggleBtn.textContent = 'Switch to List View';
    legend.style.display = 'flex'; // show legend when in tree view
  }
});
// Close by clicking overlay background
function closeSkillsLightbox(event) {
  const overlay = event.currentTarget;
  overlay.style.display = 'none';
}

// --- Popup utility functions ---
function keepPopupOpen(id) {
  const popup = document.getElementById(id);
  if (!popup) return;

  // Force open in dev mode
  if (devEditMode) {
    if (id === "skillsLightbox") {
      popup.style.display = "flex";
      // Scroll to core hex
      const content = popup.querySelector(".lightbox-content");
      const coreNode = content.querySelector(".skill-node.main");
      if (coreNode) {
        setTimeout(() => {
          content.scrollTop = coreNode.offsetTop - content.clientHeight / 2 + coreNode.clientHeight / 2;
        }, 50);
      }
    } else if (id === devPopupId) {
      popup.style.display = 'flex';
      restoreScrollable(popup);
    }
    return;
  }

  // Normal popup behavior
  const useFlex = popup.classList.contains('popup-works') ||
                  popup.classList.contains('popup-profile') ||
                  popup.classList.contains('popup-cat') ||
                  popup.classList.contains('popup-general');

  popup.style.display = useFlex ? 'flex' : 'block';
  restoreScrollable(popup);
}

function togglePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;

  const isOpen = getComputedStyle(popup).display !== 'none';

  // hide all popups EXCEPT dev popup if dev mode
  document.querySelectorAll('.popup').forEach(p => {
    if (!(devEditMode && p.id === devPopupId)) p.style.display = 'none';
  });

  if (!isOpen) keepPopupOpen(id);
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;

  popup.style.display = 'none';

  const scrollable = popup.querySelector('.popup-scrollable');
  if (scrollable) scrollable.scrollTop = 0;

  if (id === 'welcomePopup') localStorage.setItem('welcomePopupClosed', 'true');
}

// --- Scrollable helper ---
function restoreScrollable(popup) {
  const scrollable = popup.querySelector('.popup-scrollable');
  if (!scrollable) return;

  scrollable.style.overflowY = 'hidden';
  scrollable.offsetHeight; // trigger reflow
  scrollable.style.overflowY = 'auto';
}

// === Music player code remains unchanged ===
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
    musicList.innerHTML = '';
    tracks.forEach((track, index) => {
      const div = document.createElement('div');
      div.className = 'track-item';
      div.dataset.index = index;
      div.textContent = track.title;
      musicList.appendChild(div);
    });
    trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach(item => {
      item.addEventListener('click', () => loadTrack(Number(item.dataset.index)));
    });
    nextBtn.addEventListener('click', () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      loadTrack(currentTrack);
    });
    prevBtn.addEventListener('click', () => {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrack);
    });
    musicPlayer.volume = 0.3;
    previousVolume = 0.3;
    loadTrack(0);
  });

musicPlayer.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) musicPlayer.play();
});

function loadTrack(index) {
  currentTrack = index;
  musicPlayer.src = tracks[currentTrack].src;
  songImg.src = tracks[currentTrack].cover;
  highlightActiveTrack();
  if (isPlaying) musicPlayer.play();

  playPauseBtn.textContent = isPlaying ? "⏸️" : "▶️";
  playPauseBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  playPauseBtn.setAttribute("title", isPlaying ? "Pause" : "Play");
}

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

musicPlayer.addEventListener('timeupdate', () => {
  if (musicPlayer.duration) scrubber.value = (musicPlayer.currentTime / musicPlayer.duration) * 100;
});
scrubber.addEventListener('input', () => {
  if (musicPlayer.duration) musicPlayer.currentTime = (scrubber.value / 100) * musicPlayer.duration;
});

function highlightActiveTrack() {
  trackItems.forEach((item, index) => item.classList.toggle('active', index === currentTrack));
}