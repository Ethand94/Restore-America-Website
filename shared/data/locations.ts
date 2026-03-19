export type ServiceLocation = {
  slug: string;
  label: string;
  city: string;
  stateCode: "GA" | "FL" | "MO";
  stateName: string;
  heroDescription: string;
  metaDescription: string;
  commonIssues: string[];
  nearbyAreas: string[];
  faqs: { question: string; answer: string }[];
  services: { label: string; href: string }[];
};

export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    slug: "atlanta-ga",
    label: "Atlanta, GA",
    city: "Atlanta",
    stateCode: "GA",
    stateName: "Georgia",
    heroDescription:
      "From hail and high wind to aging roof systems, our team handles inspections, documentation, repairs, and insurance claim support across Metro Atlanta.",
    metaDescription:
      "Roofing and storm damage restoration in Atlanta, GA. Free inspections, insurance claim support, and rapid emergency response.",
    commonIssues: [
      "Hail and wind shingle damage after severe storms",
      "Interior leaks from flashing or valley failure",
      "Tree impact and emergency tarp stabilization",
    ],
    nearbyAreas: ["Buckhead", "Midtown", "East Atlanta", "Sandy Springs"],
    faqs: [
      {
        question: "How long does a roof replacement take in Atlanta?",
        answer:
          "Most residential roof replacements in Metro Atlanta are completed within 1–3 days depending on the size and complexity. After your free inspection, our team provides a detailed timeline so you know exactly what to expect.",
      },
      {
        question: "Does Restore America handle insurance claims for Atlanta homeowners?",
        answer:
          "Yes. We work directly with your insurance company throughout the entire claims process. Our team documents all damage, prepares a detailed scope of work, and communicates with your adjuster to ensure your claim is properly handled.",
      },
      {
        question: "What types of storm damage are most common in Atlanta?",
        answer:
          "Atlanta frequently experiences severe hail, high winds, and heavy rain. The most common damage we see includes shingle bruising and granule loss from hail, wind uplift along ridges and edges, and interior water intrusion from compromised flashing around chimneys and vents.",
      },
      {
        question: "Do you offer free roof inspections in Atlanta?",
        answer:
          "Absolutely. Every inspection is completely free with no obligation. We use drone technology and hands-on assessment to document the full condition of your roof and provide a transparent report you can use with your insurance company.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hail & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
  {
    slug: "walton-county-ga",
    label: "Walton County, GA",
    city: "Walton County",
    stateCode: "GA",
    stateName: "Georgia",
    heroDescription:
      "We provide full roofing and restoration support throughout Walton County, including damage assessments, mitigation, and full rebuild coordination.",
    metaDescription:
      "Roof replacement and storm restoration in Walton County, GA. Free inspections and insurance guidance from Restore America.",
    commonIssues: [
      "Wind uplift and missing shingles",
      "Storm-driven leaks around chimneys and vents",
      "Water intrusion requiring mitigation and rebuild",
    ],
    nearbyAreas: ["Monroe", "Loganville", "Social Circle", "Good Hope"],
    faqs: [
      {
        question: "What areas does Restore America cover in Walton County?",
        answer:
          "We serve all of Walton County including Monroe, Loganville, Social Circle, Good Hope, and surrounding rural communities. Our crews are based locally so response times are fast, even after major storms.",
      },
      {
        question: "How do I know if my Walton County home has storm damage?",
        answer:
          "Many types of storm damage are not visible from the ground. Signs to look for include missing or lifted shingles, dented gutters, granules collecting in downspouts, and water spots on interior ceilings. Our free inspection uses close-up and drone assessment to find damage you may not see.",
      },
      {
        question: "Can you help with insurance paperwork in Walton County?",
        answer:
          "Yes. We prepare professional damage documentation with photos, measurements, and a detailed scope of work. We then work alongside your insurance adjuster to make sure nothing is missed and your claim reflects the full extent of the damage.",
      },
      {
        question: "How quickly can you respond to storm damage in Walton County?",
        answer:
          "We maintain local crews in the Walton County area, allowing us to respond within 24–48 hours for initial assessments. For emergencies like active leaks or structural concerns, we prioritize same-day response with tarping and board-up services.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hail & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
  {
    slug: "jersey-ga",
    label: "Jersey, GA",
    city: "Jersey",
    stateCode: "GA",
    stateName: "Georgia",
    heroDescription:
      "Jersey is one of our core home markets. We help homeowners move from first inspection to final restoration with clear communication at every step.",
    metaDescription:
      "Local roofing and restoration services in Jersey, GA. Fire, flood, hail, and wind damage specialists with free inspections.",
    commonIssues: [
      "Aging roof system wear and active leaks",
      "Hail bruising and granule loss",
      "Tree limb impact after storms",
    ],
    nearbyAreas: ["Covington", "Monroe", "Loganville", "Walnut Grove"],
    faqs: [
      {
        question: "Is Restore America a local company in Jersey, GA?",
        answer:
          "Yes. Jersey is one of our home markets. Our team lives and works in the area, which means faster response times and a deeper understanding of the specific weather challenges and building styles common to this community.",
      },
      {
        question: "What should I do immediately after storm damage to my Jersey home?",
        answer:
          "First, document any visible damage with photos from the ground. Avoid climbing on the roof. Then call us for a free professional inspection. If there's an active leak, we can provide emergency tarping to prevent further interior damage while we coordinate the full repair.",
      },
      {
        question: "Do you work with all insurance companies in Georgia?",
        answer:
          "Yes, we work with every major homeowner's insurance carrier in Georgia. Our documentation process is designed to meet the specific requirements that adjusters look for, which helps move your claim forward smoothly and efficiently.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hail & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
  {
    slug: "orlando-fl",
    label: "Orlando, FL",
    city: "Orlando",
    stateCode: "FL",
    stateName: "Florida",
    heroDescription:
      "Orlando properties face heavy rain, wind, and weather-related roof stress. Our team provides fast assessments and complete restoration planning.",
    metaDescription:
      "Roof and storm restoration in Orlando, FL. Fast response, free inspections, and insurance-claim support for homeowners.",
    commonIssues: [
      "Wind-driven rain leaks and underlayment failure",
      "Storm damage to shingles, vents, and flashing",
      "Moisture intrusion and interior ceiling damage",
    ],
    nearbyAreas: ["Winter Park", "Lake Nona", "Altamonte Springs", "Kissimmee"],
    faqs: [
      {
        question: "How does Florida's hurricane season affect my Orlando roof?",
        answer:
          "Central Florida's hurricane season (June–November) brings sustained high winds, heavy rain, and flying debris that can compromise shingles, flashing, and underlayment. Even storms that don't make direct landfall can cause significant roof damage. We recommend a free inspection before and after each season.",
      },
      {
        question: "Does Restore America offer emergency services in Orlando?",
        answer:
          "Yes. We provide 24/7 emergency tarping and board-up services for Orlando homeowners dealing with active leaks or structural compromise after a storm. Our goal is to stabilize your property quickly while we coordinate the full scope of repairs.",
      },
      {
        question: "How do Florida insurance claims work for roof damage?",
        answer:
          "Florida has specific timelines and requirements for filing property damage claims. We help you document damage thoroughly, file promptly, and meet with your adjuster to ensure nothing is overlooked. Our team stays current with Florida statute changes that may affect your coverage.",
      },
      {
        question: "What roofing materials work best in Orlando's climate?",
        answer:
          "We typically recommend impact-resistant architectural shingles or metal roofing for Orlando properties due to their superior wind and moisture resistance. During your free inspection, we'll assess your existing system and recommend the best materials for your specific situation and budget.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hurricane & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
  {
    slug: "tampa-fl",
    label: "Tampa, FL",
    city: "Tampa",
    stateCode: "FL",
    stateName: "Florida",
    heroDescription:
      "We serve Tampa with emergency response, roof repair, and full restoration services tailored to Gulf Coast weather and claim timelines.",
    metaDescription:
      "Tampa roofing and restoration experts for storm, wind, and water damage. Request a free inspection with Restore America.",
    commonIssues: [
      "Wind and tropical storm roof damage",
      "Persistent leaks from compromised flashing",
      "Water damage requiring mitigation and reconstruction",
    ],
    nearbyAreas: ["Brandon", "Riverview", "South Tampa", "Temple Terrace"],
    faqs: [
      {
        question: "How do Gulf Coast storms affect Tampa roofs differently?",
        answer:
          "Tampa's position on the Gulf Coast means exposure to salt air, tropical storms, and sustained high humidity. This combination accelerates wear on flashing, fasteners, and underlayment. Our Tampa inspections specifically look for corrosion, moisture infiltration, and wind-weakened connections that are unique to coastal properties.",
      },
      {
        question: "Can you help if my Tampa insurance claim was denied?",
        answer:
          "We can provide additional documentation and a supplemental damage report that may support a re-evaluation of your claim. While we are not public adjusters, our detailed inspection reports and scope documentation have helped many Tampa homeowners get claims reconsidered.",
      },
      {
        question: "What is your typical response time in the Tampa area?",
        answer:
          "For standard inspections, we typically schedule within 24–48 hours. For emergencies involving active leaks or structural concerns, we deploy same-day tarping and stabilization crews to protect your property from further damage.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hurricane & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
  {
    slug: "jacksonville-fl",
    label: "Jacksonville, FL",
    city: "Jacksonville",
    stateCode: "FL",
    stateName: "Florida",
    heroDescription:
      "Across Jacksonville, we help homeowners recover quickly after storm events with inspection reports, claim support, and quality restoration work.",
    metaDescription:
      "Storm and roofing restoration in Jacksonville, FL. Free inspection, rapid response, and insurance assistance from Restore America.",
    commonIssues: [
      "Coastal wind exposure and shingle loss",
      "Roof deck moisture issues after heavy rain",
      "Flood-related interior damage and mitigation needs",
    ],
    nearbyAreas: ["Arlington", "Mandarin", "Riverside", "Orange Park"],
    faqs: [
      {
        question: "Does Jacksonville's coastal location cause specific roof problems?",
        answer:
          "Yes. Jacksonville's proximity to the Atlantic means properties face salt air corrosion, coastal wind pressure, and heavy seasonal rainfall. These conditions degrade roofing fasteners and underlayment faster than inland areas. We tailor our repair approach to account for these coastal-specific factors.",
      },
      {
        question: "How do I prepare my Jacksonville roof for hurricane season?",
        answer:
          "Schedule a free pre-season inspection with our team. We check for loose or damaged shingles, weakened flashing, compromised sealant, and potential debris risks from nearby trees. Addressing issues before storm season is far less expensive than emergency repairs after a hurricane.",
      },
      {
        question: "Do you handle both roofing and interior water damage in Jacksonville?",
        answer:
          "Yes. We provide full-service restoration that covers roof repair, water extraction, drying, mold prevention, and interior rebuild. Having one contractor manage the entire process simplifies your insurance claim and ensures consistent quality from first response to final walkthrough.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hurricane & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
  {
    slug: "st-louis-mo",
    label: "St. Louis, MO",
    city: "St. Louis",
    stateCode: "MO",
    stateName: "Missouri",
    heroDescription:
      "St. Louis weather can shift quickly from hail to high winds. We provide dependable inspection and restoration services for residential properties.",
    metaDescription:
      "St. Louis, MO roofing and storm restoration. Free inspections, insurance claim support, and complete build-back services.",
    commonIssues: [
      "Severe hail impact and shingle bruising",
      "Wind-driven ridge and flashing damage",
      "Tree strike emergencies requiring immediate protection",
    ],
    nearbyAreas: ["Clayton", "Chesterfield", "Florissant", "University City"],
    faqs: [
      {
        question: "How common is hail damage in St. Louis?",
        answer:
          "St. Louis sits within one of the most active hail corridors in the country. The metro area averages multiple significant hail events per year. Damage often includes shingle bruising, cracked flashing, and dented gutters that may not be visible from the ground but can lead to leaks over time.",
      },
      {
        question: "What is the timeline for a roof insurance claim in Missouri?",
        answer:
          "Missouri law requires insurance companies to acknowledge a claim within 10 business days and make a decision within 30 days. Our team prepares comprehensive damage documentation upfront so your claim starts strong. We stay in contact with your adjuster through the entire process.",
      },
      {
        question: "Do you offer winter roofing services in St. Louis?",
        answer:
          "Yes, we work year-round in St. Louis. While some roofing work is weather-dependent, many repair and restoration tasks can be performed during colder months. We always prioritize safety and material performance, and we'll advise you honestly if a project is better suited for warmer conditions.",
      },
      {
        question: "Can ice dams damage my St. Louis roof?",
        answer:
          "Absolutely. St. Louis winters bring freeze-thaw cycles that create ice dams along eaves and valleys. These dams force water under shingles and into the roof deck. Our inspections identify ice dam risk factors and we can install preventive solutions like improved ventilation and ice-and-water shield barriers.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hail & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
  {
    slug: "kansas-city-mo",
    label: "Kansas City, MO",
    city: "Kansas City",
    stateCode: "MO",
    stateName: "Missouri",
    heroDescription:
      "We support Kansas City homeowners with proactive inspections, detailed documentation, and full-service restoration after weather-related losses.",
    metaDescription:
      "Kansas City roofing and disaster restoration services. Free inspections and trusted help through every step of the insurance process.",
    commonIssues: [
      "Hail and wind roof system damage",
      "Leak paths around penetrations and valleys",
      "Storm debris damage requiring repairs and cleanup",
    ],
    nearbyAreas: ["Overland Park", "Lee's Summit", "North Kansas City", "Independence"],
    faqs: [
      {
        question: "What makes Kansas City particularly vulnerable to roof damage?",
        answer:
          "Kansas City sits at the intersection of cold northern air and warm Gulf moisture, creating severe thunderstorms with large hail and damaging winds. The metro area regularly experiences storms capable of causing widespread shingle damage, flashing failure, and structural impact from fallen trees.",
      },
      {
        question: "How do I file a roof damage claim in Kansas City?",
        answer:
          "Contact your insurance company to report the damage, then schedule a free inspection with us. We document everything with photos, measurements, and a professional scope of work. We can also meet with your adjuster on-site to walk through the damage together, ensuring full and fair coverage.",
      },
      {
        question: "Do you serve both sides of the Kansas City metro?",
        answer:
          "Yes. We serve homeowners throughout the greater Kansas City area including Missouri-side neighborhoods and communities in Johnson County and the broader KC metro. Our coverage extends to Overland Park, Lee's Summit, Independence, North Kansas City, and surrounding areas.",
      },
      {
        question: "What is included in your free Kansas City roof inspection?",
        answer:
          "Our inspection includes a full roof assessment with ground-level and close-up evaluation, gutter and downspout review, flashing and penetration checks, and interior moisture scanning where applicable. You receive a detailed written report with photos that you can share directly with your insurance company.",
      },
    ],
    services: [
      { label: "Roof Repair & Replacement", href: "/#services" },
      { label: "Hail & Wind Damage", href: "/#services" },
      { label: "Water Damage Restoration", href: "/#services" },
      { label: "Fire Damage Recovery", href: "/#services" },
      { label: "Emergency Tarping & Board-Up", href: "/#services" },
      { label: "Insurance Claim Support", href: "/#services" },
    ],
  },
];

const SERVICE_LOCATION_BY_SLUG = new Map(
  SERVICE_LOCATIONS.map((location) => [location.slug, location])
);

export const getServiceLocationBySlug = (slug: string) =>
  SERVICE_LOCATION_BY_SLUG.get(slug) ?? null;
