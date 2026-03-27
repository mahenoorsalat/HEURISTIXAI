import { motion } from "framer-motion";
import testimonialAvatar from "@/assets/testimonial-avatar.jpg";

const TestimonialSection = () => {
  return (
    <section className="border-b border-border">
      <div className="px-6 md:px-10 py-4 border-b border-border">
        <p className="text-label">[02] What Early Users Say</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Testimonial */}
        <div className="p-6 md:p-10 lg:p-16 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <img
                src={testimonialAvatar}
                alt="Sarah Chen"
                className="w-14 h-14 rounded-full object-cover"
                loading="lazy"
                width={512}
                height={512}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Happy Early Adopter</p>
                <p className="text-label mt-0.5">CTO, NeuralCore</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl text-primary font-serif">"</span>
            </div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif leading-snug text-foreground mb-6">
              They captured our vision with surprising clarity. The process was 
              simple, collaborative, and the result feels timeless.
            </blockquote>
            <p className="text-sm text-muted-foreground">— Sarah C.</p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="p-6 md:p-10 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-label mb-8">→ Key Milestones</p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { value: "05+", label: "Years Experience" },
                { value: "120+", label: "Projects Completed" },
                { value: "50+", label: "AI Models Deployed" },
                { value: "92%", label: "Returning Clients" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <p className="text-3xl md:text-4xl font-serif text-primary">{stat.value}</p>
                  <p className="text-label mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
