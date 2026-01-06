import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import RolesSection from "@/components/home/RolesSection";
import UpcomingDrives from "@/components/home/UpcomingDrives";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <UpcomingDrives />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
