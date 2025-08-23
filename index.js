const powerBtn = document.getElementById("powerButton");
const img = powerBtn.querySelector(".power-symbol");
const screenOff = document.getElementById("screenOff");

powerBtn.addEventListener("click", () => {
  if (powerBtn.classList.contains("active")) {
    // Turn OFF
    powerBtn.classList.remove("active");
    img.src = "/assets/power_inactive.png";
    screenOff.classList.add("active");
  } else {
    // Turn ON
    powerBtn.classList.add("active");
    img.src = "/assets/power_active.png";
    screenOff.classList.remove("active");
  }
});

// keep correct image after mouse release
powerBtn.addEventListener("mouseup", () => {
  img.src = powerBtn.classList.contains("active")
            ? "/assets/power_active.png"
            : "/assets/power_inactive.png";
});

const loginBtn = document.getElementById("signinBtn");
  loginBtn.addEventListener("click", () => {
    window.location.href = "/computer.html";
});