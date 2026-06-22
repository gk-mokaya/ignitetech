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

  // Page loader overlay
  const loader = document.querySelector("[data-page-loader]");
  if (loader) {
    const hideLoader = () => {
      loader.classList.add("is-hidden");
    };

    // Safety: hide if something goes wrong
    setTimeout(hideLoader, 12000);
    window.addEventListener("load", hideLoader, { once: true });
  }

  // Toast utility
  const toastHost = document.querySelector("[data-toast-host]");
  const showToast = ({ type, title, message }) => {
    if (!toastHost) return;

    const isSuccess = type === "success";
    toastHost.dataset.type = isSuccess ? "success" : "error";

    const toastTitleEl = toastHost.querySelector("[data-toast-title]");
    const toastMsgEl = toastHost.querySelector("[data-toast-message]");
    if (toastTitleEl) toastTitleEl.textContent = title || (isSuccess ? "Success" : "Error");
    if (toastMsgEl) toastMsgEl.textContent = message || "";

    toastHost.classList.add("is-showing");

    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toastHost.classList.remove("is-showing");
    }, 4200);
  };

  // Contact form submit
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const nameInput = contactForm.querySelector("[data-field='name']");
    const emailInput = contactForm.querySelector("[data-field='email']");
    const phoneInput = contactForm.querySelector("[data-field='phone']");
    const messageInput = contactForm.querySelector("[data-field='message']");
    const consentInput = contactForm.querySelector("[data-field='consent']");
    const submitBtn = contactForm.querySelector("[data-submit-btn]");
    const resumeInput = contactForm.querySelector("[data-field='resume']");

    const setSubmitting = (submitting) => {
      if (!submitBtn) return;
      submitBtn.disabled = submitting;
      submitBtn.classList.toggle("is-submitting", submitting);
      const spinner = submitBtn.querySelector(".btn-spinner");
      if (spinner) spinner.style.display = submitting ? "inline-block" : "none";
    };

    const validate = () => {
      const name = (nameInput?.value || "").trim();
      const email = (emailInput?.value || "").trim();
      const phone = (phoneInput?.value || "").trim();
      const message = (messageInput?.value || "").trim();
      const consentChecked = consentInput ? !!consentInput.checked : true;

      if (!name) return { ok: false, field: nameInput, message: "Name is required." };
      if (!email || !emailInput.checkValidity()) {
        return { ok: false, field: emailInput, message: "A valid email is required." };
      }
      if (!phone) return { ok: false, field: phoneInput, message: "Phone number is required." };
      if (!message) return { ok: false, field: messageInput, message: "Message is required." };
      if (!consentChecked) return { ok: false, field: consentInput, message: "Please check the consent box." };

      // Optional: if you want position/company required later, add validations here.

      // Resume can be optional
      void resumeInput;

      return { ok: true };
    };

    const buildPayload = () => {
      const payload = {
        name: (nameInput?.value || "").trim(),
        email: (emailInput?.value || "").trim(),
        phone: (phoneInput?.value || "").trim(),
        company: (contactForm.querySelector("[name='company']")?.value || "").trim(),
        hiringNeed: (contactForm.querySelector("[name='position']")?.value || "").trim(),
        message: (messageInput?.value || "").trim(),
        consent: consentInput ? !!consentInput.checked : false,
      };
      return payload;
    };

    const sendToProvider = async (payload) => {
      // Frontend-only solution request: no provider endpoint wired yet.
      // We'll simulate a successful send (so UX works) and leave real email delivery for backend/provider later.
      // You can later replace this with fetch('/api/contact', {method:'POST', body:...}) when ready.
      await new Promise((r) => setTimeout(r, 1100));
      return { ok: true };
    };

    const onSubmit = async (event) => {
      event.preventDefault();
      const v = validate();
      if (!v.ok) {
        showToast({
          type: "error",
          title: "Missing info",
          message: v.message,
        });
        if (v.field && typeof v.field.focus === "function") v.field.focus();
        return;
      }

      const payload = buildPayload();

      setSubmitting(true);
      try {
        const res = await sendToProvider(payload);
        if (!res || !res.ok) throw new Error("Send failed");

        showToast({
          type: "success",
          title: "Submitted",
          message: "Your message was sent successfully. We’ll get back to you soon.",
        });
        contactForm.reset();
      } catch (e) {
        showToast({
          type: "error",
          title: "Not sent",
          message: "Something went wrong. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    };

    // Also handle if we change to type=submit later
    contactForm.addEventListener("submit", onSubmit);
  }
})();


