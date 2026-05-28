import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastContainer";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const { addItem, setIsCartOpen } = useCart();
  const { addToast } = useToast();

  const { data: product, isLoading } = trpc.product.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  const { data: related } = trpc.product.getRelated.useQuery(
    {
      productId: product?.id ?? 0,
      category: product?.category ?? "",
      limit: 3,
    },
    { enabled: !!product }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image ?? "",
        price: Number(product.price),
      },
      quantity
    );
    addToast(`${product.name} added to cart`, "success");
    setIsCartOpen(true);
  };

  const formatPrice = (price: string) => `PKR ${Number(price).toLocaleString("en-PK")}`;

  const specs = product?.specs ? JSON.parse(product.specs as string) as Record<string, string> : {};

  const reviews = [
    { name: "Ali Hassan", rating: 5, date: "2025-04-15", comment: "Excellent product! Installation was smooth and the system works perfectly." },
    { name: "Sara Ahmed", rating: 5, date: "2025-03-20", comment: "Very satisfied with the quality. Customer support was very helpful." },
    { name: "Usman Khan", rating: 4, date: "2025-02-10", comment: "Good value for money. Would recommend to anyone looking for solar solutions." },
  ];

  if (isLoading) {
    return (
      <main className="pt-24 pb-20 px-6" style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="rounded-lg" style={{ backgroundColor: "var(--bg-secondary)", aspectRatio: "16/10" }} />
            <div className="space-y-6">
              <div className="h-8 rounded" style={{ backgroundColor: "var(--bg-secondary)", width: "60%" }} />
              <div className="h-6 rounded" style={{ backgroundColor: "var(--bg-secondary)", width: "30%" }} />
              <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-secondary)", width: "100%" }} />
              <div className="h-4 rounded" style={{ backgroundColor: "var(--bg-secondary)", width: "80%" }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 pb-20 px-6" style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <div className="container-main text-center py-20">
          <h2 className="font-display font-bold text-2xl mb-4" style={{ color: "var(--text-primary)" }}>
            Product Not Found
          </h2>
          <Link to="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Product Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="container-main">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <img
                src={product.image ?? ""}
                alt={product.name}
                className="w-full h-auto object-cover"
                style={{ aspectRatio: "16/10" }}
              />
            </div>

            {/* Info */}
            <div>
              <p className="text-xs uppercase tracking-wider mb-2 capitalize" style={{ color: "var(--text-muted)" }}>
                {product.category?.replace("_", " ")}
              </p>
              <h1
                className="font-display font-bold leading-[1.0] mb-4"
                style={{
                  color: "var(--text-primary)",
                  fontSize: "clamp(28px, 3.5vw, 48px)",
                }}
              >
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(Number(product.rating)) ? "var(--accent)" : "none"}
                      style={{
                        color:
                          i < Math.round(Number(product.rating))
                            ? "var(--accent)"
                            : "var(--border)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <p
                className="font-display font-bold mb-6"
                style={{
                  color: "var(--accent)",
                  fontSize: "clamp(24px, 3vw, 40px)",
                }}
              >
                {formatPrice(product.price)}
              </p>

              <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                {product.description}
              </p>

              {/* Specs quick view */}
              <div className="mb-8 space-y-2">
                {Object.entries(specs).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex text-sm">
                    <span className="w-1/3" style={{ color: "var(--text-muted)" }}>{key}</span>
                    <span style={{ color: "var(--text-primary)" }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Quantity</span>
                <div className="flex items-center rounded" style={{ border: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/5 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white/5 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <button onClick={handleAddToCart} className="btn-primary w-full mb-3">
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
              <Link to="/checkout" className="btn-primary w-full text-center block" style={{ backgroundColor: "var(--accent-dark)" }}>
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 px-6" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="container-main">
          {/* Tab nav */}
          <div className="flex gap-8 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="pb-4 font-display text-sm font-medium uppercase tracking-wider transition-colors relative"
                style={{
                  color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {tab === "description" ? "Description" : tab === "specs" ? "Specifications" : "Reviews"}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "description" && (
            <div className="max-w-3xl">
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <table className="w-full">
                <tbody>
                  {Object.entries(specs).map(([key, value], i) => (
                    <tr
                      key={key}
                      className="border-b"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <td className="py-3 px-4 text-sm font-medium w-1/2" style={{ color: "var(--text-muted)" }}>
                        {key}
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: "var(--text-primary)" }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-3xl">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                        style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}
                      >
                        {review.name[0]}
                      </div>
                      <div>
                        <h4 className="font-display font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                          {review.name}
                        </h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              fill={j < review.rating ? "var(--accent)" : "none"}
                              style={{ color: j < review.rating ? "var(--accent)" : "var(--border)" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{review.date}</span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related && related.length > 0 && (
        <section className="py-16 px-6 pb-24" style={{ backgroundColor: "var(--bg-primary)" }}>
          <div className="container-main">
            <h2
              className="font-display font-bold mb-8"
              style={{ color: "var(--text-primary)", fontSize: "clamp(24px, 3vw, 36px)" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="group rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    <img
                      src={p.image ?? ""}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      {p.name}
                    </h3>
                    <p className="font-display font-bold" style={{ color: "var(--accent)" }}>
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
