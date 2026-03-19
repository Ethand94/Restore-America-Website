import Footer from "@/components/Footer";
import InspectionQuizCard from "@/components/InspectionQuizCard";
import LeadContactFormCard from "@/components/LeadContactFormCard";
import Navbar from "@/components/Navbar";
import { SERVICE_LOCATIONS, getServiceLocationBySlug } from "@shared/data/locations";
import { ArrowRight, CheckCircle2, ChevronRight, HelpCircle, MapPin, Phone, Shield, Wrench } from "lucide-react";
import { useState } from "react";

type LocationDetailProps = {
  slug?: string;
};

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start gap-3 p-5 hover:bg-gray-50 transition-colors"
      >
        <HelpCircle className="w-5 h-5 text-[#CC2222] flex-shrink-0 mt-0.5" />
        <span
          className="text-[#1B3A6B] font-bold text-sm flex-1"
          style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.02em" }}
        >
          {question}
        </span>
        <ChevronRight
          className={`w-4 h-4 text-[#CC2222] flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pl-13">
          <p className="text-gray-700 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function LocationDetail({ slug }: LocationDetailProps) {
  const location = slug ? getServiceLocationBySlug(slug) : null;

  if (!location) {
    return (
      <div className="min-h-screen" style={{ fontFamily: "Roboto, sans-serif" }}>
        <Navbar />
        <section className="py-24" style={{ backgroundColor: "#F4F6F9" }}>
          <div className="container text-center">
            <h1 className="text-4xl font-bold text-[#1B3A6B]" style={{ fontFamily: "Oswald, sans-serif" }}>
              LOCATION NOT FOUND
            </h1>
            <p className="text-gray-600 mt-4">
              Choose one of our supported city pages below.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {SERVICE_LOCATIONS.map((item) => (
                <a
                  key={item.slug}
                  href={`/locations/${item.slug}`}
                  className="px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                  style={{ backgroundColor: "#1B3A6B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.06em" }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(130deg, #0D1F3C 0%, #1B3A6B 65%, #0D1F3C 100%)" }}
      >
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-white/75 text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
              <MapPin className="w-3.5 h-3.5" />
              {location.label}
            </div>
            <h1
              className="text-white leading-[0.98]"
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
              }}
            >
              {location.city.toUpperCase()} ROOFING
              <br />
              <span style={{ color: "#CC2222" }}>AND RESTORATION SERVICES</span>
            </h1>
            <p className="text-white/75 mt-6 text-base leading-relaxed max-w-2xl">
              {location.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/#inspection"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold tracking-wider uppercase hover:opacity-90 transition-opacity text-sm"
                style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
              >
                GET FREE INSPECTION
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:8445387737"
                className="inline-flex items-center gap-2 px-6 py-3 text-white border border-white/35 font-bold tracking-wider uppercase text-sm hover:border-white"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.08em" }}
              >
                <Phone className="w-4 h-4" />
                844-LETS-RESTORE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Quiz & Contact Form */}
      <section className="py-16" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="container">
          <div className="grid xl:grid-cols-2 gap-8 items-start">
            <div>
              <h2
                className="text-[#1B3A6B] text-3xl font-bold mb-3"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
              >
                60-SECOND DAMAGE QUIZ
              </h2>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                This is the same guided inspection quiz from our homepage. Complete it here to send your request directly to our team.
              </p>
              <InspectionQuizCard
                id="inspection"
                leadSource="website"
                title={`GET YOUR FREE ${location.city.toUpperCase()} INSPECTION`}
                subtitle="Quick guided quiz · No obligation · We come to you"
              />
            </div>
            <LeadContactFormCard
              source="website"
              title={`CONTACT OUR ${location.city.toUpperCase()} TEAM`}
              subtitle={`Need a direct form instead of the quiz? Send your details and our ${location.city} team will follow up shortly.`}
            />
          </div>
        </div>
      </section>

      {/* Our Services in [City] */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2
              className="text-[#1B3A6B] text-3xl font-bold"
              style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
            >
              OUR {location.city.toUpperCase()} SERVICES
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
              Restore America provides comprehensive roofing and restoration solutions in {location.city}, {location.stateCode}.
              Every project includes free inspections, insurance coordination, and quality workmanship.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {location.services.map((service) => (
              <a
                key={service.label}
                href={service.href}
                className="group flex items-center gap-3 p-5 border border-gray-200 hover:border-[#CC2222]/30 hover:shadow-md transition-all bg-[#FAFBFD]"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "#CC2222" }}
                >
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span
                    className="text-[#1B3A6B] font-bold text-sm block"
                    style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
                  >
                    {location.city} {service.label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#CC2222] ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues & Nearby Areas */}
      <section className="py-16" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="container grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 border border-gray-200">
            <h2 className="text-[#1B3A6B] text-2xl font-bold mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
              COMMON DAMAGE ISSUES IN {location.city.toUpperCase()}
            </h2>
            <div className="flex flex-col gap-3">
              {location.commonIssues.map((issue) => (
                <div key={issue} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#CC2222] flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">{issue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200">
            <h2 className="text-[#1B3A6B] text-2xl font-bold mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
              NEARBY AREAS WE COVER
            </h2>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {location.nearbyAreas.map((area) => (
                <div key={area} className="border border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-[#F9FBFD]">
                  {area}
                </div>
              ))}
            </div>
            <div
              className="mt-6 p-4 border-l-4"
              style={{ backgroundColor: "#F5F9FF", borderLeftColor: "#1B3A6B" }}
            >
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-[#1B3A6B] flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  We manage the process from inspection and claim documentation through final repairs, so your project stays on track from start to finish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City-Specific FAQ */}
      {location.faqs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2
                  className="text-[#1B3A6B] text-3xl font-bold"
                  style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
                >
                  FREQUENTLY ASKED QUESTIONS IN {location.city.toUpperCase()}
                </h2>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                  Answers to common questions from {location.city} homeowners about roofing, storm damage, and the insurance claim process.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {location.faqs.map((faq) => (
                  <FaqAccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-14" style={{ backgroundColor: "#0D1F3C" }}>
        <div className="container text-center">
          <h3 className="text-white text-3xl font-bold" style={{ fontFamily: "Oswald, sans-serif" }}>
            NEED HELP IN {location.label.toUpperCase()}?
          </h3>
          <p className="text-white/70 mt-3 mb-7 max-w-2xl mx-auto">
            Request a free inspection now, and our team will help you understand next steps for repairs and insurance.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/#inspection"
              className="px-6 py-3 text-white font-bold tracking-wider uppercase hover:opacity-90 transition-opacity text-sm"
              style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
            >
              REQUEST INSPECTION
            </a>
            <a
              href="/locations"
              className="px-6 py-3 text-white border border-white/40 font-bold tracking-wider uppercase text-sm hover:border-white"
              style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.08em" }}
            >
              VIEW ALL LOCATIONS
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
