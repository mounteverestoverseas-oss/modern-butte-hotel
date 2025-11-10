import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 15, 15, 0.7), rgba(40, 30, 25, 0.5)), url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 text-center z-10">
        <div className="animate-fade-in">
          <p className="text-primary-foreground/80 text-sm md:text-base tracking-widest uppercase mb-4">
            Welcome to
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
            Newa Home
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 font-light">
            Boutique Hotel in Kathmandu
          </p>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience the perfect blend of traditional Nepalese charm and modern luxury. 
            A peaceful sanctuary in the heart of Kathmandu with stunning mountain views.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("booking")}
              className="group px-8 py-6 text-lg"
            >
              Book Your Stay
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("rooms")}
              className="px-8 py-6 text-lg bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
            >
              Explore Rooms
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};
