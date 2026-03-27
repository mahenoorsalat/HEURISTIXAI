import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="border-b border-border">
      <div className="px-6 md:px-10 py-4 border-b border-border flex items-center justify-between">
        <p className="text-label">[01] A Story Worth Telling</p>
      </div>

      <div className="px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
              <span className="text-sm text-muted-foreground">←→</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif leading-[1.15] text-foreground">
            HeuristixAI Builds for Teams that Value —{" "}
            <span className="italic">Clarity Over Complexity</span>, Believing that Meaningful{" "}
            AI Begins with Intention and Grows.
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
