import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const WaitlistSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [position, setPosition] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Get referral from URL
  const urlParams = new URLSearchParams(window.location.search);
  const referredBy = urlParams.get("ref") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Save to Supabase
    try {
      const code = `hx-${Math.random().toString(36).substring(2, 8)}`;
      
      let insertRes = await supabase
        .from('waitlist')
        .insert([
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            referral_code: code,
            referred_by: referredBy || null
          }
        ]);

      // If invalid referral code, retry without it
      if (insertRes.error && insertRes.error.code === '23503') {
        insertRes = await supabase
          .from('waitlist')
          .insert([
            {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              referral_code: code,
              referred_by: null
            }
          ]);
      }

      if (insertRes.error) {
        if (insertRes.error.code === '23505') {
            // Check if they are actually approved
            const { data: posData } = await supabase.rpc('get_waitlist_status', {
              user_email: email.trim().toLowerCase()
            });
            
            if (posData?.status === 'approved') {
               // Instead of error, show success screen
               setReferralCode(posData.referral_code);
               setPosition(0); // 0 indicates Access Granted
               setSuccess(true);
               toast({
                 title: "Welcome back! 🎉",
                 description: "You've already been granted access.",
               });
               return;
            } else {
               setError("This email is already on the waitlist.");
            }
        } else {
            setError("A network error occurred. Please try again. " + insertRes.error.message);
        }
        return;
      }

      // Check position via RPC
      const { data: posData } = await supabase.rpc('get_waitlist_status', {
        user_email: email.trim().toLowerCase()
      });

      setReferralCode(code);
      setPosition(posData?.position || 1);
      setSuccess(true);
      toast({
        title: "You're on the list! 🎉",
        description: "Check your email for confirmation.",
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="waitlist-form" className="border-b border-border">
      <div className="px-6 md:px-10 py-4 border-b border-border">
        <p className="text-label">[03] Join the Waitlist</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left - description */}
        <div className="p-6 md:p-10 lg:p-16 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-foreground mb-6">
              Be First in Line.
              <br />
              <span className="text-gradient">Shape the Future.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-8">
              Join our exclusive waitlist and get early access to HeuristixAI's 
              groundbreaking AI platform. Refer friends to move up the queue — 
              the higher you climb, the sooner you're in.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-serif text-primary">8K+</p>
                <p className="text-label mt-1">Already Waiting</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-serif text-foreground">3x</p>
                <p className="text-label mt-1">Avg. Referral Boost</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right - form */}
        <div className="p-6 md:p-10 lg:p-16 flex items-center">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6"
              >
                <div>
                  <label className="text-label mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full border-b border-border bg-transparent py-3 text-foreground text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="text-label mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full border-b border-border bg-transparent py-3 text-foreground text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50"
                    maxLength={255}
                  />
                </div>

                {referredBy && (
                  <p className="text-xs text-primary">
                    ✦ You were referred by a friend — you'll get a bonus boost!
                  </p>
                )}

                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-4 font-medium text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Join the Waitlist <ArrowUpRight size={16} />
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-muted-foreground text-center">
                  No spam. Unsubscribe anytime. Your data stays safe.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-6"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Check size={20} className="text-primary" />
                </div>
                <h3 className="text-2xl font-serif text-foreground">
                  {position === 0 ? "Access Granted!" : "You're In!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {position === 0 ? (
                    <>Welcome to the inner circle. Your early access is now <span className="text-primary font-semibold">active</span>.</>
                  ) : (
                    <>You're <span className="text-primary font-semibold">#{position}</span> in the queue. Share your referral link to move up faster.</>
                  )}
                </p>

                <div className="border border-border p-4 space-y-3">
                  <p className="text-label">Your Referral Link</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-foreground/80 bg-secondary p-2 truncate">
                      {referralLink}
                    </code>
                    <button
                      onClick={copyLink}
                      className="p-2 border border-border transition-colors hover:bg-secondary"
                    >
                      {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Each friend that signs up with your link bumps you up the queue.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSignup;
