// ========================================
// Contact Form - Validation & Submission
// ========================================

// --- Validation Functions ---

function validateRequired(value) {
  return String(value || "").trim().length > 0;
}

function validateEmail(value) {
  const v = String(value || "").trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validatePhone(value) {
  const v = String(value || "").trim();
  if (!v) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && /^[0-9\s()\-\+]+$/.test(v);
}

function validateMinLength(value, min) {
  return String(value || "").trim().length >= min;
}

function validateMaxLength(value, max) {
  return String(value || "").trim().length <= max;
}

// --- Security / Anti-spam Helpers ---

/**
 * Remove all HTML tags from a string and trim surrounding whitespace.
 * Handles nested, self-closing, and attribute-bearing tags (Property 6 /
 * Requirement 10.5). Pure function — safe to unit/property test.
 *
 * @param {string} str - the raw input value.
 * @returns {string} the input with every `<...>` sequence removed and trimmed.
 */
function stripHtml(str) {
  return String(str == null ? "" : str).replace(/<[^>]*>/g, "").trim();
}

/**
 * Detect whether the honeypot field was filled. A non-empty honeypot value
 * signals an automated (bot) submission (Property 7 / Requirement 10.3).
 * Pure function w.r.t. the passed form element — safe to test.
 *
 * @param {HTMLElement} form - the contact form element.
 * @returns {boolean} true when the honeypot field has a non-empty value.
 */
function checkHoneypot(form) {
  if (!form || typeof form.querySelector !== "function") return false;
  const hp = form.querySelector('[data-honeypot], [name="website"]');
  return !!(hp && String(hp.value || "").length > 0);
}

/**
 * Parse UTM query parameters from the current URL and populate the matching
 * hidden form fields. Absent parameters result in an empty string
 * (Requirements 9.6, 9.7). Called on DOMContentLoaded.
 */
function populateUTMFields() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign"].forEach((key) => {
    const field = document.querySelector(`[name="${key}"]`);
    if (field) field.value = params.get(key) || "";
  });
}

/**
 * Parse 'service' or 'servico' query parameter from the current URL and
 * select the matching option in the service-type dropdown (OP-04).
 */
function populateServiceSelection() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const rawService = params.get("service") || params.get("servico") || "";
  if (!rawService) return;

  const select = document.querySelector("#service-type");
  if (!select) return;

  const val = rawService.toLowerCase().trim();
  const serviceMap = {
    "apartamentos": "Apartamentos na planta",
    "condominios": "Condomínios residenciais",
    "infra": "Infraestrutura e pré-instalação",
    "residencia": "Residencial e comercial",
    "residencial": "Residencial e comercial",
    "vrf": "Sistemas VRF / VRV",
    "manutencao": "Manutenção e suporte técnico",
    "outro": "Outro assunto"
  };

  const targetOptionValue = serviceMap[val] || Array.from(select.options).find((opt) => 
    opt.value.toLowerCase().includes(val) || val.includes(opt.value.toLowerCase())
  )?.value;

  if (targetOptionValue) {
    select.value = targetOptionValue;
    select.dispatchEvent(new Event("change"));
  }
}

// --- Field Error Management ---

function setFieldError(field, message) {
  const wrap = field.closest("[data-field]");
  if (!wrap) return;
  const errorEl = wrap.querySelector("[data-error]");

  if (message) {
    // Show error state
    field.classList.add("border-red-600");
    field.classList.remove("border-gray-300", "border-green-500");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("opacity-0");
      errorEl.classList.add("opacity-100");
    }
  } else {
    // Show success state
    field.classList.remove("border-red-600", "border-gray-300");
    field.classList.add("border-green-500");
    if (errorEl) {
      errorEl.classList.remove("opacity-100");
      errorEl.classList.add("opacity-0");
      // Clear text after fade out
      setTimeout(() => {
        if (errorEl.classList.contains("opacity-0")) {
          errorEl.textContent = "";
        }
      }, 200);
    }
  }
}

function clearFieldState(field) {
  const wrap = field.closest("[data-field]");
  if (!wrap) return;
  const errorEl = wrap.querySelector("[data-error]");

  field.classList.remove("border-red-600", "border-green-500");
  field.classList.add("border-gray-300");
  if (errorEl) {
    errorEl.classList.remove("opacity-100");
    errorEl.classList.add("opacity-0");
    errorEl.textContent = "";
  }
}

function clearAllFields(form) {
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    clearFieldState(field);
  });
}

// --- Field Validation on Blur ---

