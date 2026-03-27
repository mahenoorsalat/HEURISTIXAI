import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      {/* Top links */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-border">
      {[
        {
          title: "General",
          links: ["Home", "About", "Services", "Waitlist"],
        },
        {
          title: "Product",
          links: ["Platform", "API", "Pricing", "Documentation"],
        },
        {
          title: "Social",
          links: ["Instagram", "LinkedIn", "Twitter", "GitHub"],
        },
        {
          title: "Get in Touch",
          isEmail: true,
        },
      ].map((col) => (
        <div key={col.title} className="p-6 md:p-10 border-b sm:border-b-0 sm:border-r border-border last:border-0">
          <p className="text-label mb-4">{col.title}</p>
          {col.isEmail ? (
            <a
              href="mailto:hello@heuristixai.com"
              className="text-lg md:text-xl font-serif text-foreground hover:text-primary transition-colors break-all"
            >
              hello@heuristixai.com
            </a>
            ) : (
              <ul className="space-y-2">
                {col.links?.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-b border-border px-6 md:px-10 py-4">
        <p className="text-label">Creating with Purpose & Precision</p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-10 py-8 gap-6">
        <div>
          <p className="text-2xl font-semibold tracking-[0.15em] font-sans text-foreground">
            HEURISTIX<span className="text-primary">AI</span><sup className="text-xs text-muted-foreground">®</sup>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-xs text-muted-foreground">
          <span>© 2025 HeuristixAI. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
