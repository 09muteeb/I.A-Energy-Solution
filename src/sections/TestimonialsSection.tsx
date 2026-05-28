import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "The 5KVA system powers our entire home. Our electricity bill dropped by 80%. Best investment we've made.",
    name: "Ahmed Khan",
    location: "Lahore",
    avatar: "/images/avatars/avatar-1.jpg",
  },
  {
    quote: "I.A Energy installed a 10KVA system for our shop. Professional team, excellent after-sales service.",
    name: "Fatima Rizvi",
    location: "Karachi",
    avatar: "/images/avatars/avatar-2.jpg",
  },
  {
    quote: "The 15KVA commercial plant runs our factory operations smoothly. Highly recommend for businesses.",
    name: "Imran Sheikh",
    location: "Islamabad",
    avatar: "/images/avatars/avatar-3.jpg",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const cards = section.querySelectorAll(".testimonial-card");
          cards.forEach((card, i) => {
            setTimeout(() => {
              (card as HTMLElement).style.opacity = "1";
              (card as HTMLElement).style.transform = "translateY(0)";
            }, i * 150);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="container-main">
        {/* Header */}
        <div className="mb-12">
          <p
            className="font-display text-xs font-medium uppercase tracking-[0.15em] mb-4"
            style={{ color: "var(--accent)" }}
          >
            Testimonials
          </p>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(28px, 3.5vw, 48px)",
            }}
          >
            What Our<br />Customers Say
          </h2>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card relative rounded-lg p-8 transition-all duration-500 hover:border-[var(--accent)]/30"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                opacity: 0,
                transform: "translateY(30px)",
              }}
            >
              {/* Decorative quote */}
              <span
                className="absolute top-4 left-6 font-display font-bold leading-none select-none"
                style={{
                  fontSize: "80px",
                  color: "var(--accent)",
                  opacity: 0.2,
                }}
              >
                &ldquo;
              </span>

              <p
                className="relative z-10 italic leading-relaxed mb-6 mt-8"
                style={{
                  color: "var(--text-primary)",
                  fontSize: "clamp(14px, 1.1vw, 16px)",
                }}
              >
                {t.quote}
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4
                    className="font-display font-semibold text-base"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.name}
                  </h4>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
