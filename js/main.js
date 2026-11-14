/* ============================================================
   Ahsaan Aslam — Portfolio interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Nav: scrolled state + progress bar ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      nav.classList.toggle("is-scrolled", y > 24);
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = max > 0 ? (y / max) * 100 + "%" : "0%";
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll-triggered reveals ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    // Stagger siblings inside grid/list containers for a cascading entrance.
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) return;
      var siblings = Array.prototype.filter.call(parent.children, function (c) {
        return c.classList && c.classList.contains("reveal");
      });
      if (siblings.length > 1) {
        el.style.setProperty("--stagger", (siblings.indexOf(el) * 0.08).toFixed(2) + "s");
      }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Active nav link highlighting ---------- */
  var sectionIds = ["about", "experience", "projects", "skills", "education", "contact"];
  var navLinks = {};
  sectionIds.forEach(function (id) {
    var link = document.querySelector('.nav__link[href="#' + id + '"]');
    if (link) navLinks[id] = link;
  });
  // Sections without their own nav item highlight the nearest logical parent.
  var sectionAlias = { collab: "projects", web: "projects", it: "skills", achievements: "education" };

  if ("IntersectionObserver" in window) {
    var current = null;
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        var target = navLinks[id] ? id : sectionAlias[id];
        if (!target || target === current) return;
        current = target;
        Object.keys(navLinks).forEach(function (key) {
          navLinks[key].classList.toggle("is-active", key === target);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sectionIds.concat(Object.keys(sectionAlias)).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navIo.observe(el);
    });
  }

  /* ---------- ERP card expandable details ---------- */
  document.querySelectorAll(".erp-card__more").forEach(function (btn) {
    var detail = btn.nextElementSibling;
    if (!detail) return;
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      detail.hidden = expanded;
      btn.querySelector("span").textContent = expanded ? "Project details" : "Hide details";
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form && status) {
    var configured = form.action.indexOf("YOUR_FORM_ID") === -1;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = "Please fill in your name, a valid email, and a message.";
        status.className = "contact-form__status is-error";
        var firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (!configured) {
        status.textContent =
          "The contact form isn't connected to a sending service yet — please reach out via GitHub instead.";
        status.className = "contact-form__status is-error";
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = "Sending…";
      status.className = "contact-form__status";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
            status.className = "contact-form__status is-success";
          } else {
            throw new Error("Request failed");
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong sending your message. Please try again or reach me on GitHub.";
          status.className = "contact-form__status is-error";
        })
        .then(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
