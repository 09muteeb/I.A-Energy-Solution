import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/providers/trpc";
import { useToast } from "@/components/ToastContainer";
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      reset();
      addToast("Message sent successfully!", "success");
    },
    onError: (error) => {
      addToast(error.message || "Failed to send message", "error");
    },
  });

  const onSubmit = (data: ContactForm) => {
    submitContact.mutate(data);
  };

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <section className="pt-28 pb-12 px-6">
        <div className="container-main">
          <h1
            className="font-display font-bold leading-[1.0] mb-4"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(36px, 5vw, 72px)",
            }}
          >
            Get In Touch
          </h1>
          <p
            className="max-w-[600px] leading-relaxed"
            style={{ color: "var(--text-secondary)", fontSize: "clamp(16px, 1.3vw, 20px)" }}
          >
            Have questions? Our team is here to help you find the perfect solar solution.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-24 px-6">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              {submitted ? (
                <div
                  className="p-12 rounded-lg text-center animate-fade-in"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <CheckCircle2 size={48} style={{ color: "var(--success)" }} className="mx-auto mb-4" />
                  <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>
                    Message Sent!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Full Name
                    </label>
                    <input {...register("fullName")} type="text" className="input-field" placeholder="Your Name" />
                    {errors.fullName && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.fullName.message}</p>}
                  </div>
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
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Subject
                    </label>
                    <select {...register("subject")} className="input-field">
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Installation">Installation</option>
                      <option value="Support">Support</option>
                      <option value="Quote Request">Quote Request</option>
                    </select>
                    {errors.subject && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Message
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      className="input-field resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                    {errors.message && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="lg:pl-12">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    <Phone size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      Phone
                    </h4>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>+92-300-1234567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    <Mail size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      Email
                    </h4>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>info@iaenergy.pk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    <MapPin size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      Address
                    </h4>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Main Boulevard, Lahore, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    <Clock size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      Business Hours
                    </h4>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Mon - Sat: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
