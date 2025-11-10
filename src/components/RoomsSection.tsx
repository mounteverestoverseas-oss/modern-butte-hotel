import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import { Users, Wifi, Coffee, Tv } from "lucide-react";

export const RoomsSection = () => {
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
    <section id="rooms" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
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
              className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-border"
            >
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
                  {room.price}/night
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-foreground">{room.title}</h3>
                <div className="flex items-center text-muted-foreground mb-3">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{room.capacity}</span>
                </div>
                <p className="text-muted-foreground mb-4">{room.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {amenity}
                    </div>
                  ))}
                </div>
                <Button onClick={scrollToBooking} className="w-full">
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
