import { initUI } from "./ui.js";

initUI();

const transition = document.querySelector("[data-transition]");
const shutters = transition ? Array.from(transition.querySelectorAll(".shutter")) : [];
const welcomeMessage = document.getElementById("welcomeMessage");

setTimeout(() => {
  if (welcomeMessage) {
    welcomeMessage.classList.add("is-hidden");
  }
}, 2500);

setTimeout(() => {
  shutters.forEach((shutter, i) => {
    setTimeout(() => {
      shutter.style.transform = "translateY(-100%)";
    }, i * 180);
  });
}, 3000);

setTimeout(() => {
  if (transition) {
    transition.remove();
  }
}, 5000);