// === Development Toggle ===
const devEditMode = false;
const devPopupId = "profilePopup"; // ID of popup to keep open

document.addEventListener("DOMContentLoaded", () => {
  // --- Preload hover images ---
  const hoverImages = [
    "assets/cd_audio_cd_a-3.png",
    "assets/steam-2.png", // fixed missing extension
    "assets/recycle_bin_empty-5.png",
    "assets/notepad-5.png",
    "assets/palette-2.png",
    "assets/bad_apple-2.png",
    "assets/cat-1.png",
    "assets/credit-2.png"
  ];
  hoverImages.forEach(src => { new Image().src = src; });

  // --- Handle dev mode ---
  if (devEditMode) {
    keepPopupOpen(devPopupId);
  } else if (!localStorage.getItem("welcomePopupClosed")) {
    togglePopup("welcomePopup");
  }

  // --- Icon tapped state ---
  document.querySelectorAll(".icon").forEach(icon => {
    icon.addEventListener("click", () => {
      document.querySelectorAll(".icon").forEach(i => i !== icon && i.classList.remove("tapped"));
      icon.classList.toggle("tapped");
    });
  });

  // --- Update analog clock ---
  function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDeg = seconds * 6;              // 360 / 60
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg   = (hours % 12) * 30 + minutes * 0.5;

    const secHand = document.querySelector(".hand.second");
    const minHand = document.querySelector(".hand.minute");
    const hourHand = document.querySelector(".hand.hour");

    if (secHand && minHand && hourHand) {
      secHand.style.transform = `rotate(${secondDeg}deg)`;
      minHand.style.transform = `rotate(${minuteDeg}deg)`;
      hourHand.style.transform = `rotate(${hourDeg}deg)`;
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  // --- Works Popup ---
  const popupBody = document.querySelector('#worksPopup .popup-body');
  if (!popupBody) return;

  // Separate container for animation works
  const animationContainer = document.createElement('div');
  animationContainer.className = 'popup-animation';
  popupBody.parentNode.appendChild(animationContainer);

  fetch('works.json')
    .then(res => res.json())
    .then(data => {
      Object.keys(data).forEach(category => {
        // Divider
        const divider = document.createElement('div');
        divider.className = 'works-divider';
        divider.textContent = category;

        const container = category === "Animation" ? animationContainer : popupBody;
        container.appendChild(divider);

        // Work cards
        data[category].forEach(work => {
          const card = document.createElement('div');
          card.className = 'work-item';

          if (work.image) {
            // --- Image works ---
            const img = document.createElement('img');
            img.src = work.image;
            img.alt = work.title || "Untitled";
            card.appendChild(img);

            card.addEventListener('click', () => {
              const worksPopup = document.getElementById('worksPopup');

              const lightbox = document.createElement('div');
              lightbox.className = 'lightbox';

              const bigImg = document.createElement('img');
              bigImg.src = work.image;
              bigImg.alt = work.title || "Untitled";
              lightbox.appendChild(bigImg);

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
              worksPopup.style.display = 'none';

              lightbox.addEventListener('click', () => {
                lightbox.remove();
                worksPopup.style.display = 'flex';
              });
            });

          } else if (work.video) {
            // --- Video works ---
            const thumb = document.createElement('img');
            thumb.src = work.thumbnail;
            thumb.alt = work.title || "Untitled";
            card.appendChild(thumb);

            card.addEventListener('click', () => {
              const worksPopup = document.getElementById('worksPopup');

              const lightbox = document.createElement('div');
              lightbox.className = 'lightbox';

              const video = document.createElement('video');
              video.src = work.video;
              video.controls = true;
              video.autoplay = true;
              video.style.maxWidth = '95vw';
              video.style.maxHeight = '95vh';
              video.style.borderRadius = '6px';
              lightbox.appendChild(video);

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
              worksPopup.style.display = 'none';

              lightbox.addEventListener('click', e => {
                if (e.target === lightbox) {
                  lightbox.remove();
                  worksPopup.style.display = 'flex';
                }
              });
            });
          }

          container.appendChild(card);
        });
      });
    })
    .catch(err => console.error("Failed to load works.json:", err));
});

// --- Popup utility functions ---
function keepPopupOpen(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.style.display = popup.classList.contains('popup-works') ? 'flex' : 'block';
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

  if (!isOpen) popup.style.display = popup.classList.contains('popup-works') ? 'flex' : 'block';
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.style.display = 'none';
  if (id === 'welcomePopup') localStorage.setItem('welcomePopupClosed', 'true');
}