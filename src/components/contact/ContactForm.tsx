import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

/**
 * Temporary demonstration inbox. A Formspree form ID is public by design: it is
 * not a secret and grants nothing beyond accepting submissions for this form.
 * Replace this constant (or point it at an env-injected value) before launch.
 */
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeaeylry";

const ENQUIRY_TYPES = [
  "general",
  "product",
  "availability",
  "partnership",
  "supplier",
  "logistics",
  "other",
] as const;

type EnquiryType = (typeof ENQUIRY_TYPES)[number];
type FormStatus = "idle" | "sending" | "success" | "error";

interface FormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  enquiry: EnquiryType | "";
  productInterest: string;
  supplierOffer: string;
  deliveryArea: string;
  message: string;
  consent: boolean;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  enquiry: "",
  productInterest: "",
  supplierOffer: "",
  deliveryArea: "",
  message: "",
  consent: false,
};

const fieldOrder: Array<keyof FormValues> = [
  "name",
  "company",
  "email",
  "phone",
  "enquiry",
  "productInterest",
  "supplierOffer",
  "deliveryArea",
  "message",
  "consent",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const wantsProduct = (enquiry: FormValues["enquiry"]) =>
  enquiry === "product" || enquiry === "availability";

const isVisible = (field: keyof FormValues, values: FormValues) => {
  if (field === "productInterest") return wantsProduct(values.enquiry);
  if (field === "supplierOffer") return values.enquiry === "supplier";
  if (field === "deliveryArea") return values.enquiry === "logistics";
  return true;
};

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const honeypotRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  // A ref guards against a second submit arriving before React re-renders.
  const inFlight = useRef(false);

  const validateField = (field: keyof FormValues, current: FormValues): string | undefined => {
    const required = t("contact.form.validation.required");
    const trimmed = typeof current[field] === "string" ? current[field].trim() : "";

    switch (field) {
      case "consent":
        return current.consent ? undefined : t("contact.form.validation.consent");
      case "name":
        if (!trimmed) return required;
        if (trimmed.length < 2) return t("contact.form.validation.minLength", { min: 2 });
        if (trimmed.length > 120) return t("contact.form.validation.maxLength", { max: 120 });
        return undefined;
      case "company":
        if (current.enquiry === "partnership" && !trimmed) return required;
        if (trimmed.length > 120) return t("contact.form.validation.maxLength", { max: 120 });
        return undefined;
      case "email":
        if (!trimmed) return required;
        if (!EMAIL_PATTERN.test(trimmed)) return t("contact.form.validation.email");
        if (trimmed.length > 160) return t("contact.form.validation.maxLength", { max: 160 });
        return undefined;
      case "phone":
        if (trimmed.length > 40) return t("contact.form.validation.maxLength", { max: 40 });
        return undefined;
      case "enquiry":
        return current.enquiry ? undefined : required;
      case "productInterest":
        if (!wantsProduct(current.enquiry)) return undefined;
        if (!trimmed) return required;
        if (trimmed.length < 2) return t("contact.form.validation.minLength", { min: 2 });
        if (trimmed.length > 120) return t("contact.form.validation.maxLength", { max: 120 });
        return undefined;
      case "supplierOffer":
        if (current.enquiry !== "supplier") return undefined;
        if (!trimmed) return required;
        if (trimmed.length < 5) return t("contact.form.validation.minLength", { min: 5 });
        if (trimmed.length > 500) return t("contact.form.validation.maxLength", { max: 500 });
        return undefined;
      case "deliveryArea":
        if (current.enquiry !== "logistics") return undefined;
        if (trimmed.length > 120) return t("contact.form.validation.maxLength", { max: 120 });
        return undefined;
      case "message":
        if (!trimmed) return required;
        if (trimmed.length < 10) return t("contact.form.validation.minLength", { min: 10 });
        if (trimmed.length > 4000) return t("contact.form.validation.maxLength", { max: 4000 });
        return undefined;
      default:
        return undefined;
    }
  };

  const visibleOrder = (current: FormValues) =>
    fieldOrder.filter((field) => isVisible(field, current));

  const validateAll = (current: FormValues): FieldErrors => {
    const next: FieldErrors = {};
    visibleOrder(current).forEach((field) => {
      const error = validateField(field, current);
      if (error) next[field] = error;
    });
    return next;
  };

  const update = (field: keyof FormValues) => (event: { target: { value: string } }) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    if (status === "error") setStatus("idle");
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, next) }));
    }
  };

  const blur = (field: keyof FormValues) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateField(field, values) }));
  };

  const updateEnquiry = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = { ...values, enquiry: event.target.value as EnquiryType | "" };
    setValues(next);
    setTouched((current) => ({ ...current, enquiry: true }));
    if (status === "error") setStatus("idle");

    setErrors((current) => {
      const updated = { ...current, enquiry: validateField("enquiry", next) };
      // Drop errors for fields the new enquiry type no longer shows.
      (["productInterest", "supplierOffer", "deliveryArea"] as const).forEach((field) => {
        if (!isVisible(field, next)) delete updated[field];
      });
      if (values.enquiry === "partnership" && next.enquiry !== "partnership") {
        delete updated.company;
      }
      return updated;
    });
  };

  const updateConsent = (event: ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, consent: event.target.checked };
    setValues(next);
    setTouched((current) => ({ ...current, consent: true }));
    if (status === "error") setStatus("idle");
    setErrors((current) => ({
      ...current,
      consent: validateField("consent", next),
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched(
      fieldOrder.reduce<Partial<Record<keyof FormValues, boolean>>>((all, field) => {
        all[field] = true;
        return all;
      }, {}),
    );

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = visibleOrder(values).find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    // Honeypot: a human never fills this. Bots are dropped without a request.
    if (honeypotRef.current?.value) return;

    inFlight.current = true;
    setStatus("sending");

    const enquiryLabel = t(`contact.form.enquiryTypes.${values.enquiry}`);
    const payload = new FormData();
    payload.append("name", values.name.trim());
    payload.append("company", values.company.trim());
    payload.append("email", values.email.trim());
    payload.append("phone", values.phone.trim());
    payload.append("enquiry_type", values.enquiry);
    payload.append("enquiry_label", enquiryLabel);
    if (wantsProduct(values.enquiry)) {
      payload.append("product_interest", values.productInterest.trim());
    }
    if (values.enquiry === "supplier") {
      payload.append("supplier_offer", values.supplierOffer.trim());
    }
    if (values.enquiry === "logistics") {
      payload.append("delivery_area", values.deliveryArea.trim());
    }
    payload.append("message", values.message.trim());
    payload.append("privacy_consent", values.consent ? "yes" : "no");
    payload.append("_subject", `Website enquiry: ${enquiryLabel}`);
    payload.append("_gotcha", "");
    payload.append("locale", i18n.resolvedLanguage ?? i18n.language);

    try {
      // Multipart upload keeps this a CORS-safelisted request (no preflight).
      // `Accept: application/json` makes Formspree answer with JSON instead of
      // redirecting to its hosted thank-you page.
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;

      // Only a 2xx answer from Formspree counts as delivered.
      if (response.ok && result?.ok !== false) {
        setStatus("success");
        setValues(initialValues);
        setTouched({});
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  };

  // Announce and focus the result so keyboard and screen-reader users notice it.
  useEffect(() => {
    if (status === "success" || status === "error") statusRef.current?.focus();
  }, [status]);

  const fieldProps = (field: "name" | "company" | "email" | "phone" | "message") => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    onBlur: blur(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: field === "message" ? "field-input resize-y" : "field-input",
  });

  const busy = status === "sending";
  const showProduct = wantsProduct(values.enquiry);
  const showSupplier = values.enquiry === "supplier";
  const showDelivery = values.enquiry === "logistics";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={busy} className="flex flex-col gap-5">
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
            {values.enquiry === "partnership" ? (
              <span aria-hidden="true">*</span>
            ) : (
              <span className="font-normal text-stone">({t("contact.form.optional")})</span>
            )}
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
        <label htmlFor="contact-enquiry" className="field-label">
          {t("contact.form.enquiry")} <span aria-hidden="true">*</span>
        </label>
        <select
          id="contact-enquiry"
          name="enquiry"
          value={values.enquiry}
          onChange={updateEnquiry}
          onBlur={blur("enquiry")}
          aria-invalid={errors.enquiry ? true : undefined}
          aria-describedby={errors.enquiry ? "contact-enquiry-error" : undefined}
          className="field-input"
          required
        >
          <option value="" disabled>
            {t("contact.form.enquiryPlaceholder")}
          </option>
          {ENQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`contact.form.enquiryTypes.${type}`)}
            </option>
          ))}
        </select>
        {errors.enquiry ? (
          <p id="contact-enquiry-error" className="field-error" role="alert">
            {errors.enquiry}
          </p>
        ) : null}
      </div>

      {showProduct ? (
        <div>
          <label htmlFor="contact-productInterest" className="field-label">
            {t("contact.form.productInterest")} <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-productInterest"
            name="productInterest"
            type="text"
            value={values.productInterest}
            onChange={update("productInterest")}
            onBlur={blur("productInterest")}
            placeholder={t("contact.form.productInterestPlaceholder")}
            aria-invalid={errors.productInterest ? true : undefined}
            aria-describedby={
              errors.productInterest ? "contact-productInterest-error" : undefined
            }
            className="field-input"
          />
          {errors.productInterest ? (
            <p id="contact-productInterest-error" className="field-error" role="alert">
              {errors.productInterest}
            </p>
          ) : null}
        </div>
      ) : null}

      {showSupplier ? (
        <div>
          <label htmlFor="contact-supplierOffer" className="field-label">
            {t("contact.form.supplierOffer")} <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-supplierOffer"
            name="supplierOffer"
            rows={3}
            value={values.supplierOffer}
            onChange={update("supplierOffer")}
            onBlur={blur("supplierOffer")}
            placeholder={t("contact.form.supplierOfferPlaceholder")}
            aria-invalid={errors.supplierOffer ? true : undefined}
            aria-describedby={errors.supplierOffer ? "contact-supplierOffer-error" : undefined}
            className="field-input resize-y"
          />
          {errors.supplierOffer ? (
            <p id="contact-supplierOffer-error" className="field-error" role="alert">
              {errors.supplierOffer}
            </p>
          ) : null}
        </div>
      ) : null}

      {showDelivery ? (
        <div>
          <label htmlFor="contact-deliveryArea" className="field-label">
            {t("contact.form.deliveryArea")}{" "}
            <span className="font-normal text-stone">({t("contact.form.optional")})</span>
          </label>
          <input
            id="contact-deliveryArea"
            name="deliveryArea"
            type="text"
            value={values.deliveryArea}
            onChange={update("deliveryArea")}
            onBlur={blur("deliveryArea")}
            placeholder={t("contact.form.deliveryAreaPlaceholder")}
            aria-invalid={errors.deliveryArea ? true : undefined}
            aria-describedby={errors.deliveryArea ? "contact-deliveryArea-error" : undefined}
            className="field-input"
          />
          {errors.deliveryArea ? (
            <p id="contact-deliveryArea-error" className="field-error" role="alert">
              {errors.deliveryArea}
            </p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-message" className="field-label">
          {t("contact.form.message")} <span aria-hidden="true">*</span>
        </label>
        <textarea {...fieldProps("message")} rows={6} required />
        {errors.message ? (
          <p id="contact-message-error" className="field-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-consent" className="flex items-start gap-3 text-sm text-ink-soft">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={updateConsent}
            onBlur={blur("consent")}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
          />
          <span>
            {t("contact.form.consent")}{" "}
            <Link
              to="/datenschutz"
              className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-forest"
            >
              {t("contact.form.privacyLink")}
            </Link>
          </span>
        </label>
        {errors.consent ? (
          <p id="contact-consent-error" className="field-error" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. Formspree reads _gotcha. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          ref={honeypotRef}
          id="contact-website"
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
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
        <p className="text-xs text-stone">{t("contact.form.requiredNote")}</p>
      </div>

      <div ref={statusRef} tabIndex={-1} className="outline-none">
        {status === "success" ? (
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl border border-leaf/30 bg-accent-soft/60 p-4 text-sm text-forest"
          >
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            {t("contact.form.success")}
          </p>
        ) : null}
        {status === "error" ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-crimson/30 bg-crimson/5 p-4 text-sm text-crimson"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            {t("contact.form.error")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
