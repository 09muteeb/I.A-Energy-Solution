import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "HOME", path: "/" },
    { label: "SHOP", path: "/shop" },
    { label: "CONTACT", path: "/contact" },
  ];

  const showSolid = scrolled || !isHome;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          height: "64px",
          backgroundColor: showSolid ? "var(--bg-primary)" : "transparent",
          backdropFilter: showSolid ? "blur(12px)" : "none",
          WebkitBackdropFilter: showSolid ? "blur(12px)" : "none",
          borderBottom: showSolid ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="container-main h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-display font-bold text-base uppercase tracking-[0.15em]"
            style={{ color: "var(--text-primary)" }}
          >
            I.A ENERGY
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-display text-sm font-medium uppercase tracking-[0.1em] transition-colors duration-200 hover:text-[var(--accent)]"
                style={{
                  color:
                    location.pathname === link.path
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[10px] font-bold rounded-full w-5 h-5 animate-fade-in"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--bg-primary)",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-display uppercase tracking-wider transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 p-2 transition-colors hover:text-[var(--accent)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <User size={20} />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[99] pt-16 md:hidden animate-fade-in"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <nav className="flex flex-col items-center gap-8 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-display text-lg font-medium uppercase tracking-[0.1em]"
                style={{
                  color:
                    location.pathname === link.path
                      ? "var(--accent)"
                      : "var(--text-primary)",
                }}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="font-display text-lg font-medium uppercase tracking-[0.1em]"
                style={{ color: "var(--text-muted)" }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="font-display text-lg font-medium uppercase tracking-[0.1em]"
                style={{ color: "var(--text-primary)" }}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
