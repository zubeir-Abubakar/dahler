import { useMemo, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { company } from "@/data/company";

type FormStatus = "idle" | "sending" | "success" | "error" | "not_configured";

interface FormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const startedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const rules = useMemo(
    () => ({
      name: { required: true, min: 2, max: 120 },
      email: { required: true, min: 5, max: 160 },
      subject: { required: true, min: 2, max: 160 },
      message: { required: true, min: 10, max: 4000 },
      company: { max: 120 },
      phone: { max: 40 },
    }),
    [],
  );

  const validateField = (field: keyof FormValues, value: string): string | undefined => {
    const rule = rules[field];
    const trimmed = value.trim();

    if ("required" in rule && rule.required && trimmed.length === 0) {
      return t("contact.form.validation.required");
    }
    if (field === "email" && trimmed.length > 0 && !EMAIL_PATTERN.test(trimmed)) {
      return t("contact.form.validation.email");
    }
    if ("min" in rule && rule.min && trimmed.length > 0 && trimmed.length < rule.min) {
      return t("contact.form.validation.minLength", { min: rule.min });
    }
    if ("max" in rule && rule.max && trimmed.length > rule.max) {
      return t("contact.form.validation.maxLength", { max: rule.max });
    }
    return undefined;
  };

  const validateAll = (): FieldErrors => {
    const next: FieldErrors = {};
    (Object.keys(values) as Array<keyof FormValues>).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) next[field] = error;
    });
    return next;
  };

  const update = (field: keyof FormValues) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    }
  };

  const blur = (field: keyof FormValues) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateField(field, values[field]) }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateAll();
    setErrors(nextErrors);
    setTouched({
      name: true,
      company: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    });

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale: i18n.resolvedLanguage ?? i18n.language,
          website: honeypotRef.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });

      // A static host may answer unknown POSTs with index.html and a 200. Only a
      // JSON body with { ok: true } counts as delivered — never a blank success.
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; code?: string }
        | null;

      if (response.ok && payload?.ok === true) {
        setStatus("success");
        setValues(initialValues);
        setTouched({});
        startedAt.current = Date.now();
        return;
      }

      setStatus(payload?.code === "not_configured" ? "not_configured" : "error");
    } catch {
      setStatus("error");
    }
  };

  const fieldProps = (field: keyof FormValues) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    onBlur: blur(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: "field-input",
  });

  const busy = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <h2 className="type-h2">{t("contact.form.title")}</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
          {t("contact.form.intro")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            {t("contact.form.name")} <span aria-hidden="true">*</span>
          </label>
          <input {...fieldProps("name")} type="text" autoComplete="name" required />
          {errors.name ? (
            <p id="contact-name-error" className="field-error" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-company" className="field-label">
            {t("contact.form.company")}{" "}
            <span className="font-normal text-stone">({t("contact.form.optional")})</span>
          </label>
          <input {...fieldProps("company")} type="text" autoComplete="organization" />
          {errors.company ? (
            <p id="contact-company-error" className="field-error" role="alert">
              {errors.company}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className="field-label">
            {t("contact.form.email")} <span aria-hidden="true">*</span>
          </label>
          <input {...fieldProps("email")} type="email" autoComplete="email" required />
          {errors.email ? (
            <p id="contact-email-error" className="field-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className="field-label">
            {t("contact.form.phone")}{" "}
            <span className="font-normal text-stone">({t("contact.form.optional")})</span>
          </label>
          <input {...fieldProps("phone")} type="tel" autoComplete="tel" />
          {errors.phone ? (
            <p id="contact-phone-error" className="field-error" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="field-label">
          {t("contact.form.subject")} <span aria-hidden="true">*</span>
        </label>
        <input {...fieldProps("subject")} type="text" required />
        {errors.subject ? (
          <p id="contact-subject-error" className="field-error" role="alert">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="field-label">
          {t("contact.form.message")} <span aria-hidden="true">*</span>
        </label>
        <textarea {...fieldProps("message")} rows={6} required className="field-input resize-y" />
        {errors.message ? (
          <p id="contact-message-error" className="field-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input ref={honeypotRef} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={busy} aria-busy={busy}>
          {busy ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          ) : (
            <Send aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
          )}
          {busy ? t("contact.form.sending") : t("contact.form.submit")}
        </button>
        <p className="text-xs text-stone">
          <span aria-hidden="true">*</span> {t("contact.form.intro").split(".")[0]}.
        </p>
      </div>

      <div aria-live="polite" role="status">
        {status === "success" ? (
          <p className="flex items-start gap-2 rounded-xl border border-leaf/30 bg-accent-soft/60 p-4 text-sm text-forest">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            {t("contact.form.success")}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="flex items-start gap-2 rounded-xl border border-crimson/30 bg-crimson/5 p-4 text-sm text-crimson">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            {t("contact.form.error")}
          </p>
        ) : null}
        {status === "not_configured" ? (
          <p className="flex items-start gap-2 rounded-xl border border-crimson/30 bg-crimson/5 p-4 text-sm text-crimson">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            {t("contact.form.notConfigured")}
          </p>
        ) : null}
      </div>

      <p className="sr-only">{company.legalName}</p>
    </form>
  );
}
