export async function initUI() {
  const gsap = window.gsap;
  if (!gsap) {
    console.error("[wedding] GSAP not loaded");
    return null;
  }

  const isHome = document.body.classList.contains("is-home");
  if (!isHome) return null;

  const reel = document.querySelector("[data-reel]");
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  if (!reel || panels.length === 0) return null;

  const files = [
    "01.jpg", "02.jpg", "03.jpeg", "04.jpeg", "05.jpeg",
    "06.jpg", "07.jpg", "08.jpg", "09.jpg", "10.jpeg",
    "11.jpg", "12.jpg", "13.jpeg", "14.jpeg", "15.jpeg",
    "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpeg",
    "21.jpg", "22.jpeg", "23.jpg", "24.jpg", "25.jpg"
  ];

  reel.innerHTML = "";

  const fragment = document.createDocumentFragment();

  files.forEach((file) => {
    const frame = document.createElement("div");
    frame.className = "frame";

    const img = document.createElement("img");
    img.src = `/assets/img/intro/${file}`;
    img.alt = "";
    img.loading = "eager";
    img.decoding = "async";

    frame.appendChild(img);
    fragment.appendChild(frame);
  });

  reel.appendChild(fragment);

  const frames = Array.from(reel.querySelectorAll(".frame"));
  const images = frames.map((frame) => frame.querySelector("img")).filter(Boolean);

  const setReelX = gsap.quickSetter(reel, "x", "px");
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const updateImageShift = () => {
    const viewportCenter = window.innerWidth / 2;
    const influence = Math.max(window.innerWidth / 2 - 60, 1);

    frames.forEach((frame, index) => {
      const img = images[index];
      if (!img) return;

      const rect = frame.getBoundingClientRect();
      const frameCenter = rect.left + rect.width / 2;
      const relative = clamp((frameCenter - viewportCenter) / influence, -1, 1);
      const x = -50 + (relative * 16);

      img.style.transform = `translateX(${x}%)`;
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

  const waitForImages = (imgs) => {
    return Promise.all(
      imgs.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        });
      })
    );
  };

  await waitForImages(images);

  requestUpdate();

  const start = () => {
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("orientationchange", requestUpdate, { passive: true });

    requestUpdate();
  };

  return { start };
}