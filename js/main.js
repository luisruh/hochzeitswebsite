import { initUI } from "/js/ui.js";

function startIntro() {
  const transition = document.querySelector("[data-transition]");
  const shutters = transition ? Array.from(transition.querySelectorAll(".shutter")) : [];
  const welcomeMessage = document.getElementById("welcomeMessage");

  setTimeout(() => {
    if (welcomeMessage) {
      welcomeMessage.classList.add("is-hidden");
    }
  }, 4000);

  setTimeout(() => {
    shutters.forEach((shutter, i) => {
      setTimeout(() => {
        shutter.style.transform = "translateY(-100%)";
      }, i * 250);
    });
  }, 4100);

  setTimeout(() => {
    if (transition) {
      transition.remove();
    }
  }, 7000);
}

window.addEventListener("load", async () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(async () => {
      const ui = await initUI();
      startIntro();

      if (ui && typeof ui.start === "function") {
        ui.start();
      }
    });
  });
});

function updateCountdown() {
  const weddingDate = new Date("2027-08-21T00:00:00").getTime();
  const now = Date.now();
  const diff = weddingDate - now;

  if (diff <= 0) return;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  hoursEl.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutesEl.textContent = Math.floor((diff / 1000 / 60) % 60);
  secondsEl.textContent = Math.floor((diff / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);