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
  function updateAnalogClock() {
    const now = new Date();
    document.getElementById("secondHand").style.transform = `rotate(${now.getSeconds() * 6}deg)`;
    document.getElementById("minuteHand").style.transform = `rotate(${now.getMinutes() * 6 + now.getSeconds() * 0.1}deg)`;
    document.getElementById("hourHand").style.transform = `rotate(${now.getHours() * 30 + now.getMinutes() * 0.5}deg)`;
  }
  setInterval(updateAnalogClock, 1000);
  updateAnalogClock();

  // --- Works Popup ---
  const popupBody = document.querySelector('#worksPopup .popup-body');

  fetch('works.json')
    .then(res => res.json())
    .then(data => {
      data.forEach((work, index) => {
        // Main work card
        const card = document.createElement('div');
        card.className = 'work-item';
        card.innerHTML = `
          <img src="${work.image}" alt="${work.title}">
          <h3>${work.title}</h3>
          <p>${work.description}</p>
        `;
        popupBody.appendChild(card);

        // Mini popup
        const miniPopup = document.createElement('div');
        miniPopup.id = `workPopup${index}`;
        miniPopup.className = 'popup popup-mini';
        miniPopup.style.display = 'none';
        miniPopup.innerHTML = `
          <div class="popup-header">
            <button class="back-btn" onclick="backToWorks('workPopup${index}')">&larr; Back</button>
            ${work.title}
            <button class="close-btn" onclick="backToWorks('workPopup${index}')">X</button>
          </div>
          <div class="popup-body">
            <img src="${work.image}" alt="${work.title}">
            <p>${work.details}</p>
          </div>
        `;
        document.body.appendChild(miniPopup);

        // Click opens mini popup
        card.addEventListener('click', () => {
          document.getElementById('worksPopup').style.display = 'none';
          miniPopup.style.display = 'block';
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

function backToWorks(miniPopupId) {
  const miniPopup = document.getElementById(miniPopupId);
  if (miniPopup) miniPopup.style.display = 'none';
  const worksPopup = document.getElementById('worksPopup');
  if (worksPopup) worksPopup.style.display = 'flex';
}