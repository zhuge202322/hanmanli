const articleBody = document.querySelector("#articleBody");
const toggleArticle = document.querySelector("#toggleArticle");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const topNav = document.querySelector(".top-nav");

if (siteHeader && navToggle && topNav) {
  const setNavOpen = (open) => {
    siteHeader.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  };

  navToggle.addEventListener("click", () => {
    setNavOpen(!siteHeader.classList.contains("nav-open"));
  });

  topNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });
}

if (articleBody && toggleArticle) {
  toggleArticle.addEventListener("click", () => {
    const expanded = articleBody.classList.toggle("expanded");
    toggleArticle.textContent = expanded ? "收起文章" : "展开阅读全文";
    toggleArticle.setAttribute("aria-expanded", String(expanded));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const mobileCta = document.querySelector(".mobile-cta");

if (mobileCta) {
  const syncMobileCta = () => {
    mobileCta.classList.toggle("is-visible", window.scrollY > 280);
  };

  syncMobileCta();
  window.addEventListener("scroll", syncMobileCta, { passive: true });
}

const certificateGridTargets = document.querySelectorAll("[data-cert-group]");

if (certificateGridTargets.length && window.certificateGroups) {
  const formatCard = (item) => {
    const visual = item.thumb
      ? `<img src="${item.thumb}" alt="${item.title}" decoding="async" />`
      : `<div class="cert-placeholder"><strong>${item.date || "原件"}</strong><span>PDF 原件</span></div>`;
    const badge = item.collection ? '<em class="cert-badge">合集</em>' : "";
    return `
      <article class="certificate-card">
        <a class="cert-visual" href="${item.file}" target="_blank" rel="noopener">
          ${visual}
        </a>
        <div class="cert-meta">
          <span>${item.date || "资料"}</span>
          ${badge}
          <h3>${item.title}</h3>
          <p>${item.sourceName}</p>
          <a href="${item.file}" target="_blank" rel="noopener">查看原件</a>
        </div>
      </article>
    `;
  };

  certificateGridTargets.forEach((target) => {
    const group = window.certificateGroups.find(
      (entry) => entry.id === target.dataset.certGroup,
    );
    if (!group) return;
    target.innerHTML = group.items.map(formatCard).join("");
  });
}

const lawyerPanel = document.querySelector("#lawyerProfile");
const lawyerTabs = document.querySelectorAll("[data-lawyer]");

if (lawyerPanel && lawyerTabs.length && window.teamLawyers) {
  const renderLawyer = (id) => {
    const lawyer = window.teamLawyers[id];
    if (!lawyer) return;

    const portrait = lawyer.image
      ? `<img src="${lawyer.image}" alt="${lawyer.name}" style="object-position:${lawyer.center || "center"}" />`
      : `<div class="lawyer-initials">${lawyer.initials || lawyer.name.slice(0, 1)}</div>`;

    lawyerPanel.innerHTML = `
      <div class="lawyer-visual">${portrait}</div>
      <div class="lawyer-detail">
        <p class="eyebrow">${lawyer.title}</p>
        <h2>${lawyer.name}</h2>
        <p class="lawyer-summary">${lawyer.summary}</p>
        <div class="lawyer-tags">
          ${lawyer.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <dl class="lawyer-facts">
          ${lawyer.facts
            .map(
              ([label, value]) => `
                <div>
                  <dt>${label}</dt>
                  <dd>${value}</dd>
                </div>
              `,
            )
            .join("")}
        </dl>
        <div class="lawyer-sections">
          ${lawyer.sections
            .map(
              (section) => `
                <section>
                  <h3>${section.heading}</h3>
                  <ul>
                    ${section.items.map((item) => `<li>${item}</li>`).join("")}
                  </ul>
                </section>
              `,
            )
            .join("")}
        </div>
        <div class="hero-actions lawyer-actions">
          ${lawyer.actions
            .map(
              ([text, href], index) =>
                `<a class="btn ${index === 0 ? "primary" : "ghost dark"}" href="${href}">${text}</a>`,
            )
            .join("")}
        </div>
      </div>
    `;
  };

  lawyerTabs.forEach((tabButton) => {
    tabButton.addEventListener("click", () => {
      lawyerTabs.forEach((button) => {
        const active = button === tabButton;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      renderLawyer(tabButton.dataset.lawyer);
      if (window.animateLawyerPanel) window.animateLawyerPanel();
    });
  });

  renderLawyer(document.querySelector("[data-lawyer].is-active")?.dataset.lawyer || "han");
}

// --- GSAP Animations ---
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section
  if (document.querySelector(".hero-copy")) {
    gsap.to(".hero-copy > *", {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2
    });
  }

  // Sub Hero Sections
  if (document.querySelector(".sub-hero")) {
    gsap.to(".sub-hero > *", {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2
    });
  }

  // Service Cards
  gsap.utils.toArray(".service-card").forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: "top 85%" },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // Featured Article
  if (document.querySelector(".featured-article")) {
    gsap.to(".featured-article", {
      scrollTrigger: { trigger: ".featured-article", start: "top 85%" },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  }

  // Profile Image & Copy
  if (document.querySelector(".profile-image") && document.querySelector(".profile-copy")) {
    gsap.to(".profile-image", {
      scrollTrigger: { trigger: ".profile-card", start: "top 80%" },
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    });
    gsap.to(".profile-copy", {
      scrollTrigger: { trigger: ".profile-card", start: "top 80%" },
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    });
  }

  // General Article Blocks (Grid)
  gsap.utils.toArray(".case-grid article, .detail-grid article, .audience-grid article, .process-list article, .summary-grid article, .private-map article, .certificate-card").forEach((item) => {
    gsap.to(item, {
      scrollTrigger: { trigger: item, start: "top 90%" },
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  // Timelines
  gsap.utils.toArray(".timeline div").forEach((item) => {
    gsap.to(item, {
      scrollTrigger: { trigger: item, start: "top 90%" },
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  // Credential Layout
  if (document.querySelector(".credential-layout img") && document.querySelector(".credential-list")) {
    gsap.to(".credential-layout img", {
      scrollTrigger: { trigger: ".credential-layout", start: "top 80%" },
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    });
    gsap.to(".credential-list", {
      scrollTrigger: { trigger: ".credential-layout", start: "top 80%" },
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    });
  }

  // Team Members
  gsap.utils.toArray(".team-member").forEach((member) => {
    gsap.to(member, {
      scrollTrigger: { trigger: member, start: "top 90%" },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // Lawyer Details Panel (when switching tabs)
  window.animateLawyerPanel = () => {
    gsap.fromTo(".lawyer-visual", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".lawyer-detail", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
  };

  // Trigger initial animation for the lawyer panel if it exists
  if (document.querySelector(".lawyer-visual")) {
    window.animateLawyerPanel();
  }
}
