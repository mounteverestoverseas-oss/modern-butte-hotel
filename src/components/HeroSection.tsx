import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroCourtyard from "@/assets/hero-courtyard.png";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import { ArrowRight, Sparkles, CalendarIcon, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    scrollToSection("booking");
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Video Background */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <video
          src={heroVideo.url}
          poster={heroCourtyard}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 to-[rgba(40,30,25,0.45)]" />
      </div>

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

          {/* Inline Booking Widget */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "1s", animationFillMode: "backwards" }}
          >
            <div className="mt-8 mx-auto max-w-3xl bg-primary-foreground/10 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl p-4 md:p-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Check-in */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gold-accent" />
                        {checkIn ? format(checkIn, "MMM dd, yyyy") : <span className="text-primary-foreground/60">Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gold-accent" />
                        {checkOut ? format(checkOut, "MMM dd, yyyy") : <span className="text-primary-foreground/60">Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date < (checkIn || new Date())}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 [&>span]:text-primary-foreground [&>svg]:text-primary-foreground/60">
                      <Users className="mr-2 h-4 w-4 text-gold-accent" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  onClick={handleCheckAvailability}
                  className="w-full py-5 text-base font-semibold shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  Check Availability
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
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
