import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import ElectricArcCanvas from "@/components/ElectricArcCanvas";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    content.style.opacity = "1";
    content.style.transform = "translateY(0)";
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ height: "100vh" }}
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/hero-solar.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 0,
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 80%, rgba(10,10,10,1) 100%)",
        }}
      />

      {/* Electric arcs */}
      <ElectricArcCanvas />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto transition-all duration-1000"
        style={{ opacity: 0, transform: "translateY(30px)" }}
      >
        <p
          className="font-display text-xs font-medium uppercase tracking-[0.15em] mb-6"
          style={{ color: "var(--accent)" }}
        >
          Premium Solar &amp; Inverter Solutions
        </p>

        <h1
          className="font-display font-bold uppercase leading-[0.95] tracking-[-0.03em]"
          style={{
            color: "var(--text-primary)",
            fontSize: "clamp(48px, 8vw, 120px)",
            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
          }}
        >
          <span className="block">Power Your</span>
          <span className="block">World</span>
        </h1>

        <p
          className="mt-6 mx-auto max-w-[600px] leading-relaxed"
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(16px, 1.3vw, 20px)",
            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
          }}
        >
          From 5KVA home systems to 15KVA commercial plants. Reliable, efficient, and built for Pakistan&apos;s energy needs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/shop" className="btn-primary">
            Shop Now
          </Link>
          <Link to="/shop" className="btn-secondary">
            View Systems
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-pulse-glow"
      >
        <ChevronDown size={24} style={{ color: "var(--text-muted)" }} />
      </div>
    </section>
  );
}
