const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-form]");
const note = document.querySelector("[data-form-note]");

document.body.classList.add("is-ready");

const updateHeader = () => {
  if (!header) return;
  const shouldStaySolid = document.body.classList.contains("policy-page");
  header.classList.toggle("is-scrolled", shouldStaySolid || window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

if (nav && header && toggle) {
  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });
}

const animatedItems = document.querySelectorAll(
  ".trust-grid > div, .section-heading, .service-card, .image-panel, .split-copy, .safeguards-grid article, .resource-links, .process-grid article, .testimonial-inner > *, .faq-grid > *, .contact-copy, .referral-form"
);

animatedItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-index", String(index % 4));
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -50px 0px" }
  );

  animatedItems.forEach((item) => revealObserver.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
}

const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canTilt) {
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

      card.style.setProperty("--tilt-x", `${x.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${y.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

if (form && note) {
  form.addEventListener("submit", () => {
    if (!form.checkValidity()) {
      return;
    }

    note.textContent = "Thanks. Your enquiry is being sent securely to Lead Community Services.";
  });
}
