function togglePopup() {
  const popup = document.getElementById("popup");
  if (popup.style.display === "block") {
    popup.style.display = "none"; // hide
  } else {
    popup.style.display = "block"; // show
  }
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
}