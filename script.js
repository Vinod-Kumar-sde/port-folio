const revealItems = document.querySelectorAll(".reveal");
const staggerGroups = document.querySelectorAll(".stagger-group");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeToggle = document.querySelector(".theme-toggle");
const THEME_KEY = "vinod-portfolio-theme";

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    const label = themeToggle.querySelector(".theme-toggle-label");
    if (label) {
      label.textContent = isDark ? "Light mode" : "Dark mode";
    }
  }
};

const savedTheme = localStorage.getItem(THEME_KEY);
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((item, index) => {
    if (item.classList.contains("reveal")) {
      item.style.transitionDelay = `${index * 110}ms`;
    }
  });
});

if (!prefersReducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item, index) => {
    if (!item.style.transitionDelay) {
      item.style.transitionDelay = `${index * 45}ms`;
    }
    observer.observe(item);
  });

  const updateParallax = () => {
    const viewportHeight = window.innerHeight;

    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const speed = Number(item.dataset.parallaxSpeed || 0.08);
      const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
      const offset = progress * speed * -160;
      item.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
    });
  };

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateParallax);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
