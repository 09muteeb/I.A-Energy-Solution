import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastContainer";
import { ShoppingCart, Search } from "lucide-react";

const categories = [
  { label: "All", value: "" },
  { label: "Home Systems", value: "home_system" },
  { label: "Commercial", value: "commercial" },
  { label: "Inverters", value: "inverter" },
  { label: "Batteries", value: "battery" },
  { label: "Accessories", value: "accessory" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsCartOpen } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = trpc.product.list.useQuery({
    category: activeCategory || undefined,
    search: debouncedSearch || undefined,
    page: 1,
    limit: 12,
  });

  const products = data?.products ?? [];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || products.length === 0) return;

    const cards = section.querySelectorAll(".shop-card");
    cards.forEach((card, i) => {
      (card as HTMLElement).style.opacity = "0";
      (card as HTMLElement).style.transform = "translateY(30px)";
      setTimeout(() => {
        (card as HTMLElement).style.opacity = "1";
        (card as HTMLElement).style.transform = "translateY(0)";
      }, i * 100);
    });
  }, [products.length, activeCategory, debouncedSearch]);

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

  const formatPrice = (price: string) => `PKR ${Number(price).toLocaleString("en-PK")}`;

  return (
    <main>
      {/* Header */}
      <section
        className="pt-32 pb-12 px-6"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="container-main">
          <h1
            className="font-display font-bold leading-[1.0] mb-4"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(36px, 5vw, 72px)",
            }}
          >
            Our Shop
          </h1>
          <p
            className="max-w-[600px] leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: "clamp(16px, 1.3vw, 20px)" }}
          >
            Browse our complete range of solar power systems and accessories.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section
        className="sticky top-16 z-50 py-4 px-6"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container-main flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-5 py-2 rounded-full text-xs font-display font-medium uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor:
                    activeCategory === cat.value
                      ? "var(--accent)"
                      : "transparent",
                  color:
                    activeCategory === cat.value
                      ? "var(--bg-primary)"
                      : "var(--text-secondary)",
                  border:
                    activeCategory === cat.value
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full sm:w-auto">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 pr-4 py-2 w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section
        className="py-10 px-6 pb-24"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="container-main">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden animate-pulse"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-full"
                    style={{
                      aspectRatio: "16/10",
                      backgroundColor: "var(--bg-tertiary)",
                    }}
                  />
                  <div className="p-6 space-y-3">
                    <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-tertiary)", width: "60%" }} />
                    <div className="h-3 rounded" style={{ backgroundColor: "var(--bg-tertiary)", width: "40%" }} />
                    <div className="h-6 rounded" style={{ backgroundColor: "var(--bg-tertiary)", width: "30%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ color: "var(--text-muted)" }}>No products found.</p>
            </div>
          ) : (
            <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="shop-card group rounded-lg overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease",
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
                  <Link
                    to={`/product/${product.slug}`}
                    className="block relative overflow-hidden"
                    style={{ aspectRatio: "16/10" }}
                  >
                    <img
                      src={product.image ?? ""}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-5">
                    <Link to={`/product/${product.slug}`}>
                      <h3
                        className="font-display font-semibold text-sm mb-1 transition-colors hover:text-[var(--accent)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs mb-3 capitalize" style={{ color: "var(--text-muted)" }}>
                      {product.category?.replace("_", " ")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-display font-bold"
                        style={{ color: "var(--accent)", fontSize: "16px" }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 rounded transition-all hover:bg-[var(--accent)] hover:text-[var(--bg-primary)]"
                        style={{
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
