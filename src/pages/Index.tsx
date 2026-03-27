import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustedCompanies from "@/components/TrustedCompanies";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialSection from "@/components/TestimonialSection";
import WaitlistSignup from "@/components/WaitlistSignup";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
        <TrustedCompanies />
        <FeaturesSection />
        <AboutSection />
        <TestimonialSection />
        <WaitlistSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
