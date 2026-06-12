import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { RoomsSection } from "@/components/RoomsSection";
import { GallerySection } from "@/components/GallerySection";
import { BookingSection } from "@/components/BookingSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { Footer } from "@/components/Footer";
import { AvailabilityResults } from "@/components/AvailabilityResults";
import { useBookingSearch } from "@/stores/bookingStore";

const Index = () => {
  const { showResults } = useBookingSearch();
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AvailabilityResults visible={showResults} />
      <AboutSection />
      <RoomsSection />
      <GallerySection />
      <AmenitiesSection />
      <BookingSection />
      <Footer />
    </div>
  );
};

export default Index;
