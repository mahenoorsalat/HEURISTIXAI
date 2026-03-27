import { motion } from "framer-motion";

const companies = [
  "Acme Corp", "Globex", "Initech", "Soylent Corp", "Massive Dynamic", "Cyberdyne", "Wayne Enterprises", "Umbrella Corp"
];

const TrustedCompanies = () => {
  return (
    <section className="border-b border-border py-12 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8">
        <p className="text-label text-center">Trusted by innovative teams worldwide</p>
      </div>
      
      {/* Container must mask overflow precisely to create the marquee illusion */}
      <div className="relative flex w-full flex-nowrap overflow-hidden">
        {/* Gradient fade borders */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap items-center w-max"
        >
          {/* Double array for seamless looping width computation */}
          {[...companies, ...companies, ...companies, ...companies].map((company, idx) => (
            <span key={idx} className="mx-12 md:mx-20 text-2xl lg:text-3xl font-serif text-muted-foreground/30 font-semibold tracking-wide">
              {company}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
