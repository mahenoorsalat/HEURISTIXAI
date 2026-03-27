import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import heroProduct from "@/assets/hero-product.jpg";
import heroWorkspace from "@/assets/hero-workspace.jpg";
import heroAbstract from "@/assets/hero-abstract.jpg";
import WaitlistSignup from "./WaitlistSignup";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-20 border-b border-border">
      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[calc(100vh-5rem)]">
        {/* Left image column */}
        <div className="hidden md:block md:col-span-2 border-r border-border relative">
          <img
            src={heroProduct}
            alt="HeuristixAI product"
            className="w-full h-64 object-cover"
            width={640}
            height={800}
          />
          <div className="p-4">
            <p className="text-label">HeuristixAI</p>
            <p className="text-label mt-1">20-25'</p>
          </div>
        </div>

        {/* Main hero content */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-between p-6 md:p-10 lg:p-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-label">[ Pioneering AI ]</span>
            </span>
            <span className="text-label ml-auto hidden md:block">[ 8K+ People Trust Us ]</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95] tracking-tight text-foreground">
              Intelligent AI,
              <br />
              Bold Solutions,
              <br />
              <span className="text-gradient">Timeless Impact.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 md:mt-auto"
          >
            <div className="flex items-start gap-4 max-w-md">
              <div className="mt-1 flex-shrink-0">
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">✦</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We don't just build AI. We strip away the noise, 
                leaving only what matters: intelligent systems, precise insights, 
                and solutions that evolve.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right column with images + CTA */}
        <div className="col-span-1 md:col-span-3 border-l border-border flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border">
              <p className="text-label text-right">©2025</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-1">
              <img
                src={heroWorkspace}
                alt="AI workspace"
                className="w-full aspect-square object-cover border-b border-border"
                loading="lazy"
                width={512}
                height={512}
              />
              <img
                src={heroAbstract}
                alt="Abstract AI"
                className="w-full aspect-square object-cover border-b border-border"
                loading="lazy"
                width={512}
                height={512}
              />
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-primary p-6 flex items-center justify-center gap-3 cursor-pointer transition-all"
              onClick={() => {
                document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-primary-foreground font-semibold text-sm uppercase tracking-wider">
                Join Waitlist
              </span>
              <ArrowUpRight size={20} className="text-primary-foreground" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Logos bar */}
      <div className="border-t border-border">
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          <p className="text-label">60+ Companies Trust Us</p>
          <p className="text-label hidden md:block">↓ Scroll Down</p>
        </div>
        <div className="flex items-center justify-around px-6 md:px-10 py-6 border-t border-border overflow-x-auto gap-8">
          {["NeuralCore", "DataPrime", "SynthLabs", "CogniTech", "QuantumAI"].map((name) => (
            <div key={name} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 rounded-full border border-foreground/30 flex items-center justify-center">
                <span className="text-[10px] text-foreground/60">◆</span>
              </div>
              <span className="text-sm font-medium tracking-wide text-foreground/80">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
