function setFieldError(field, message) {
  const wrap = field.closest("[data-field]");
  if (!wrap) return;
  const error = wrap.querySelector("[data-error]");
  const successIcon = wrap.querySelector(".field-icon.success");
  const errorIcon = wrap.querySelector(".field-icon.error");
  
  if (error) error.textContent = message || "";
  
  if (message) {
    field.classList.add("has-error");
    field.classList.remove("has-success");
    if (errorIcon) errorIcon.classList.add("is-visible");
    if (successIcon) successIcon.classList.remove("is-visible");
  } else {
    field.classList.remove("has-error");
    field.classList.add("has-success");
    if (errorIcon) errorIcon.classList.remove("is-visible");
    if (successIcon) successIcon.classList.add("is-visible");
  }
}

function clearErrors(form) {
  form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.classList.remove("has-error", "has-success");
  });
  form.querySelectorAll(".field-icon").forEach((icon) => {
    icon.classList.remove("is-visible");
  });
}

function isValidEmail(value) {
  const v = String(value || "").trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(value) {
  const v = String(value || "").trim();
  if (!v) return false;
  return /^[0-9\s()\-\+]+$/.test(v);
}

function validate(form) {
  const name = form.querySelector("#name");
  const email = form.querySelector("#email");
  const phone = form.querySelector("#phone");
  const message = form.querySelector("#message");

  let ok = true;

  if (!name || !email || !phone || !message) return false;

  if (!String(name.value || "").trim()) {
    setFieldError(name, "Informe seu nome.");
    ok = false;
  }

  if (!isValidEmail(email.value)) {
    setFieldError(email, "Informe um e-mail válido (ex.: nome@dominio.com).");
    ok = false;
  }

  if (!isValidPhone(phone.value)) {
    setFieldError(phone, "Use apenas números e separadores comuns (ex.: (11) 99999-9999).");
    ok = false;
  }

  const msg = String(message.value || "").trim();
  if (msg.length < 10) {
    setFieldError(message, "A mensagem deve ter pelo menos 10 caracteres.");
    ok = false;
  }

  return ok;
}

// Máscara de telefone
function phoneMask(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2")
    .substring(0, 15);
}

// Contador de caracteres
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  const submitBtn = document.querySelector("[data-submit-btn]");
  const phoneInput = document.querySelector("[data-phone-mask]");
  
  if (!form) return;

  // Máscara de telefone
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      e.target.value = phoneMask(e.target.value);
    });
  }

  // Contador de caracteres
  setupCharCounter();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);
    if (status) status.classList.remove("is-visible");

    const ok = validate(form);
    if (!ok) return;

    // Loading state
    if (submitBtn) {
      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;
    }

    // Simular envio (2 segundos)
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
      }

      if (status) {
        status.textContent =
          "Mensagem enviada com sucesso. Em breve entraremos em contato. Se preferir, use telefone ou e-mail abaixo.";
        status.classList.add("is-visible");
      }

      form.reset();
      clearErrors(form);
      
      // Resetar contador
      const counter = document.querySelector("[data-counter]");
      if (counter) counter.textContent = "0/500 caracteres";
    }, 2000);
  });
});

