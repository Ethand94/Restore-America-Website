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
  name: string;
  phone: string;
  email: string;
  address: string;
  damageType: DamageType;
  message: string;
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
    name: "",
    phone: "",
    email: "",
    address: "",
    damageType: "roof",
    message: "",
  });

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const damageLabel =
      damageOptions.find((option) => option.id === formData.damageType)?.label ?? "Other";

    const payload = {
      fullName: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      propertyAddress: formData.address.trim() || undefined,
      damageType: damageLabel,
      source,
      message: formData.message.trim() || undefined,
      formAnswers: {
        damageType: damageLabel,
      },
    };

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await submitWebsiteIntake(payload);
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        damageType: "roof",
        message: "",
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
              placeholder="Full Name *"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
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
              placeholder="Email (optional)"
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
