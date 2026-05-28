import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastContainer";
import { ShoppingCart } from "lucide-react";

const tagColors: Record<string, string> = {
  bestseller: "var(--accent)",
  popular: "#8B5CF6",
  commercial: "var(--success)",
};

export default function ProductsShowcase() {
  const { data: featured } = trpc.product.getFeatured.useQuery();
  const { addItem, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const cards = section.querySelectorAll(".product-card");
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
  }, [featured]);

  const handleAddToCart = (product: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    price: string;
  }) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image || "",
      price: Number(product.price),
    });
    addToast(`${product.name} added to cart`, "success");
    setIsCartOpen(true);
  };

  const formatPrice = (price: string) => {
    return `PKR ${Number(price).toLocaleString("en-PK")}`;
  };

  const products = featured ?? [];

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
            Our Systems
          </p>
          <h2
            className="font-display font-bold leading-[1.0] mb-4"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(36px, 5vw, 72px)",
            }}
          >
            Find Your<br />Perfect System
          </h2>
          <p
            className="max-w-[500px] leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: "clamp(14px, 1.1vw, 16px)" }}
          >
            Home and commercial solar inverter solutions designed for reliability.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const tag = product.category === "home_system"
              ? product.name.includes("5")
                ? "bestseller"
                : "popular"
              : "commercial";
            return (
              <div
                key={product.id}
                className="product-card group rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  opacity: 0,
                  transform: "translateY(40px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,212,255,0.15)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                }}
              >
                {/* Image */}
                <Link to={`/product/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <img
                    src={product.image ?? ""}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {tag && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-display font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: tagColors[tag] || "var(--accent)",
                        color: "var(--bg-primary)",
                      }}
                    >
                      {tag}
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6">
                  <Link to={`/product/${product.slug}`}>
                    <h3
                      className="font-display font-semibold text-lg mb-1 transition-colors hover:text-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                    {product.category === "home_system"
                      ? product.name.includes("5")
                        ? "Perfect for small homes"
                        : "Ideal for medium homes"
                      : "For shops & businesses"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-display font-bold"
                      style={{
                        color: "var(--accent)",
                        fontSize: "clamp(20px, 2.5vw, 28px)",
                      }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 rounded text-xs font-display font-medium uppercase tracking-wider transition-all hover:scale-105"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <ShoppingCart size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
