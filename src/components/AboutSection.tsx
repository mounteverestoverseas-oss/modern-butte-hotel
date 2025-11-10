import courtyardImage from "@/assets/courtyard.jpg";
import lobbyImage from "@/assets/lobby.jpg";
import { MapPin, Heart, Award } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Minutes from Thamel, close to Kathmandu's best attractions",
    },
    {
      icon: Heart,
      title: "Traditional Charm",
      description: "Authentic Nepalese architecture with modern amenities",
    },
    {
      icon: Award,
      title: "Premium Service",
      description: "Personalized hospitality for an unforgettable stay",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Your Home Away From Home
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover a tranquil retreat in the heart of Kathmandu at Newa Home Hotel. 
              Our boutique hotel is the perfect blend of traditional charm and modern comfort, 
              offering a cozy and peaceful haven just moments away from the vibrant streets of Thamel.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each room is thoughtfully designed with warm décor, plush bedding, and all the 
              amenities you need for a restful stay. After a day of exploring, return to a space 
              that feels like home.
            </p>
          </div>
          <div className="relative">
            <img
              src={lobbyImage}
              alt="Hotel Lobby"
              className="rounded-lg shadow-xl w-full h-[500px] object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-border"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={courtyardImage}
            alt="Hotel Courtyard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-primary-foreground">
              <h3 className="text-3xl font-bold mb-2">Peaceful Courtyard</h3>
              <p className="text-lg">A serene escape in the heart of the city</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
