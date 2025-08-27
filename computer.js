// === Development Toggle ===
// Set to true to force a specific popup open while editing
const devEditMode = false;      
const devPopupId = "worksPopup"; // ID of the popup to keep open

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

/* ---------------------------
   Popup Utility Functions
----------------------------*/
function keepPopupOpen(id) {
  const popup = document.getElementById(id);
  if (popup) popup.style.display = "block";
}

function togglePopup(id) {
  if (devEditMode && id === devPopupId) {
    keepPopupOpen(id); // Reuse helper
    return;
  }

  const popup = document.getElementById(id);
  if (!popup) return;

  const isOpen = popup.style.display === "block";

  // Close all other popups first
  document.querySelectorAll(".popup").forEach(p => {
    p.style.display = "none";
  });

  // Open this popup if it wasn't already open
  if (!isOpen) {
    popup.style.display = "block";
  }
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;

  popup.style.display = "none";

  // Remember if the profile popup was closed
  if (id === "welcomePopup") {
    localStorage.setItem("welcomePopupClosed", "true");
  }
}
