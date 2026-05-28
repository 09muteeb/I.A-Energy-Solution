import { useEffect, useRef } from "react";

const services = [
  { label: "Free Site Survey", detail: "We visit your location to assess energy needs, roof structure, and sun exposure." },
  { label: "Custom System Design", detail: "Tailored solar solutions optimized for your specific power requirements." },
  { label: "Professional Installation", detail: "Certified technicians install your system with precision and care." },
  { label: "Grid-Tie & Off-Grid", detail: "Flexible connection options including net metering and battery backup." },
  { label: "Maintenance Plans", detail: "Regular inspections and cleaning to keep your system at peak performance." },
  { label: "24/7 Monitoring", detail: "Real-time system performance tracking via mobile app and dashboard." },
  { label: "Warranty Service", detail: "Comprehensive warranties on panels, inverters, and installation work." },
  { label: "Upgrade Path", detail: "Easy system expansion as your energy needs grow over time." },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const items = section.querySelectorAll(".service-item");
          items.forEach((item, i) => {
            setTimeout(() => {
              (item as HTMLElement).style.opacity = "1";
              (item as HTMLElement).style.transform = "translateY(0)";
            }, i * 100);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container-main">
        {/* Header */}
        <div className="mb-16">
          <p
            className="font-display text-xs font-medium uppercase tracking-[0.15em] mb-4"
            style={{ color: "var(--accent)" }}
          >
            What We Offer
          </p>
          <h2
            className="font-display font-bold leading-[1.0] mb-6"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(36px, 5vw, 72px)",
            }}
          >
            Complete Energy<br />Solutions
          </h2>
          <p
            className="max-w-[600px] leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: "clamp(16px, 1.3vw, 20px)" }}
          >
            From consultation to installation and beyond, we handle every aspect of your solar power system.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {services.map((service, i) => (
            <div
              key={service.label}
              className="service-item py-6 transition-all duration-500"
              style={{
                borderBottom: "1px solid var(--border)",
                borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none",
                paddingRight: i % 2 === 0 ? "24px" : "0",
                paddingLeft: i % 2 === 1 ? "24px" : "0",
                opacity: 0,
                transform: "translateY(20px)",
                textAlign: i % 2 === 1 ? "right" : "left",
              }}
            >
              <h3
                className="font-display font-semibold text-lg uppercase mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {service.label}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {service.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
