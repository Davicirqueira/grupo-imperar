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
  form.querySelectorAll("input, textarea").forEach((field) => {
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

    case "message":
      if (!validateRequired(value)) {
        setFieldError(field, "Escreva sua mensagem.");
        return false;
      }
      if (!validateMinLength(value, 10)) {
        setFieldError(field, "A mensagem deve ter pelo menos 10 caracteres.");
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
  const fields = form.querySelectorAll("input, textarea");
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

  if (!form) return;

  // Phone mask
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      e.target.value = phoneMask(e.target.value);
    });
  }

  // Character counter
  setupCharCounter();

  // Blur validation on all fields
  const fields = form.querySelectorAll("input, textarea");
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      // Only validate if user has typed something or field was touched
      if (field.value.trim() !== "" || field.dataset.touched) {
        validateField(field);
      }
      field.dataset.touched = "true";
    });

    // Clear error on input (real-time correction feedback)
    field.addEventListener("input", () => {
      if (field.classList.contains("border-red-600")) {
        validateField(field);
      }
    });
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideFormStatus(statusEl);

    // Mark all fields as touched
    fields.forEach((f) => (f.dataset.touched = "true"));

    const isValid = validateForm(form);
    if (!isValid) return;

    // Loading state
    setLoadingState(submitBtn, true);

    // EmailJS submission
    const templateParams = {
      from_name: form.querySelector("#name").value.trim(),
      from_email: form.querySelector("#email").value.trim(),
      phone: form.querySelector("#phone").value.trim(),
      message: form.querySelector("#message").value.trim(),
    };

    emailjs
      .send("service_e9ei6vb", "template_5hsnors", templateParams, "SfnXswHudot3-bhKs")
      .then(() => {
        setLoadingState(submitBtn, false);

        showFormStatus(
          statusEl,
          "success",
          "Mensagem enviada com sucesso! Em breve entraremos em contato."
        );

        form.reset();
        clearAllFields(form);

        const counter = document.querySelector("[data-counter]");
        if (counter) counter.textContent = "0/500 caracteres";
      })
      .catch((error) => {
        setLoadingState(submitBtn, false);
        console.error("EmailJS error:", error);

        showFormStatus(
          statusEl,
          "error",
          "Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone."
        );
      });
  });
});
