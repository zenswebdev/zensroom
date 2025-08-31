// === Development Toggle ===
const devEditMode = false;
const devPopupId = "profilePopup"; // ID of popup to keep open

document.addEventListener("DOMContentLoaded", () => {
  // --- Preload hover images ---
  const hoverImages = [
    "assets/cd_audio_cd_a-3.png",
    "assets/steam-2.png",
    "assets/recycle_bin_empty-5.png",
    "assets/notepad-5.png",
    "assets/palette-2.png",
    "assets/bad_apple-2.png",
    "assets/cat-1.png",
    "assets/credit-2.png"
  ];
  hoverImages.forEach(src => new Image().src = src);

  // --- Handle dev mode ---
  if (devEditMode) keepPopupOpen(devPopupId);
  else if (!localStorage.getItem("welcomePopupClosed")) togglePopup("welcomePopup");

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
    worksPopupBody.parentNode.appendChild(animationContainer);

    fetch('works.json')
      .then(res => res.json())
      .then(data => {
        Object.keys(data).forEach(category => {
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
    video.style.maxWidth = '95vw';
    video.style.maxHeight = '95vh';
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
      // restore scrollable if needed
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