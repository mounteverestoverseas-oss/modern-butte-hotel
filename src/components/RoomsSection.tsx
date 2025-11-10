import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import { Users, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const RoomsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const rooms = [
    {
      title: "Deluxe Room",
      image: roomDeluxe,
      price: "$80",
      capacity: "2 Guests",
      description: "Elegant room with traditional Nepalese decor and premium amenities",
      amenities: ["Free WiFi", "Smart TV", "Coffee Maker", "Mountain View"],
    },
    {
      title: "Standard Room",
      image: roomStandard,
      price: "$60",
      capacity: "2 Guests",
      description: "Cozy room with brick walls and comfortable bedding",
      amenities: ["Free WiFi", "Cable TV", "Mini Fridge", "City View"],
    },
    {
      title: "Suite",
      image: roomSuite,
      price: "$120",
      capacity: "3 Guests",
      description: "Luxurious suite with balcony and breathtaking mountain views",
      amenities: ["Free WiFi", "Smart TV", "Sitting Area", "Balcony"],
    },
  ];

  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="rooms" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-accent rounded-full filter blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Luxury Accommodations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Rooms
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully designed rooms, each offering comfort and tranquility
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <Card
              key={index}
              className={`overflow-hidden hover:shadow-2xl transition-all duration-500 border-border group hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {room.price}/night
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{room.title}</h3>
                <div className="flex items-center text-muted-foreground mb-3">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{room.capacity}</span>
                </div>
                <p className="text-muted-foreground mb-4">{room.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></div>
                      {amenity}
                    </div>
                  ))}
                </div>
                <Button onClick={scrollToBooking} className="w-full group-hover:shadow-lg transition-shadow duration-300">
                  Book This Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
