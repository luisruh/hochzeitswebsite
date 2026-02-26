export function initNavTransitions() {
  const page = document.querySelector("[data-page]");
  if (!page) return;

  const gsap = window.gsap;
  if (!gsap) return;

  // Enter: clip + blur + slight lift
  gsap.set(page, {
    opacity: 0,
    y: 12,
    filter: "blur(10px)",
    clipPath: "inset(10px 10px 10px 10px round 22px)",
  });

  gsap.to(page, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    clipPath: "inset(0px 0px 0px 0px round 0px)",
    duration: 0.65,
    ease: "power3.out",
  });

  const isModified = (e) =>
    e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

  const isExternal = (href) => /^https?:\/\//i.test(href);

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    const go = e.target.closest("[data-go]");
    const href = go?.getAttribute("data-go") || a?.getAttribute("href");
    if (!href) return;

    if (a && isModified(e)) return;
    if (href.startsWith("#")) return;
    if (a && isExternal(href)) return;

    e.preventDefault();

    // Exit: slight zoom + fade + clip
    gsap.to(page, {
      opacity: 0,
      y: -8,
      filter: "blur(10px)",
      clipPath: "inset(14px 14px 14px 14px round 22px)",
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => (window.location.href = href),
    });
  });
}