import { Link } from "react-router";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X, ShoppingCart, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const formatPrice = (price: number) => `PKR ${price.toLocaleString("en-PK")}`;
  const shipping = totalPrice > 500000 ? 0 : 2500;

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <section className="pt-28 pb-8 px-6">
        <div className="container-main">
          <h1
            className="font-display font-bold leading-[1.0] mb-2"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(36px, 5vw, 72px)",
            }}
          >
            Your Cart
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Review your items before checkout.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="pb-24 px-6">
        <div className="container-main">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart size={64} className="mx-auto mb-6 opacity-20" />
              <h2 className="font-display font-semibold text-xl mb-2" style={{ color: "var(--text-primary)" }}>
                Your cart is empty
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Browse our products and add items to your cart.
              </p>
              <Link to="/shop" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 rounded-lg"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <Link to={`/product/${item.slug}`}>
                          <h3
                            className="font-display font-medium text-sm transition-colors hover:text-[var(--accent)]"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 ml-2 transition-colors hover:text-[var(--error)]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center rounded" style={{ border: "1px solid var(--border)" }}>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-white/5 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-white/5 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-display font-semibold ml-auto" style={{ color: "var(--text-primary)" }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div
                  className="sticky top-24 p-8 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h3 className="font-display font-semibold text-lg mb-6" style={{ color: "var(--text-primary)" }}>
                    Order Summary
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                      <span style={{ color: "var(--text-primary)" }}>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                      <span style={{ color: shipping === 0 ? "var(--success)" : "var(--text-primary)" }}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    {totalPrice > 0 && totalPrice <= 500000 && (
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Add {formatPrice(500000 - totalPrice)} more for free shipping
                      </p>
                    )}
                    <div
                      className="pt-4 border-t flex justify-between"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className="font-display font-semibold" style={{ color: "var(--text-primary)" }}>
                        Total
                      </span>
                      <span className="font-display font-bold text-lg" style={{ color: "var(--accent)" }}>
                        {formatPrice(totalPrice + shipping)}
                      </span>
                    </div>
                  </div>
                  <Link to="/checkout" className="btn-primary w-full text-center block">
                    Proceed to Checkout
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                  <Link
                    to="/shop"
                    className="block text-center mt-4 text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
