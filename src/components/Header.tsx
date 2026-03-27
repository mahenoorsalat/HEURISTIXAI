import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Check Position", to: "/check-position" },
    { label: "Admin", to: "/admin" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 md:px-10 max-w-7xl mx-auto w-full">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="text-label">+</span>
          <Link to="/" className="text-xl md:text-2xl font-semibold tracking-[0.15em] font-sans text-foreground">
            HEURISTIX<span className="text-primary">AI</span>
          </Link>
          <span className="text-label">+</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/check-position"
            className="flex items-center gap-2 border border-foreground bg-foreground text-background px-5 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-transparent hover:text-foreground"
          >
            Check Status <ArrowUpRight size={14} />
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="py-4 text-2xl font-serif text-foreground/80 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
