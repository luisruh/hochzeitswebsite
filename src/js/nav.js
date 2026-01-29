const routes = {
  "/": "/pages/envelope.html",
  "/home": "/pages/home.html"
};

async function loadPage(path) {
  const file = routes[path] || routes["/"];
  const res = await fetch(file);
  const html = await res.text();
  document.querySelector("#app").innerHTML = html;
}

export function mountRouter() {
  window.addEventListener("popstate", () => {
    loadPage(location.pathname);
  });

  loadPage(location.pathname);
}
