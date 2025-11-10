import { Wifi, Coffee, Utensils, Car, Shield, Wind, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const AmenitiesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const amenities = [
    {
      icon: Wifi,
      title: "Free WiFi",
      description: "High-speed internet throughout the property",
    },
    {
      icon: Utensils,
      title: "Rooftop Dining",
      description: "Enjoy meals with stunning mountain views",
    },
    {
      icon: Coffee,
      title: "Breakfast Included",
      description: "Complimentary breakfast every morning",
    },
    {
      icon: Car,
      title: "Airport Transfer",
      description: "Convenient pickup and drop-off service",
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Your safety is our priority",
    },
    {
      icon: Wind,
      title: "Air Conditioning",
      description: "Climate control in all rooms",
    },
  ];

  return (
    <section id="amenities" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted backdrop-blur-sm rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-foreground font-medium">Premium Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hotel Amenities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a comfortable and memorable stay
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className={`flex items-start space-x-4 p-6 rounded-lg bg-card border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <amenity.icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {amenity.title}
                </h3>
                <p className="text-muted-foreground">{amenity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
