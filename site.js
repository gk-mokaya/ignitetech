(function () {
  const savedTheme = localStorage.getItem("ignite-theme") || "dark";
  document.documentElement.dataset.theme = savedTheme;

  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("ignite-theme", next);
    });
  }

  const panel = document.querySelector("[data-mobile-panel]");
  const open = document.querySelector("[data-open-menu]");
  const close = document.querySelector("[data-close-menu]");

  if (panel && open && close) {
    const closeMenu = () => panel.classList.remove("is-open");

    open.addEventListener("click", (event) => {
      event.stopPropagation();
      panel.classList.toggle("is-open");
    });
    close.addEventListener("click", closeMenu);
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    panel.addEventListener("click", (event) => event.stopPropagation());
    document.addEventListener("click", closeMenu);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }
})();
