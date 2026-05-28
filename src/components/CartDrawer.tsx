import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useRef, useEffect } from "react";

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString("en-PK")}`;
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[150] bg-black/50 animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full z-[160] flex flex-col"
        style={{
          width: "clamp(320px, 100vw, 420px)",
          backgroundColor: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderLeft: "1px solid var(--glass-border)",
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} style={{ color: "var(--accent)" }} />
            <h3 className="font-display font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
              Your Cart ({totalItems})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: "var(--text-muted)" }}>Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 btn-primary text-xs py-2 px-6"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    {item.name}
                  </h4>
                  <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 rounded border hover:border-[var(--accent)] transition-colors"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 rounded border hover:border-[var(--accent)] transition-colors"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto p-1 hover:text-[var(--error)] transition-colors"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t space-y-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between items-center">
              <span className="font-display font-medium" style={{ color: "var(--text-secondary)" }}>
                Subtotal
              </span>
              <span className="font-display font-bold text-lg" style={{ color: "var(--accent)" }}>
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link
              to="/cart"
              onClick={() => setIsCartOpen(false)}
              className="btn-secondary w-full text-center py-3 text-xs"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary w-full text-center py-3 text-xs"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
