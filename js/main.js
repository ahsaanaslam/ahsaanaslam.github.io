/* ============================================================
   Ahsaan Aslam — Portfolio interactions
   Powered by Motion (motion.dev) vendored at js/vendor/motion.min.js
   Respects prefers-reduced-motion. Degrades gracefully without JS.
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var M = window.Motion || null; // { animate, inView, stagger, ... }

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Preloader cleanup ---------- */
  var preloader = document.getElementById("preloader");
  if (preloader) {
    // CSS animates it out; remove it from the DOM once done.
    window.setTimeout(function () {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, reducedMotion ? 0 : 2000);
  }

  /* ---------- Nav: scrolled state + progress bar ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      if (nav) nav.classList.toggle("is-scrolled", y > 24);
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
    if (!menu || !toggle) return;
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

  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  if (reducedMotion) {
    revealAll();
  } else if (M) {
    revealEls.forEach(function (el) {
      M.inView(
        el,
        function (target) { target.classList.add("in-view"); },
        { amount: 0.12 }
      );
    });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealAll();
  }

  /* ---------- Animated counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll(".stat-num[data-count]"));

  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reducedMotion || !M) {
      el.textContent = String(target);
      return;
    }
    el.textContent = "0";
    M.inView(el, function () {
      M.animate(0, target, {
        duration: 1.4,
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: function (v) { el.textContent = String(Math.round(v)); }
      });
    }, { amount: 1 });
  });

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

  /* ---------- Custom cursor (fine pointers, motion allowed) ---------- */
  var cursor = document.getElementById("cursor");
  var cursorDot = document.getElementById("cursorDot");
  var cursorRing = document.getElementById("cursorRing");

  if (cursor && cursorDot && cursorRing && finePointer && !reducedMotion) {
    var mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener("pointermove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = "translate(" + mx + "px," + my + "px)";
    }, { passive: true });

    (function ringLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursorRing.style.transform = "translate(" + rx + "px," + ry + "px)";
      window.requestAnimationFrame(ringLoop);
    })();

    var hoverSelector = "a, button, [data-magnetic], .collab-card, .it-card, .skill-card, .web-card";
    document.addEventListener("pointerover", function (e) {
      if (e.target.closest(hoverSelector)) cursor.classList.add("is-hover");
    });
    document.addEventListener("pointerout", function (e) {
      if (e.target.closest(hoverSelector)) cursor.classList.remove("is-hover");
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reducedMotion && M) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-magnetic]"), function (el) {
      var strength = 0.3;

      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        var dx = (e.clientX - rect.left - rect.width / 2) * strength;
        var dy = (e.clientY - rect.top - rect.height / 2) * strength;
        el.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      });

      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
        M.animate(
          el,
          { transform: "translate(0px, 0px)" },
          { type: "spring", stiffness: 260, damping: 18 }
        );
      });
    });
  }

  /* ---------- Tilt on project mockups & portrait ---------- */
  if (finePointer && !reducedMotion) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-tilt]"), function (el) {
      var maxTilt = 6;

      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform =
          "perspective(900px) rotateX(" + (-py * maxTilt).toFixed(2) + "deg) rotateY(" +
          (px * maxTilt).toFixed(2) + "deg)";
      });

      el.addEventListener("pointerleave", function () {
        el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        window.setTimeout(function () { el.style.transition = ""; }, 500);
      });
    });
  }

  /* ---------- ERP card expandable details ---------- */
  document.querySelectorAll(".erp-card__more").forEach(function (btn) {
    var detail = btn.nextElementSibling;
    if (!detail) return;
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      btn.querySelector("span").textContent = expanded ? "Project details" : "Hide details";

      if (expanded) {
        detail.hidden = true;
      } else {
        detail.hidden = false;
        if (M && !reducedMotion) {
          M.animate(
            detail,
            { opacity: [0, 1], transform: ["translateY(-8px)", "translateY(0px)"] },
            { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
          );
        }
      }
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
