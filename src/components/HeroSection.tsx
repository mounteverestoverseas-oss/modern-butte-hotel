import { Button } from "@/components/ui/button";
import heroCourtyard from "@/assets/hero-courtyard.png";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundImage: `linear-gradient(135deg, rgba(15, 15, 15, 0.65), rgba(40, 30, 25, 0.45)), url(${heroCourtyard})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Animated Overlay Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

      {/* Content */}
      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className="space-y-6">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20 animate-fade-in-down">
            <Sparkles className="w-4 h-4 text-gold-accent animate-pulse" />
            <span className="text-primary-foreground/90 text-sm tracking-wider uppercase">
              Welcome to Luxury
            </span>
          </div>

          {/* Main Heading with Stagger Animation */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-tight animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
              Newa Home
            </h1>
            <p className="text-xl md:text-3xl text-primary-foreground/90 font-light animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
              Boutique Hotel in Kathmandu
            </p>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}>
            Experience the perfect blend of traditional Nepalese charm and modern luxury. 
            A peaceful sanctuary in the heart of Kathmandu with authentic cultural ambiance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "backwards" }}>
            <Button
              size="lg"
              onClick={() => scrollToSection("booking")}
              className="group px-8 py-6 text-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
            >
              Book Your Stay
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("rooms")}
              className="px-8 py-6 text-lg bg-primary-foreground/10 backdrop-blur-md text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:border-primary-foreground hover:scale-105 transition-all duration-300"
            >
              Explore Rooms
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center cursor-pointer hover:border-primary-foreground transition-colors" onClick={() => scrollToSection("about")}>
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
