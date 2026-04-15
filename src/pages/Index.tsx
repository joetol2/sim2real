import HeroSection from "@/components/HeroSection";
import VideoShowcase from "@/components/VideoShowcase";
import PositioningSection from "@/components/PositioningSection";
import SimulationSection from "@/components/SimulationSection";
import FocusCards from "@/components/FocusCards";
import StealthStatement from "@/components/StealthStatement";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <VideoShowcase />
      <PositioningSection />
      <SimulationSection />
      <FocusCards />
      <StealthStatement />
      <ContactCTA />
      <Footer />
    </main>
  );
};

export default Index;
