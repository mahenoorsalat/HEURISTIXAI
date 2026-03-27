import { motion } from "framer-motion";
import { BrainCircuit, Zap, Lock, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Neural Synergy Engine",
    description: "Our proprietary AI models adapt to your workflow instantly, generating insights faster than humanly possible.",
    icon: BrainCircuit,
  },
  {
    title: "Lightning Automation",
    description: "Connect 500+ apps without a single line of code. Let the AI handle the repetitive tasks while you focus on strategy.",
    icon: Zap,
  },
  {
    title: "Enterprise Grade Security",
    description: "Your data is encrypted, anonymized, and completely isolated in military-grade secure SOC2 compliant servers.",
    icon: Lock,
  },
  {
    title: "Predictive Analytics",
    description: "Stop guessing what happens next. Foresee trends and market shifts securely before they even occur.",
    icon: BarChart3,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="border-b border-border py-16 md:py-24">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
            Built for the <span className="text-primary italic">Future</span>.
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Experience unparalleled speed and extreme accuracy powered by HeuristixAI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="border border-border p-8 hover:bg-secondary/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 text-primary mb-6">
                <feature.icon size={20} />
              </div>
              <h3 className="text-lg font-serif text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
