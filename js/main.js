import { initUI } from "/js/ui.js";

function startIntro() {
  const transition = document.querySelector("[data-transition]");
  const shutters = transition ? Array.from(transition.querySelectorAll(".shutter")) : [];
  const welcomeMessage = document.getElementById("welcomeMessage");

  setTimeout(() => {
    if (welcomeMessage) {
      welcomeMessage.classList.add("is-hidden");
    }
  }, 3500);

  setTimeout(() => {
    shutters.forEach((shutter, i) => {
      setTimeout(() => {
        shutter.style.transform = "translateY(-100%)";
      }, i * 180);
    });
  }, 4000);

  setTimeout(() => {
    if (transition) {
      transition.remove();
    }
  }, 6000);
}

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      startIntro();

      setTimeout(() => {
        initUI();
      }, 1600);
    });
  });
});

function updateCountdown() {
  const weddingDate = new Date("2027-08-21T00:00:00").getTime();
  const now = Date.now();
  const diff = weddingDate - now;

  if (diff <= 0) return;

  document.getElementById("days").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("hours").textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("minutes").textContent = Math.floor((diff / 1000 / 60) % 60);
  document.getElementById("seconds").textContent = Math.floor((diff / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);