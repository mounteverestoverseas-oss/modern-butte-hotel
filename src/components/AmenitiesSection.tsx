import { Wifi, Coffee, Utensils, Car, Shield, Wind } from "lucide-react";

export const AmenitiesSection = () => {
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
        <div className="text-center mb-16">
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
              className="flex items-start space-x-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <amenity.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
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
