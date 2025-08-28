// === Development Toggle ===
// Set to true to force a specific popup open while editing
const devEditMode = true;      
const devPopupId = "welcomePopup"; // ID of the popup to keep open

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
  hoverImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // --- Development Mode ---
  if (devEditMode) {
    keepPopupOpen(devPopupId);
    return; // Skip normal behavior
  }

  // --- Normal Behavior ---
  if (!localStorage.getItem("welcomePopupClosed")) {
    togglePopup("welcomePopup");
  }

  // Handle icon "tapped" state
  const appIcons = document.querySelectorAll(".icon");
  appIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      appIcons.forEach(i => {
        if (i !== icon) i.classList.remove("tapped");
      });
      icon.classList.toggle("tapped");
    });
  });
});

function updateAnalogClock() {
  const now = new Date();

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondDeg = seconds * 6;              // 360/60
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5; // 360/12

  document.getElementById("secondHand").style.transform = `rotate(${secondDeg}deg)`;
  document.getElementById("minuteHand").style.transform = `rotate(${minuteDeg}deg)`;
  document.getElementById("hourHand").style.transform = `rotate(${hourDeg}deg)`;
}

// Update every second
setInterval(updateAnalogClock, 1000);
updateAnalogClock(); 

/* ---------------------------
   Popup Utility Functions
----------------------------*/
function keepPopupOpen(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  // Works popup needs flex; others can be block
  popup.style.display = popup.classList.contains('popup-works') ? 'flex' : 'block';
}

function togglePopup(id) {
  if (devEditMode && id === devPopupId) {
    keepPopupOpen(id);
    return;
  }

  const popup = document.getElementById(id);
  if (!popup) return;

  // Use computed style because some popups open with 'flex', not 'block'
  const isOpen = getComputedStyle(popup).display !== 'none';

  // Close all popups
  document.querySelectorAll('.popup').forEach(p => (p.style.display = 'none'));

  // Open this one if it wasn't open
  if (!isOpen) {
    popup.style.display = popup.classList.contains('popup-works') ? 'flex' : 'block';
  }
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.style.display = 'none';

  if (id === 'welcomePopup') {
    localStorage.setItem('welcomePopupClosed', 'true');
  }
}

// Works
document.addEventListener("DOMContentLoaded", () => {
  const popupBody = document.querySelector('#worksPopup .popup-body');

  // Fetch works.json
  fetch('works.json')
    .then(res => res.json())
    .then(data => {
      data.forEach((work, index) => {
        // Create main work card
        const card = document.createElement('div');
        card.className = 'work-item';
        card.innerHTML = `
          <img src="${work.image}" alt="${work.title}">
          <h3>${work.title}</h3>
          <p>${work.description}</p>
        `;
        popupBody.appendChild(card);

        // Create mini popup
        const miniPopup = document.createElement('div');
        miniPopup.id = `workPopup${index}`;
        miniPopup.className = 'popup popup-mini';
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

        // Click on card opens mini popup
        card.addEventListener('click', () => {
          document.getElementById('worksPopup').style.display = 'none';
          document.getElementById(`workPopup${index}`).style.display = 'block';
        });
      });
    })
    .catch(err => console.error("Failed to load works.json:", err));
});

// Back button + close button function
function backToWorks(miniPopupId) {
  const miniPopup = document.getElementById(miniPopupId);
  if (miniPopup) miniPopup.style.display = 'none';
  const worksPopup = document.getElementById('worksPopup');
  if (worksPopup) worksPopup.style.display = 'block';
}

// When a card is clicked: hide works, show mini
card.addEventListener('click', () => {
  document.getElementById('worksPopup').style.display = 'none';
  document.getElementById(`workPopup${index}`).style.display = 'block';
});

// Back button: hide mini, show works (with flex)
function backToWorks(miniPopupId) {
  const miniPopup = document.getElementById(miniPopupId);
  if (miniPopup) miniPopup.style.display = 'none';
  const worksPopup = document.getElementById('worksPopup');
  if (worksPopup) worksPopup.style.display = 'flex';
}