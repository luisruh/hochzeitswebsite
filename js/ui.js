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

  const files = [
    "01.jpg","02.jpg","03.jpeg","04.jpeg","05.jpeg","06.jpg","07.jpg","08.jpg","09.jpg",
    "10.jpeg","11.jpg","12.jpg","13.jpeg","14.jpeg","15.jpeg","16.jpg","17.jpg","18.jpg",
    "19.jpg","20.jpeg","21.jpg","22.jpeg","23.jpg","24.jpg","25.jpg"
  ];

  reel.innerHTML = "";

  files.forEach((file) => {
    const fr = document.createElement("div");
    fr.className = "frame";

    const img = document.createElement("img");
    img.src = `/assets/img/intro/${file}`;
    img.alt = "";

    fr.appendChild(img);
    reel.appendChild(fr);
  });

  const frames = Array.from(reel.querySelectorAll(".frame"));
  const images = frames.map(frame => frame.querySelector("img"));

  const setReelX = gsap.quickSetter(reel, "x", "px");
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const updateImageShift = () => {
    const viewportCenter = window.innerWidth / 2;
    const influence = Math.max(window.innerWidth / 2 - 60, 1);

    frames.forEach((frame, index) => {
      const rect = frame.getBoundingClientRect();
      const frameCenter = rect.left + rect.width / 2;
      const relative = clamp((frameCenter - viewportCenter) / influence, -1, 1);
      const x = -50 + (relative * 16);
      images[index].style.transform = `translateX(${x}%)`;
    });
  };

  const updateReel = () => {
    const start = panels[0].offsetTop;
    const end = Math.max(document.documentElement.scrollHeight - window.innerHeight, start + 1);
    const distance = Math.max(end - start, 1);

    const rawProgress = (window.scrollY - start) / distance;
    const progress = clamp(rawProgress, 0, 1);

    const maxX = Math.max(0, reel.scrollWidth - window.innerWidth);
    setReelX(-progress * maxX);

    updateImageShift();
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

  images.forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", requestUpdate, { passive: true });
      img.addEventListener("error", requestUpdate, { passive: true });
    }
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("orientationchange", requestUpdate, { passive: true });

  updateReel();
}