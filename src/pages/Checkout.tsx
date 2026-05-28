import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastContainer";
import { CheckCircle2, ArrowLeft, X } from "lucide-react";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, totalPrice, removeItem, clearCart } = useCart();
  const { addToast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const shipping = totalPrice > 500000 ? 0 : 2500;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      setOrderId(data.orderId);
      setOrderPlaced(true);
      clearCart();
      addToast("Order placed successfully!", "success");
    },
    onError: (error) => {
      addToast(error.message || "Failed to place order", "error");
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    if (items.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    createOrder.mutate({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalPrice + shipping,
      subtotal: totalPrice,
      shipping,
      paymentMethod: data.paymentMethod,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      notes: data.notes,
    });
  };

  const formatPrice = (price: number) => `PKR ${price.toLocaleString("en-PK")}`;

  if (orderPlaced && orderId) {
    return (
      <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fade-in">
          <CheckCircle2 size={64} style={{ color: "var(--success)" }} className="mx-auto mb-6" />
          <h2 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>
            Order Placed Successfully!
          </h2>
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            Thank you for your purchase.
          </p>
          <p className="text-sm mb-8 font-display" style={{ color: "var(--accent)" }}>
            Order #{orderId}
          </p>
          <Link to="/shop" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--text-primary)" }}>
            Your cart is empty
          </h2>
          <Link to="/shop" className="btn-primary inline-block">Browse Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <section className="pt-28 pb-8 px-6">
        <div className="container-main">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1
            className="font-display font-bold leading-[1.0] mb-2"
            style={{ color: "var(--text-primary)", fontSize: "clamp(36px, 5vw, 72px)" }}
          >
            Secure Checkout
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Complete your order by filling in your details below.
          </p>
          {/* Progress */}
          <div className="flex items-center gap-4 mt-6 text-xs font-display uppercase tracking-wider">
            <span style={{ color: "var(--text-muted)" }}>Cart</span>
            <span style={{ color: "var(--border)" }}>&rarr;</span>
            <span style={{ color: "var(--accent)" }}>Information</span>
            <span style={{ color: "var(--border)" }}>&rarr;</span>
            <span style={{ color: "var(--text-muted)" }}>Payment</span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-6">
        <div className="container-main">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <div>
                <h3 className="font-display font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Email
                    </label>
                    <input {...register("email")} type="email" className="input-field" placeholder="your@email.com" />
                    {errors.email && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Phone
                    </label>
                    <input {...register("phone")} type="tel" className="input-field" placeholder="+92-300-1234567" />
                    {errors.phone && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="font-display font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Full Name
                    </label>
                    <input {...register("fullName")} type="text" className="input-field" placeholder="Full Name" />
                    {errors.fullName && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Street Address
                    </label>
                    <input {...register("address")} type="text" className="input-field" placeholder="123 Main Street" />
                    {errors.address && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                        City
                      </label>
                      <select {...register("city")} className="input-field">
                        <option value="">Select City</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.city && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                        Province
                      </label>
                      <select {...register("province")} className="input-field">
                        <option value="">Select Province</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                      </select>
                      {errors.province && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.province.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                        Postal Code
                      </label>
                      <input {...register("postalCode")} type="text" className="input-field" placeholder="54000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Order Notes (Optional)
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Special instructions..."
                />
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-display font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <label
                    className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all"
                    style={{
                      backgroundColor: watch("paymentMethod") === "cod" ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                      border: `1px solid ${watch("paymentMethod") === "cod" ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    <input
                      type="radio"
                      value="cod"
                      {...register("paymentMethod")}
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>Cash on Delivery</span>
                  </label>
                  <label
                    className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all"
                    style={{
                      backgroundColor: watch("paymentMethod") === "bank_transfer" ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                      border: `1px solid ${watch("paymentMethod") === "bank_transfer" ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    <input
                      type="radio"
                      value="bank_transfer"
                      {...register("paymentMethod")}
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>Bank Transfer</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right - Summary */}
            <div className="lg:col-span-1">
              <div
                className="sticky top-24 p-6 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3 className="font-display font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
                  Order Summary
                </h3>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="p-1 hover:text-[var(--error)] transition-colors"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div
                  className="space-y-3 pt-4 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
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
                  <div className="flex justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <span className="font-display font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
                    <span className="font-display font-bold" style={{ color: "var(--accent)" }}>
                      {formatPrice(totalPrice + shipping)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="btn-primary w-full mt-6 disabled:opacity-50"
                >
                  {createOrder.isPending ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
