import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import courtyard from "@/assets/courtyard.jpg";
import rooftopDining from "@/assets/rooftop-dining.jpg";
import lobby from "@/assets/lobby.jpg";
import heroBackground from "@/assets/hero-background.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Camera } from "lucide-react";

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const images = [
    { src: heroBackground, alt: "Rooftop View" },
    { src: roomDeluxe, alt: "Deluxe Room" },
    { src: courtyard, alt: "Hotel Courtyard" },
    { src: roomSuite, alt: "Suite with Mountain View" },
    { src: lobby, alt: "Traditional Lobby" },
    { src: rooftopDining, alt: "Rooftop Dining" },
    { src: roomStandard, alt: "Standard Room" },
  ];

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted backdrop-blur-sm rounded-full mb-4">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">Visual Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Photo Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our beautiful spaces and amenities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer group transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                <span className="text-primary-foreground font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{image.alt}</span>
              </div>
              <div className="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/50 transition-all duration-500 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Gallery"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
