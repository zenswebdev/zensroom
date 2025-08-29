// === Development Toggle ===
const devEditMode = true;
const devPopupId = "worksPopup"; // ID of popup to keep open

document.addEventListener("DOMContentLoaded", () => {
  // --- Preload hover images ---
  const hoverImages = [
    "assets/cd_audio_cd_a-3.png",
    "assets/joystick-4.png",
    "assets/recycle_bin_empty-5.png",
    "assets/notepad-2.png",
    "assets/palette-2.png",
    "assets/bad_apple-2.png"
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

    document.querySelector(".hand.second").style.transform = `rotate(${secondDeg}deg)`;
    document.querySelector(".hand.minute").style.transform = `rotate(${minuteDeg}deg)`;
    document.querySelector(".hand.hour").style.transform   = `rotate(${hourDeg}deg)`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  // --- Works Popup ---
  const popupBody = document.querySelector('#worksPopup .popup-body');

  fetch('works.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(work => {
        // Create work card
        const card = document.createElement('div');
        card.className = 'work-item';
        card.innerHTML = `<img src="${work.image}" alt="${work.title}">`;
        popupBody.appendChild(card);

        // Click opens lightbox
        card.addEventListener('click', () => {
          const worksPopup = document.getElementById('worksPopup');

          // Create lightbox overlay
          const lightbox = document.createElement('div');
          lightbox.className = 'lightbox';

          // Image inside lightbox
          const img = document.createElement('img');
          img.src = work.image;
          img.alt = work.title;
          lightbox.appendChild(img);

          document.body.appendChild(lightbox);

          // Hide main works popup while lightbox is visible
          worksPopup.style.display = 'none';

          // Click anywhere closes lightbox and restores works popup
          lightbox.addEventListener('click', () => {
            lightbox.remove();
            worksPopup.style.display = 'flex';
          });
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
