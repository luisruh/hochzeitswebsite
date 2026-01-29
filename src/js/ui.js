import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initUI() {
  // Läuft nach jedem Page-Load erneut (weil Router HTML tauscht)
  // -> wir initialisieren nur, wenn Umschlag da ist
  const initEnvelopeScroll = () => {
    const env = document.getElementById("envelope");
    const flap = document.getElementById("flap");
    const letter = document.getElementById("letter");

    if (!env || !flap || !letter) return;

    // Doppelte Trigger vermeiden, falls du zurück navigierst
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Optional: sicherstellen, dass nichts “scrollt” außer der Trigger
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      onComplete: () => {
        // Scroll wieder erlauben (optional)
        document.body.style.overflow = "";
        history.pushState(null, "", "/home");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    });

    // Timeline: Klappe auf -> Brief raus -> Zoom rein -> Fade
    tl.to(flap, { rotateX: 155, transformOrigin: "50% 20%", duration: 0.35 })
      .to(letter, { y: -90, duration: 0.55 }, 0.10)
      .to(env, { scale: 1.35, duration: 0.65 }, 0.15)
      .to(env, { scale: 2.6, duration: 0.55 }, 0.55)
      .to(env, { opacity: 0, duration: 0.25 }, 0.95);

    ScrollTrigger.create({
      trigger: env,
      start: "top top",
      end: "+=900",        // Scroll-Länge der Animation (kannst du später feinjustieren)
      pin: true,           // Umschlag bleibt stehen
      scrub: true,         // Scroll steuert Fortschritt
      animation: tl
    });
  };

  // Beim initialen Laden
  initEnvelopeScroll();

  // Wenn Router Seiten nachlädt: nach jedem Popstate/Pushstate erneut checken
  window.addEventListener("popstate", () => setTimeout(initEnvelopeScroll, 0));
}
