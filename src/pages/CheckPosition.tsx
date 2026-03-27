import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Loader2, Search, Users, Hash, Megaphone, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const CheckPosition = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    name: string;
    position: number;
    referralCount: number;
    referralCode: string;
    status: string;
    announcement?: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    // Look up via RPC
    try {
      const { data, error: rpcError } = await supabase.rpc('get_waitlist_status', {
        user_email: email.trim().toLowerCase()
      });

      if (rpcError || !data || !data.name) {
        setError("Could not find your email. Have you joined the waitlist?");
        return;
      }

      // Read active announcement
      const { data: announcementData } = await supabase
        .from('announcements')
        .select('message')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      setResult({
        name: data.name,
        position: data.position,
        referralCount: data.referral_count,
        referralCode: data.referral_code,
        status: data.status,
        announcement: announcementData && announcementData.length > 0 ? announcementData[0].message : undefined,
      });
    } catch {
      setError("Could not find your email. Have you joined the waitlist?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 min-h-screen">
        <div className="px-6 md:px-10 py-4 border-b border-border">
          <p className="text-label">Position Checker</p>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
              Check Your <span className="text-gradient">Position</span>
            </h1>
            <p className="text-muted-foreground text-sm mb-10 max-w-md">
              Enter the email you used to join the waitlist and see where you stand in the queue.
            </p>

            <form onSubmit={handleCheck} className="mb-12">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full border-b border-border bg-transparent py-3 pl-6 text-foreground text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50"
                    maxLength={255}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-primary-foreground px-6 py-3 text-xs font-medium uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <>Check <ArrowUpRight size={14} /></>}
                </motion.button>
              </div>
              {error && <p className="text-xs text-destructive mt-3">{error}</p>}
            </form>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Announcement */}
                {result.announcement && (
                  <div className="border border-primary/30 bg-primary/5 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Megaphone size={14} className="text-primary" />
                      <p className="text-label text-primary">Admin Announcement</p>
                    </div>
                    <p className="text-sm text-foreground/90">{result.announcement}</p>
                  </div>
                )}

                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-border p-6 text-center flex flex-col justify-center min-h-[140px]">
                    {result.status === 'approved' ? (
                      <>
                        <div className="mx-auto mb-3 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check size={18} className="text-primary" />
                        </div>
                        <p className="text-xl md:text-2xl font-serif text-primary uppercase tracking-widest font-bold">Access Granted</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Welcome to the inner circle</p>
                      </>
                    ) : (
                      <>
                        <Hash size={16} className="mx-auto mb-3 text-muted-foreground" />
                        <p className="text-3xl font-serif text-primary">#{result.position}</p>
                        <p className="text-label mt-2">Queue Position</p>
                      </>
                    )}
                  </div>
                  <div className="border border-border p-6 text-center">
                    <Users size={16} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-3xl font-serif text-foreground">{result.referralCount}</p>
                    <p className="text-label mt-2">Friends Referred</p>
                  </div>
                  <div className="border border-border p-6 text-center">
                    <ArrowUpRight size={16} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-3xl font-serif text-foreground">{result.referralCount * 3}</p>
                    <p className="text-label mt-2">Positions Gained</p>
                  </div>
                </div>

                {/* Referral link */}
                <div className="border border-border p-5">
                  <p className="text-label mb-3">Your Referral Link</p>
                  <code className="text-xs text-foreground/80 bg-secondary p-2 block truncate">
                    {window.location.origin}?ref={result.referralCode}
                  </code>
                  <p className="text-xs text-muted-foreground mt-3">
                    Share this link — each signup moves you up the queue.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckPosition;
