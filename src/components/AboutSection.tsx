import courtyardImage from "@/assets/courtyard.jpg";
import lobbyImage from "@/assets/lobby.jpg";
import { MapPin, Heart, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const AboutSection = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();

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
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className={`space-y-6 transition-all duration-1000 ${sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
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
          <div className={`relative transition-all duration-1000 delay-200 ${sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-gold-accent/20 rounded-lg blur-2xl opacity-50"></div>
            <img
              src={lobbyImage}
              alt="Hotel Lobby"
              className="relative rounded-lg shadow-2xl w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-card p-8 rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 border border-border group hover:-translate-y-2 ${
                featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div ref={imageRef} className={`relative h-[400px] rounded-lg overflow-hidden group transition-all duration-1000 ${imageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img
            src={courtyardImage}
            alt="Hotel Courtyard"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end transition-all duration-500">
            <div className="p-8 text-primary-foreground transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl font-bold mb-2">Peaceful Courtyard</h3>
              <p className="text-lg">A serene escape in the heart of the city</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
