function setFieldError(field, message) {
  const wrap = field.closest("[data-field]");
  if (!wrap) return;
  const error = wrap.querySelector("[data-error]");
  if (!error) return;
  error.textContent = message || "";
}

function clearErrors(form) {
  form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);
    if (status) status.classList.remove("is-visible");

    const ok = validate(form);
    if (!ok) return;

    // No backend configured yet: we confirm success per requirements.
    if (status) {
      status.textContent =
        "Mensagem enviada com sucesso. Em breve entraremos em contato. Se preferir, use telefone ou e-mail abaixo.";
      status.classList.add("is-visible");
    }

    form.reset();
  });
});

