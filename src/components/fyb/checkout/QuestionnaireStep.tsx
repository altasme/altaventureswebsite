import { useState } from "react";
import { BUSINESS_CATEGORIES, QUESTIONNAIRE } from "../../../content/foryourbusiness";
import { Field, StepHeader, inputClasses } from "./shared";

export type QuestionnaireData = {
  businessName: string;
  businessCategory: string;
  businessDescription: string;
  contactPerson: string;
  email: string;
  phone: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function QuestionnaireStep({
  initial,
  onNext,
}: {
  initial: QuestionnaireData;
  onNext: (data: QuestionnaireData) => void;
}) {
  const isKnownCategory = (BUSINESS_CATEGORIES as readonly string[]).includes(initial.businessCategory);

  const [businessName, setBusinessName] = useState(initial.businessName);
  const [categorySelect, setCategorySelect] = useState(
    initial.businessCategory ? (isKnownCategory ? initial.businessCategory : "Other") : ""
  );
  const [categoryOther, setCategoryOther] = useState(!isKnownCategory ? initial.businessCategory : "");
  const [businessDescription, setBusinessDescription] = useState(initial.businessDescription);
  const [contactPerson, setContactPerson] = useState(initial.contactPerson);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [touched, setTouched] = useState(false);

  const emailValid = EMAIL_PATTERN.test(email);
  const resolvedCategory = (categorySelect === "Other" ? categoryOther : categorySelect).trim();

  const valid =
    businessName.trim().length > 1 &&
    resolvedCategory.length > 0 &&
    businessDescription.trim().length > 4 &&
    contactPerson.trim().length > 1 &&
    emailValid &&
    phone.trim().length > 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onNext({
      businessName: businessName.trim(),
      businessCategory: resolvedCategory,
      businessDescription: businessDescription.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader stepLabel={QUESTIONNAIRE.stepLabel} headline={QUESTIONNAIRE.headline} sub={QUESTIONNAIRE.sub} />

      <Field label={QUESTIONNAIRE.fields.businessName.label} htmlFor="businessName" hint={QUESTIONNAIRE.fields.businessName.hint}>
        <input
          id="businessName"
          className={inputClasses}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </Field>

      <Field
        label={QUESTIONNAIRE.fields.businessCategory.label}
        htmlFor="businessCategory"
        hint={QUESTIONNAIRE.fields.businessCategory.hint}
      >
        <select
          id="businessCategory"
          className={inputClasses}
          value={categorySelect}
          onChange={(e) => setCategorySelect(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {BUSINESS_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {categorySelect === "Other" && (
          <input
            className={`${inputClasses} mt-2`}
            placeholder="Tell us your business category"
            value={categoryOther}
            onChange={(e) => setCategoryOther(e.target.value)}
            required
          />
        )}
      </Field>

      <Field
        label={QUESTIONNAIRE.fields.businessDescription.label}
        htmlFor="businessDescription"
        hint={QUESTIONNAIRE.fields.businessDescription.hint}
      >
        <textarea
          id="businessDescription"
          className={`${inputClasses} min-h-[100px] resize-y`}
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={QUESTIONNAIRE.fields.contactPerson.label} htmlFor="contactPerson" hint={QUESTIONNAIRE.fields.contactPerson.hint}>
          <input
            id="contactPerson"
            className={inputClasses}
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
          />
        </Field>
        <Field
          label={QUESTIONNAIRE.fields.email.label}
          htmlFor="email"
          hint={QUESTIONNAIRE.fields.email.hint}
          error={touched && email.length > 0 && !emailValid ? "Enter a valid email address." : undefined}
        >
          <input
            id="email"
            type="email"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label={QUESTIONNAIRE.fields.phone.label} htmlFor="phone" hint={QUESTIONNAIRE.fields.phone.hint}>
        <input id="phone" type="tel" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </Field>

      <button
        type="submit"
        disabled={!valid}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-blue px-6 py-4 text-base font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-ink/10 disabled:text-ink/60 disabled:shadow-none sm:w-auto"
      >
        {QUESTIONNAIRE.cta}
      </button>
    </form>
  );
}
