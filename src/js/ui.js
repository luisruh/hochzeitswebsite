export function initUI() {
  const gsap = window.gsap;
  if (!gsap) return;

  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  const ScrollTrigger = window.ScrollTrigger;
  if (!ScrollTrigger) return;

  // --- Scroll reveals (soft) ---
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 16, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // --- Horizontal Gallery pinned (pin the whole hero incl. text) ---
  const hero = document.querySelector("[data-hero]");
  const heroMedia = document.querySelector(".heroMedia");
  const gallery = document.querySelector("[data-hgallery]");
  const track = document.querySelector("[data-htrack]");
  const shade = document.querySelector(".heroShade");

  // Important: hero is required now
  if (!(hero && heroMedia && gallery && track)) return;

  const files = [
    "01.jpeg","02.jpeg","03.jpg","04.jpeg","05.jpg",
    "06.jpg","07.jpg","08.jpg","09.jpg","10.jpg"
  ];
  const urls = files.map((f) => `/assets/img/intro/${f}`);

  // Build DOM once (HMR-safe)
  track.innerHTML = "";
  const imgs = [];

  urls.forEach((src) => {
    const item = document.createElement("div");
    item.className = "hItem";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";

    item.appendChild(img);
    track.appendChild(item);
    imgs.push(img);
  });

  const waitImages = () =>
    Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) return resolve();
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          })
      )
    );

  let hTrigger = null;
  let hTween = null;
  let shadeTween = null;

  const build = () => {
    // kill previous
    if (hTrigger) hTrigger.kill();
    if (hTween) hTween.kill();
    if (shadeTween) shadeTween.kill();

    // reset
    gsap.set(track, { x: 0 });

const maxX = track.scrollWidth - gallery.clientWidth;
if (maxX <= 0) return;

const endDistance = Math.round(maxX + 120);

hTween = gsap.to(track, { x: -maxX, ease: "none", paused: true });

hTrigger = ScrollTrigger.create({
  id: "H_GALLERY",
  trigger: hero,
  start: "top top",
  end: `+=${endDistance}`,
  pin: true,
  pinReparent: true,
  pinSpacing: true,
  scrub: true,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  animation: hTween,


});

    if (shade) {
      shadeTween = gsap.fromTo(
        shade,
        { opacity: 1 },
        { opacity: 0.7, ease: "none", paused: true }
      );

      ScrollTrigger.create({
        id: "H_SHADE",
        trigger: hero,
        start: "top top+=0",
        end: `+=${endDistance}`,
        scrub: true,
        animation: shadeTween,
        invalidateOnRefresh: true,
      });
    }
  };

  const buildAll = async () => {
    await waitImages();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        build();
        ScrollTrigger.refresh();
      });
    });
  };

  buildAll();

  // Debounced resize
  let t = null;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      build();
      ScrollTrigger.refresh();
    }, 200);
  });
}
