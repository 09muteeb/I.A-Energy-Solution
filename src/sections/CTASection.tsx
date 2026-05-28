import { Link } from "react-router";
import { useEffect, useRef } from "react";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const content = section.querySelector(".cta-content");
          if (content) {
            (content as HTMLElement).style.opacity = "1";
            (content as HTMLElement).style.transform = "translateY(0)";
          }
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-40 px-6"
      style={{
        background: "linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))",
      }}
    >
      <div
        className="cta-content max-w-[800px] mx-auto text-center transition-all duration-700"
        style={{ opacity: 0, transform: "translateY(30px)" }}
      >
        <h2
          className="font-display font-bold uppercase leading-[0.95] tracking-[-0.03em]"
          style={{
            color: "var(--text-primary)",
            fontSize: "clamp(48px, 8vw, 100px)",
          }}
        >
          <span className="block">Ready to Go</span>
          <span className="block">Solar?</span>
        </h2>
        <p
          className="mt-6 mx-auto max-w-[600px] leading-relaxed"
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(16px, 1.3vw, 20px)",
          }}
        >
          Get a free consultation and quote for your home or business. Our experts are ready to help.
        </p>
        <Link to="/contact" className="btn-primary mt-10 inline-block">
          Get Free Quote
        </Link>
      </div>
    </section>
  );
}
