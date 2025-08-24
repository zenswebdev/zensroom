document.addEventListener("DOMContentLoaded", () => {
  const profilePopup = document.getElementById("profilePopup");

  // Only auto-open if the user hasn't closed it before
  if (!localStorage.getItem("profilePopupClosed")) {
    togglePopup("profilePopup");
  }
});

function togglePopup(id) {
  const popup = document.getElementById(id);
  const isOpen = popup.style.display === "block";

  // Close all other popups first
  const popups = document.querySelectorAll(".popup");
  popups.forEach(p => p.style.display = "none");

  // Open this popup if it wasn't already open
  if (!isOpen) {
    popup.style.display = "block";
  }
}

function closePopup(id) {
  const popup = document.getElementById(id);
  popup.style.display = "none";

  // Remember if the profile popup was closed
  if (id === "profilePopup") {
    localStorage.setItem("profilePopupClosed", "true");
  }
}