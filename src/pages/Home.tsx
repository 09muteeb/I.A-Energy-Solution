import HeroSection from "@/sections/HeroSection";
import StatsBar from "@/sections/StatsBar";
import ProductsShowcase from "@/sections/ProductsShowcase";
import ServicesSection from "@/sections/ServicesSection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import CTASection from "@/sections/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <ProductsShowcase />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