function validateField(field) {
  const name = field.getAttribute("name") || field.id;
  const value = field.value;

  switch (name) {
    case "name":
      if (!validateRequired(value)) {
        setFieldError(field, "Informe seu nome.");
        return false;
      }
      if (!validateMinLength(value, 2)) {
        setFieldError(field, "O nome deve ter pelo menos 2 caracteres.");
        return false;
      }
      if (!validateMaxLength(value, 100)) {
        setFieldError(field, "O nome deve ter no máximo 100 caracteres.");
        return false;
      }
      break;

    case "email":
      if (!validateRequired(value)) {
        setFieldError(field, "Informe seu e-mail.");
        return false;
      }
      if (!validateEmail(value)) {
        setFieldError(field, "Digite um e-mail válido (ex.: nome@dominio.com).");
        return false;
      }
      break;

    case "phone":
      if (!validateRequired(value)) {
        setFieldError(field, "Informe seu telefone.");
        return false;
      }
      if (!validatePhone(value)) {
        setFieldError(field, "Digite um telefone válido (ex.: (11) 99999-9999).");
        return false;
      }
      break;

    case "service-type":
      if (!validateRequired(value)) {
        setFieldError(field, "Selecione um tipo de serviço.");
        return false;
      }
      break;

    case "message":
      if (!validateRequired(value)) {
        setFieldError(field, "Escreva sua mensagem.");
        return false;
      }
      if (!validateMinLength(value, 10)) {
        setFieldError(field, "A mensagem deve ter pelo menos 10 caracteres.");
        return false;
      }
      if (!validateMaxLength(value, 500)) {
        setFieldError(field, "A mensagem deve ter no máximo 500 caracteres.");
        return false;
      }
      break;
  }

  // Field is valid
  setFieldError(field, "");
  return true;
}

// --- Form-level Validation ---

function validateForm(form) {
  const fields = form.querySelectorAll("input, textarea, select");
  let firstInvalid = null;
  let allValid = true;

  fields.forEach((field) => {
    const isValid = validateField(field);
    if (!isValid && !firstInvalid) {
      firstInvalid = field;
    }
    if (!isValid) {
      allValid = false;
    }
  });

  // Scroll to first invalid field
  if (firstInvalid) {
    const headerOffset = 100;
    const elementPosition = firstInvalid.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - headerOffset,
      behavior: "smooth",
    });
    firstInvalid.focus();
  }

  return allValid;
}

// --- Submission Handling ---

function setLoadingState(btn, isLoading) {
  const textEl = btn.querySelector("[data-btn-text]");
  const spinnerEl = btn.querySelector("[data-btn-spinner]");

  if (isLoading) {
    btn.disabled = true;
    btn.classList.add("opacity-50", "pointer-events-none");
    if (textEl) textEl.textContent = "Enviando...";
    if (spinnerEl) spinnerEl.classList.remove("hidden");
  } else {
    btn.disabled = false;
    btn.classList.remove("opacity-50", "pointer-events-none");
    if (textEl) textEl.textContent = "Enviar mensagem";
    if (spinnerEl) spinnerEl.classList.add("hidden");
  }
}

function showFormStatus(statusEl, type, message) {
  if (!statusEl) return;

  // Remove previous state classes
  statusEl.classList.remove(
    "hidden",
    "bg-green-50", "text-green-700", "border-green-200",
    "bg-red-50", "text-red-700", "border-red-200"
  );

  if (type === "success") {
    statusEl.classList.add("bg-green-50", "text-green-700", "border-green-200");
  } else {
    statusEl.classList.add("bg-red-50", "text-red-700", "border-red-200");
  }

  statusEl.textContent = message;
}

function hideFormStatus(statusEl) {
  if (!statusEl) return;
  statusEl.classList.add("hidden");
  statusEl.textContent = "";
}

// --- Phone Mask ---

function phoneMask(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2")
    .substring(0, 15);
}

// --- Character Counter ---

function setupCharCounter() {
  const textarea = document.querySelector("[data-char-counter]");
  const counter = document.querySelector("[data-counter]");
  if (!textarea || !counter) return;

  const updateCounter = () => {
    const length = textarea.value.length;
    const max = textarea.getAttribute("maxlength") || 500;
    counter.textContent = `${length}/${max} caracteres`;
  };

  textarea.addEventListener("input", updateCounter);
  updateCounter();
}

