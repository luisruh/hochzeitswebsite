export function initUI() {
  const gsap = window.gsap;
  if (!gsap) {
    console.error("[wedding] GSAP not loaded");
    return;
  }

  const isHome = document.body.classList.contains("is-home");
  if (!isHome) return;

  const reel = document.querySelector("[data-reel]");
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  if (!reel || panels.length === 0) return;

  const files = ["01.jpeg","02.jpeg","03.jpg","04.jpeg","05.jpg","06.jpg","07.jpg","08.jpg","09.jpg","10.jpg"];
  const urls = files.map(f => `/assets/img/intro/${f}`).slice(0, 10);

  reel.innerHTML = "";
  urls.forEach((src) => {
    const fr = document.createElement("div");
    fr.className = "frame";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";

    fr.appendChild(img);
    reel.appendChild(fr);
  });

  const setX = gsap.quickSetter(reel, "x", "px");

  const getStep = () => {
    const first = reel.querySelector(".frame");
    if (!first) return 0;
    const gap = 12;
    return first.getBoundingClientRect().width + gap;
  };

  const updateReel = () => {
    const frames = reel.querySelectorAll(".frame");
    const frameCount = frames.length;
    if (!frameCount || !panels.length) return;

    const firstPanel = panels[0];
    const lastPanel = panels[panels.length - 1];

    const start = firstPanel.offsetTop;
    const end = lastPanel.offsetTop + lastPanel.offsetHeight - window.innerHeight;

    const rawProgress = (window.scrollY - start) / Math.max(1, end - start);
    const progress = Math.max(0, Math.min(1, rawProgress));

    const maxX = Math.max(0, (frameCount - 1) * getStep());
    setX(-progress * maxX);
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateReel();
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  updateReel();
}