export function initNavTransitions() {
  const page = document.querySelector("[data-page]");
  const gsap = window.gsap;
  if (!page || !gsap) return;

  gsap.fromTo(page, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });

  const isModified = (e) =>
    e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (/^https?:\/\//i.test(href)) return;
    if (isModified(e)) return;

    e.preventDefault();
    gsap.to(page, {
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => (window.location.href = href),
    });
  });
}