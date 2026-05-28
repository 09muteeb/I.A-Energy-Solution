import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--border)" }}>
      <div className="container-main py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display font-bold text-lg uppercase tracking-wide mb-4" style={{ color: "var(--text-primary)" }}>
              I.A Energy Solution
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Premium solar and inverter solutions for homes and businesses across Pakistan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xs font-medium uppercase tracking-[0.08em] mb-6" style={{ color: "var(--accent)" }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Shop", path: "/shop" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-xs font-medium uppercase tracking-[0.08em] mb-6" style={{ color: "var(--accent)" }}>
              Products
            </h4>
            <ul className="space-y-3">
              {[
                { label: "5KVA Home", path: "/product/5kva-home-system" },
                { label: "10KVA Home", path: "/product/10kva-home-system" },
                { label: "15KVA Commercial", path: "/product/15kva-commercial-system" },
                { label: "Inverters", path: "/shop" },
                { label: "Batteries", path: "/shop" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs font-medium uppercase tracking-[0.08em] mb-6" style={{ color: "var(--accent)" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>info@iaenergy.pk</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>+92-300-1234567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Main Boulevard, Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-main py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            &copy; 2025 I.A Energy Solution. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Privacy Policy</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