// --- Initialize ---

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const statusEl = document.querySelector("[data-form-status]");
  const submitBtn = document.querySelector("[data-submit-btn]");
  const phoneInput = document.querySelector("[data-phone-mask]");

  // Populate UTM hidden fields from the current URL (Req 9.6, 9.7).
  populateUTMFields();

  // Populate Service selection from URL query parameters (OP-04).
  populateServiceSelection();

  if (!form) return;

  // Phone mask
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      e.target.value = phoneMask(e.target.value);
    });
  }

  // Character counter
  setupCharCounter();

  // Fire a single "form start" analytics event on the first interaction with
  // any form field (Req 5.5). analytics.js guards single-fire per session; we
  // also guard here so the listener is only wired once.
  let formStartWired = false;
  const fireFormStart = () => {
    if (formStartWired) return;
    formStartWired = true;
    if (window.ImperarAnalytics && typeof window.ImperarAnalytics.trackFormStart === "function") {
      window.ImperarAnalytics.trackFormStart();
    }
  };
  form.addEventListener("input", fireFormStart, { once: true });
  form.addEventListener("change", fireFormStart, { once: true });

  // Blur validation on all fields (inputs, textarea, and the service-type select)
  const fields = form.querySelectorAll("input, textarea, select");
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      // Only validate if user has typed something or field was touched
      if (field.value.trim() !== "" || field.dataset.touched) {
        validateField(field);
      }
      field.dataset.touched = "true";
    });

    // Clear error on input/change (real-time correction feedback)
    const revalidate = () => {
      if (field.classList.contains("border-red-600")) {
        validateField(field);
      }
    };
    field.addEventListener("input", revalidate);
    field.addEventListener("change", revalidate);
  });

  // Helper: reset the form UI after a (real or simulated) successful send.
  const handleSuccessUI = () => {
    showFormStatus(
      statusEl,
      "success",
      "Mensagem enviada com sucesso! Em breve entraremos em contato."
    );

    form.reset();
    clearAllFields(form);

    const counter = document.querySelector("[data-counter]");
    if (counter) counter.textContent = "0/500 caracteres";
  };

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideFormStatus(statusEl);

    // Honeypot check (Req 10.3 / Property 7): if filled, this is almost
    // certainly a bot. Silently discard by simulating success WITHOUT calling
    // EmailJS and WITHOUT showing any error — never signal bot detection.
    if (checkHoneypot(form)) {
      handleSuccessUI();
      return;
    }

    // Mark all fields as touched
    fields.forEach((f) => (f.dataset.touched = "true"));

    const isValid = validateForm(form);
    if (!isValid) return;

    // Loading state
    setLoadingState(submitBtn, true);

    // Build EmailJS payload. Strip HTML tags + trim from every user-provided
    // value before sending (Req 10.5). Include service_type and UTM params
    // (Req 9.6).
    const getValue = (selector) => {
      const el = form.querySelector(selector);
      return el ? stripHtml(el.value) : "";
    };

    const templateParams = {
      from_name: getValue("#name"),
      from_email: getValue("#email"),
      phone: getValue("#phone"),
      service_type: getValue("#service-type"),
      message: getValue("#message"),
      utm_source: getValue('[name="utm_source"]'),
      utm_medium: getValue('[name="utm_medium"]'),
      utm_campaign: getValue('[name="utm_campaign"]'),
    };

    emailjs
      .send("service_e9ei6vb", "template_5hsnors", templateParams, "SfnXswHudot3-bhKs")
      .then(() => {
        setLoadingState(submitBtn, false);

        handleSuccessUI();

        // Track successful submission (Req 5.1, 9.3). trackFormSubmit already
        // fires the Meta Pixel "Lead" event via analytics.js — prefer it over a
        // direct fbq call to avoid double-firing. Guard for undefined.
        if (window.ImperarAnalytics && typeof window.ImperarAnalytics.trackFormSubmit === "function") {
          window.ImperarAnalytics.trackFormSubmit();
        } else if (typeof window.fbq === "function") {
          // Fallback only when the analytics module is unavailable.
          window.fbq("track", "Lead");
        }
      })
      .catch((error) => {
        setLoadingState(submitBtn, false);
        // Log a generic message only — never expose service IDs, template IDs,
        // or API keys (Req 10.6).
        console.error("Falha ao enviar o formulário de contato.");

        // Error status with WhatsApp fallback link (Req 5.4). No internal IDs
        // or keys are surfaced to the user.
        if (statusEl) {
          showFormStatus(statusEl, "error", "");
          statusEl.innerHTML =
            "Não foi possível enviar sua mensagem agora. Tente novamente ou fale conosco pelo " +
            '<a href="https://wa.me/5511980979915" target="_blank" rel="noopener noreferrer" class="font-semibold underline">WhatsApp</a>.';
        }
      });
  });
});

// --- Exports (for property/unit tests; harmless in the browser) ---

const ContactFormAPI = {
  stripHtml,
  checkHoneypot,
  phoneMask,
  populateUTMFields,
  populateServiceSelection,
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateMaxLength,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ContactFormAPI;
}

if (typeof window !== "undefined") {
  window.ContactForm = ContactFormAPI;
}
