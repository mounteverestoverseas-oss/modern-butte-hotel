import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Users, Sparkles, Check } from "lucide-react";
import { bookingStore, useBookingSearch } from "@/stores/bookingStore";
import { differenceInCalendarDays } from "date-fns";

type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  amenities: string[];
};

type Props = { visible: boolean };

export const AvailabilityResults = ({ visible }: Props) => {
  const search = useBookingSearch();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    supabase
      .from("rooms")
      .select("*")
      .order("price_per_night", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setRooms(data as Room[]);
        setLoading(false);
      });
  }, [visible]);

  if (!visible) return null;

  const nights =
    search.checkIn && search.checkOut
      ? Math.max(1, differenceInCalendarDays(new Date(search.checkOut), new Date(search.checkIn)))
      : 1;

  const available = rooms.filter((r) => r.max_guests >= search.guests);

  const handleSelect = (slug: string) => {
    bookingStore.set({ selectedRoomSlug: slug });
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="availability" className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Available Rooms</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {nights} {nights === 1 ? "night" : "nights"} · {search.guests}{" "}
            {search.guests === 1 ? "guest" : "guests"}
          </h2>
          <p className="text-muted-foreground">
            Choose from our handpicked rooms for your stay
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Checking availability…</div>
        ) : available.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No rooms match your group size. Try fewer guests.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {available.map((room) => {
              const total = Number(room.price_per_night) * nights;
              return (
                <Card
                  key={room.id}
                  className="overflow-hidden border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-semibold">{room.name}</h3>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Users className="w-3 h-3" /> {room.max_guests}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                    <ul className="space-y-1 mb-5">
                      {room.amenities.slice(0, 4).map((a) => (
                        <li key={a} className="text-sm flex items-center gap-2 text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-primary" /> {a}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold text-foreground">
                            ${Number(room.price_per_night).toFixed(0)}
                            <span className="text-sm font-normal text-muted-foreground"> / night</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total: ${total.toFixed(0)} for {nights} {nights === 1 ? "night" : "nights"}
                          </div>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => handleSelect(room.slug)}>
                        Book {room.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
