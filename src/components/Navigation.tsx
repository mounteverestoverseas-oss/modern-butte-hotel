import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", id: "hero" },
    { name: "Rooms", id: "rooms" },
    { name: "Gallery", id: "gallery" },
    { name: "Amenities", id: "amenities" },
    { name: "Contact", id: "contact" },
  ];

  return (
  const textColor = isScrolled ? "text-foreground" : "text-primary-foreground";
  const logoColor = isScrolled ? "text-primary" : "text-primary-foreground";
  const taglineColor = isScrolled ? "text-muted-foreground" : "text-primary-foreground/70";
  const mobileIconColor = isScrolled ? "text-foreground" : "text-primary-foreground";

  const textColor = isScrolled ? "text-foreground" : "text-primary-foreground";
  const logoColor = isScrolled ? "text-primary" : "text-primary-foreground";
  const taglineColor = isScrolled ? "text-muted-foreground" : "text-primary-foreground/70";
  const mobileIconColor = isScrolled ? "text-foreground" : "text-primary-foreground";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/95 backdrop-blur-xl shadow-2xl border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => scrollToSection("hero")}>
          <div className={`text-2xl font-bold ${logoColor} group-hover:scale-105 transition-transform duration-300`}>NEWA HOME</div>
          <div className={`hidden md:block text-xs ${taglineColor} group-hover:text-primary transition-colors duration-300`}>Boutique Hotel</div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`relative text-sm font-medium ${textColor} hover:text-primary transition-colors duration-300 group`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <Button onClick={() => scrollToSection("booking")} variant="default" className="hover:scale-105 hover:shadow-lg transition-all duration-300">
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden ${mobileIconColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors py-2"
              >
                {link.name}
              </button>
            ))}
            <Button onClick={() => scrollToSection("booking")} className="w-full">
              Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
