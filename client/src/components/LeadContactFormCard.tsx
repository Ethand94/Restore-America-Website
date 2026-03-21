import { submitWebsiteIntake } from "@/lib/intake";
import { CheckCircle2 } from "lucide-react";
import { type FormEvent, useState } from "react";

type DamageType = "hail" | "wind" | "fire" | "flood" | "tree" | "roof" | "other";
type LeadSource =
  | "website"
  | "facebook"
  | "google"
  | "referral"
  | "storm_canvass"
  | "other";

type LeadContactFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  damageType: DamageType;
  message: string;
  consentToEmail: boolean;
  consentToText: boolean;
  consentToAiContact: boolean;
};

type DamageOption = {
  id: DamageType;
  label: string;
};

const damageOptions: DamageOption[] = [
  { id: "hail", label: "Hail Damage" },
  { id: "wind", label: "Wind Damage" },
  { id: "fire", label: "Fire Damage" },
  { id: "flood", label: "Flood Damage" },
  { id: "tree", label: "Tree Damage" },
  { id: "roof", label: "Roof Damage" },
  { id: "other", label: "Other" },
];

type LeadContactFormCardProps = {
  className?: string;
  source?: LeadSource;
  title?: string;
  subtitle?: string;
};

export default function LeadContactFormCard({
  className = "",
  source = "website",
  title = "REQUEST A FREE INSPECTION",
  subtitle = "Send your contact details and we will call you back shortly.",
}: LeadContactFormCardProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LeadContactFormState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    damageType: "roof",
    message: "",
    consentToEmail: false,
    consentToText: false,
    consentToAiContact: false,
  });

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (!firstName || !lastName || !phone || !email) return;

    const damageLabel =
      damageOptions.find((option) => option.id === formData.damageType)?.label ?? "Other";
    const fullName = [firstName, lastName].join(" ");
    const contactConsent = {
      email: formData.consentToEmail,
      text: formData.consentToText,
      aiAgent: formData.consentToAiContact,
    };

    const payload = {
      fullName,
      firstName,
      lastName,
      phone,
      email,
      propertyAddress: formData.address.trim() || undefined,
      damageType: damageLabel,
      source,
      message: formData.message.trim() || undefined,
      contactConsent,
      formAnswers: {
        damageType: damageLabel,
        contactConsent,
      },
    };

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await submitWebsiteIntake(payload);
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        damageType: "roof",
        message: "",
        consentToEmail: false,
        consentToText: false,
        consentToAiContact: false,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit intake.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white shadow-sm border-t-4 ${className}`} style={{ borderTopColor: "#CC2222" }}>
      <div className="px-6 py-5" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="text-xs font-bold tracking-widest uppercase text-white/70 mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>
          Contact Form
        </div>
        <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.04em" }}>
          {title}
        </h3>
        <p className="text-white/70 text-sm mt-1" style={{ fontFamily: "Roboto, sans-serif" }}>
          {subtitle}
        </p>
      </div>

      <div className="p-6">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#1B3A6B" }}>
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-1" style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif" }}>
              THANK YOU!
            </h4>
            <p className="text-gray-600 text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
              We received your request and will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="First Name *"
              value={formData.firstName}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, firstName: event.target.value }))
              }
              className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
            <input
              type="text"
              required
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, lastName: event.target.value }))
              }
              className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
            <input
              type="tel"
              required
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
            <input
              type="email"
              required
              placeholder="Email Address *"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
            <select
              value={formData.damageType}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  damageType: event.target.value as DamageType,
                }))
              }
              className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] bg-white"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {damageOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Property Address (optional)"
              value={formData.address}
              onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))}
              className="md:col-span-2 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
            <textarea
              placeholder="Tell us what happened (optional)"
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              rows={3}
              className="md:col-span-2 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] resize-none"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
            <div className="md:col-span-2 border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
              <p
                className="mb-2 font-semibold uppercase tracking-[0.16em]"
                style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif" }}
              >
                Contact Preferences
              </p>
              <label
                className="flex items-start gap-2"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <input
                  type="checkbox"
                  checked={formData.consentToEmail}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      consentToEmail: event.target.checked,
                    }))
                  }
                  className="mt-0.5 h-4 w-4 accent-[#1B3A6B]"
                />
                <span>I agree to receive email updates about my inspection request.</span>
              </label>
              <label
                className="mt-2 flex items-start gap-2"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <input
                  type="checkbox"
                  checked={formData.consentToText}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      consentToText: event.target.checked,
                    }))
                  }
                  className="mt-0.5 h-4 w-4 accent-[#1B3A6B]"
                />
                <span>I agree to receive text messages about my inspection request.</span>
              </label>
              <label
                className="mt-2 flex items-start gap-2"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <input
                  type="checkbox"
                  checked={formData.consentToAiContact}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      consentToAiContact: event.target.checked,
                    }))
                  }
                  className="mt-0.5 h-4 w-4 accent-[#1B3A6B]"
                />
                <span>I am okay being contacted by an AI assistant about this request.</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 text-white py-4 font-bold tracking-widest uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.12em" }}
            >
              {isSubmitting ? "SUBMITTING..." : "REQUEST MY FREE INSPECTION"}
            </button>
            {submitError && (
              <p className="md:col-span-2 text-red-600 text-xs text-center">
                {submitError}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
