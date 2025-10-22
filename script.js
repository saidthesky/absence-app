// Portfolio interactions: theme toggle, mobile nav, copy, print

(function initPortfolio() {
  // Init year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Init theme
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = storedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  // Listen for system changes if user hasn't explicitly chosen
  if (!storedTheme && window.matchMedia) {
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        root.setAttribute("data-theme", e.matches ? "dark" : "light");
      });
    } catch (_) {
      // older browsers
      window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
        root.setAttribute("data-theme", e.matches ? "dark" : "light");
      });
    }
  }

  // Close mobile menu when clicking a link
  const navMenu = document.getElementById("navMenu");
  if (navMenu) {
    navMenu.addEventListener("click", (ev) => {
      const target = ev.target;
      if (target && target.tagName === "A" && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        const toggleBtn = document.querySelector(".nav-toggle");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
})();

// Expose functions globally for inline handlers
window.toggleTheme = function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};

window.toggleNav = function toggleNav() {
  const navMenu = document.getElementById("navMenu");
  const btn = document.querySelector(".nav-toggle");
  if (!navMenu || !btn) return;
  const open = navMenu.classList.toggle("open");
  btn.setAttribute("aria-expanded", open ? "true" : "false");
};

window.copyEmail = async function copyEmail() {
  const email = "rofizaidan05@gmail.com";
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(email);
    } else {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    alert("Email copied to clipboard");
  } catch (err) {
    alert("Failed to copy. Please copy manually.");
  }
};

window.printResume = function printResume() {
  window.print();
};