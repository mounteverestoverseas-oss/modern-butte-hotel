import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import lobby from "@/assets/lobby.jpg";
import courtyard from "@/assets/courtyard.jpg";
import rooftop from "@/assets/rooftop-dining.jpg";
import { Users, Sparkles, BedDouble, Maximize2, Bath, Coffee, Wifi, Tv } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Room = {
  title: string;
  image: string;
  gallery: string[];
  price: string;
  capacity: string;
  size: string;
  bed: string;
  view: string;
  description: string;
  longDescription: string;
  amenities: string[];
  features: string[];
};

export const RoomsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [selected, setSelected] = useState<Room | null>(null);

  const rooms: Room[] = [
    {
      title: "Deluxe Room",
      image: roomDeluxe,
      gallery: [roomDeluxe, lobby, courtyard],
      price: "$80",
      capacity: "2 Guests",
      size: "28 m²",
      bed: "Queen Bed",
      view: "Mountain View",
      description: "Elegant room with traditional Nepalese decor and premium amenities",
      longDescription:
        "Our Deluxe Room blends traditional Newari craftsmanship with modern comfort. Hand-carved wooden windows, warm ambient lighting and locally sourced textiles create a calm, authentic retreat after a day of exploring Kathmandu.",
      amenities: ["Free WiFi", "Smart TV", "Coffee Maker", "Mountain View"],
      features: [
        "Daily housekeeping",
        "Premium toiletries",
        "Rainfall shower",
        "Air conditioning",
        "In-room safe",
        "Complimentary breakfast",
      ],
    },
    {
      title: "Standard Room",
      image: roomStandard,
      gallery: [roomStandard, courtyard, lobby],
      price: "$60",
      capacity: "2 Guests",
      size: "22 m²",
      bed: "Double Bed",
      view: "Courtyard View",
      description: "Cozy room with brick walls and comfortable bedding",
      longDescription:
        "A warm and inviting space featuring exposed brick walls and handcrafted furniture. Perfect for travelers who want comfort, charm and an authentic feel of old Kathmandu without compromising on essentials.",
      amenities: ["Free WiFi", "Cable TV", "Mini Fridge", "City View"],
      features: [
        "Daily housekeeping",
        "Hot shower",
        "Work desk",
        "Reading nook",
        "Tea & coffee station",
        "Complimentary breakfast",
      ],
    },
    {
      title: "Suite",
      image: roomSuite,
      gallery: [roomSuite, rooftop, courtyard, lobby],
      price: "$120",
      capacity: "3 Guests",
      size: "45 m²",
      bed: "King Bed + Sofa",
      view: "Panoramic Mountain View",
      description: "Luxurious suite with balcony and breathtaking mountain views",
      longDescription:
        "Our signature Suite offers a private balcony with sweeping views of the Himalayas, a separate sitting area, and luxurious finishes throughout. The ideal sanctuary for couples, families, or guests who simply want more space to unwind.",
      amenities: ["Free WiFi", "Smart TV", "Sitting Area", "Balcony"],
      features: [
        "Private balcony",
        "Separate lounge",
        "Bathtub & rainfall shower",
        "Bathrobes & slippers",
        "Mini bar",
        "Priority check-in",
        "Complimentary breakfast",
      ],
    },
  ];

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="rooms" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gold-accent rounded-full filter blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Luxury Accommodations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Rooms</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully designed rooms, each offering comfort and tranquility
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <Card
              key={index}
              className={`overflow-hidden hover:shadow-2xl transition-all duration-500 border-border group hover:-translate-y-2 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setSelected(room)}>
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {room.price}/night
                </div>
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" /> {room.gallery.length} photos
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {room.title}
                </h3>
                <div className="flex items-center gap-4 text-muted-foreground mb-3 text-sm flex-wrap">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" />{room.capacity}</span>
                  <span className="flex items-center"><BedDouble className="w-4 h-4 mr-1.5" />{room.bed}</span>
                  <span className="flex items-center"><Maximize2 className="w-4 h-4 mr-1.5" />{room.size}</span>
                </div>
                <p className="text-muted-foreground mb-4">{room.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {room.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></div>
                      {amenity}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelected(room)} className="flex-1">
                    View Details
                  </Button>
                  <Button onClick={scrollToBooking} className="flex-1 group-hover:shadow-lg transition-shadow duration-300">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selected && (
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {selected.gallery.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="relative h-[300px] md:h-[420px] overflow-hidden">
                        <img src={img} alt={`${selected.title} ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              <div className="p-6 md:p-8">
                <DialogHeader className="text-left mb-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <DialogTitle className="text-3xl font-bold">{selected.title}</DialogTitle>
                      <DialogDescription className="mt-1">{selected.view}</DialogDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{selected.price}</div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Guests</div>
                      <div className="text-sm font-medium">{selected.capacity}</div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Bed</div>
                      <div className="text-sm font-medium">{selected.bed}</div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Size</div>
                      <div className="text-sm font-medium">{selected.size}</div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Bath className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Bath</div>
                      <div className="text-sm font-medium">En-suite</div>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">{selected.longDescription}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-primary" /> In-Room Amenities
                    </h4>
                    <ul className="space-y-2">
                      {selected.amenities.map((a, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-primary" /> Room Features
                    </h4>
                    <ul className="space-y-2">
                      {selected.features.map((f, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setSelected(null);
                      scrollToBooking();
                    }}
                    className="flex-1"
                  >
                    Book This Room
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
