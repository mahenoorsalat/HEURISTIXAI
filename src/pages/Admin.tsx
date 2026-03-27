import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  Loader2,
  Lock,
  LogOut,
  Megaphone,
  Search,
  Trash2,
  TrendingUp,
  Users,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  position: number;
  referral_count: number;
  referral_code: string;
  status: "pending" | "approved" | "removed";
  manual_bonus: number;
  created_at: string;
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [announcement, setAnnouncement] = useState("");
  const [currentAnnouncement, setCurrentAnnouncement] = useState("");
  const [announcementId, setAnnouncementId] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setAuthenticated(true);
    }
    setSessionChecked(true);
  };

  const fetchData = async () => {
    setLoading(true);
    // Fetch waitlist
    const { data: wData, error: wError } = await supabase
      .from("waitlist_with_position")
      .select("*")
      .neq("status", "removed")
      .order("position", { ascending: true });
      
    if (!wError && wData) {
      setWaitlist(wData as WaitlistEntry[]);
    }

    // Fetch active announcement
    const { data: aData } = await supabase
      .from("announcements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1);

    if (aData && aData.length > 0) {
      setCurrentAnnouncement(aData[0].message);
      setAnnouncementId(aData[0].id);
    } else {
      setCurrentAnnouncement("");
      setAnnouncementId("");
    }
    
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error || !data.user) {
      setLoginError(error?.message || "Invalid credentials.");
    } else {
      setAuthenticated(true);
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
  };

  const publishAnnouncement = async () => {
    if (!announcement.trim()) return;
    
    // Deactivate old
    if (announcementId) {
       await supabase.from("announcements").update({ active: false }).eq("id", announcementId);
    }
    
    const { error } = await supabase.from("announcements").insert([{ message: announcement }]);
    if (error) {
       toast({ title: "Error", description: "Failed to publish announcement", variant: "destructive" });
       return;
    }
      
    setCurrentAnnouncement(announcement);
    setAnnouncement("");
    toast({ title: "Announcement published!", description: "Users will see it on the position checker." });
    
    fetchData(); // Refresh to get new ID
  };

  const removeAnnouncement = async () => {
    if (!announcementId) return;
    await supabase.from("announcements").update({ active: false }).eq("id", announcementId);
    setCurrentAnnouncement("");
    setAnnouncementId("");
    toast({ title: "Announcement removed." });
  };

  const updateStatus = async (id: string, status: string, name: string) => {
    const { error } = await supabase.from("waitlist").update({ status }).eq("id", id);
    if (!error) {
      toast({ title: `${name} ${status === 'removed' ? 'removed from waitlist' : 'approved'}.` });
      fetchData();
    }
  };

  const adjustPosition = async (id: string, currentBonus: number, change: number, name: string) => {
    const { error } = await supabase.from("waitlist").update({ manual_bonus: currentBonus + change }).eq("id", id);
    if (!error) {
      toast({ title: `${name} moved ${change > 0 ? 'up' : 'down'}.` });
      fetchData();
    }
  };

  const exportCSV = () => {
    const headers = "Name,Email,Position,Referrals,Status,Signup Date\n";
    const rows = waitlist.map(
      (e) => `${e.name},${e.email},${e.position},${e.referral_count},${e.status},${new Date(e.created_at).toISOString()}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported!", description: "Waitlist data downloaded." });
  };

  const filteredWaitlist = waitlist.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!sessionChecked) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center"><Loader2 size={24} className="animate-spin text-primary" /></div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <Lock size={20} className="text-primary" />
              <h1 className="text-2xl font-serif text-foreground">Admin Access</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-label mb-2 block">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@heuristixai.com"
                  className="w-full border-b border-border bg-transparent py-3 text-foreground text-sm outline-none focus:border-primary placeholder:text-muted-foreground/50"
                  required
                />
              </div>
              <div>
                <label className="text-label mb-2 block">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-border bg-transparent py-3 text-foreground text-sm outline-none focus:border-primary placeholder:text-muted-foreground/50"
                  required
                />
              </div>
              {loginError && <p className="text-xs text-destructive">{loginError}</p>}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary text-primary-foreground py-4 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 transition-colors hover:brightness-110"
              >
                {loginLoading ? <Loader2 size={14} className="animate-spin" /> : <>Sign In <ArrowUpRight size={14} /></>}
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    );
  }

  const totalSignups = waitlist.length;
  const approvedCount = waitlist.filter(w => w.status === 'approved').length;
  const totalReferrals = waitlist.reduce((acc, current) => acc + current.referral_count, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative pb-20">
      <Header />
      <main className="pt-20 flex-1">
        {/* Top bar */}
        <div className="px-6 md:px-10 py-4 border-b border-border flex items-center justify-between">
          <p className="text-label">Admin Dashboard</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
          {[
            { label: "Total Signups", value: totalSignups.toString(), icon: Users, change: "Active" },
            { label: "Referrals Generated", value: totalReferrals.toString(), icon: TrendingUp, change: "Network" },
            { label: "Approved", value: approvedCount.toString(), icon: Check, change: "Granted" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 md:p-8 border-r border-border last:border-r-0">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon size={14} className="text-muted-foreground" />
                <p className="text-label">{stat.label}</p>
              </div>
              <p className="text-2xl md:text-3xl font-serif text-foreground">{stat.value}</p>
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Announcement */}
        <div className="px-6 md:px-10 py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={14} className="text-primary" />
            <p className="text-label">Broadcast Announcement</p>
          </div>
          {currentAnnouncement && (
            <div className="border border-primary/20 bg-primary/5 p-3 mb-4 flex items-start justify-between gap-4">
              <p className="text-xs text-foreground/80">{currentAnnouncement}</p>
              <button
                onClick={removeAnnouncement}
                className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                title="Remove current announcement"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <input
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Write a new announcement..."
              className="flex-1 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/50"
              maxLength={500}
            />
            <button
              onClick={publishAnnouncement}
              disabled={!announcement.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 text-xs font-medium uppercase tracking-wider disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Search + Filter + Export */}
        <div className="px-6 md:px-10 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full border-b border-border bg-transparent py-2 pl-5 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-secondary border border-border text-foreground text-xs px-3 py-2 outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
            >
              <Download size={12} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-16 text-center text-muted-foreground flex justify-center"><Loader2 className="animate-spin" size={24} /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 md:px-10 py-3 text-label font-medium min-w-[80px]">Pos</th>
                  <th className="px-4 py-3 text-label font-medium min-w-[150px]">Name</th>
                  <th className="px-4 py-3 text-label font-medium min-w-[200px]">Email</th>
                  <th className="px-4 py-3 text-label font-medium whitespace-nowrap">Referrals</th>
                  <th className="px-4 py-3 text-label font-medium">Status</th>
                  <th className="px-4 py-3 text-label font-medium whitespace-nowrap min-w-[120px]">Date</th>
                  <th className="px-4 py-3 text-label font-medium min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaitlist.map((entry) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-6 md:px-10 py-3 text-foreground font-medium">#{entry.position}</td>
                    <td className="px-4 py-3 text-foreground break-all">{entry.name}</td>
                    <td className="px-4 py-3 text-muted-foreground break-all">{entry.email}</td>
                    <td className="px-4 py-3 text-foreground">{entry.referral_count}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 whitespace-nowrap ${
                          entry.status === "approved"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {entry.status === "pending" && (
                          <button
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            title="Approve"
                            onClick={() => updateStatus(entry.id, 'approved', entry.name)}
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          title="Move up (+1 bonus)"
                          onClick={() => adjustPosition(entry.id, entry.manual_bonus, 1, entry.name)}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          title="Move down (-1 bonus)"
                          onClick={() => adjustPosition(entry.id, entry.manual_bonus, -1, entry.name)}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Remove"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${entry.name}?`)) {
                              updateStatus(entry.id, 'removed', entry.name)
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && filteredWaitlist.length === 0 && (
            <div className="px-6 md:px-10 py-16 text-center">
              <p className="text-muted-foreground text-sm">No waitlist entries found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
