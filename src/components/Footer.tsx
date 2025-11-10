import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-deep-slate text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">NEWA HOME</h3>
            <p className="text-primary-foreground/70 mb-4">
              Your tranquil retreat in the heart of Kathmandu, offering the perfect blend 
              of traditional charm and modern comfort.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  Near Thamel, Kathmandu, Nepal
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-primary-foreground/70">+977 9812345678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-primary-foreground/70">info@newahomehotel.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Hours</h5>
              <p className="text-primary-foreground/70">24/7 Reception</p>
              <p className="text-primary-foreground/70 text-sm">Always here for you</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 Newa Home Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
