import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, Loader2 } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { useBookingSearch } from "@/stores/bookingStore";

type Room = {
  id: string;
  slug: string;
  name: string;
  price_per_night: number;
  max_guests: number;
};

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(3, "Phone is required").max(30),
});

export const BookingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const search = useBookingSearch();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("rooms")
      .select("id, slug, name, price_per_night, max_guests")
      .order("price_per_night", { ascending: true })
      .then(({ data }) => {
        if (data) setRooms(data as Room[]);
      });
  }, []);

  // Sync from hero search
  useEffect(() => {
    if (search.checkIn) setCheckIn(new Date(search.checkIn));
    if (search.checkOut) setCheckOut(new Date(search.checkOut));
    if (search.guests) setGuests(String(search.guests));
  }, [search.checkIn, search.checkOut, search.guests]);

  useEffect(() => {
    if (search.selectedRoomSlug && rooms.length) {
      const match = rooms.find((r) => r.slug === search.selectedRoomSlug);
      if (match) setRoomId(match.id);
    }
  }, [search.selectedRoomSlug, rooms]);

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const nights =
    checkIn && checkOut ? Math.max(1, differenceInCalendarDays(checkOut, checkIn)) : 0;
  const total = selectedRoom ? Number(selectedRoom.price_per_night) * nights : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut || !roomId) {
      toast.error("Please select dates and a room");
      return;
    }
    if (checkOut <= checkIn) {
      toast.error("Check-out must be after check-in");
      return;
    }
    const parsed = bookingSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      room_id: roomId,
      guest_name: parsed.data.name,
      guest_email: parsed.data.email,
      guest_phone: parsed.data.phone,
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: format(checkOut, "yyyy-MM-dd"),
      guests: Number(guests),
      total_price: total,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Could not submit booking. Please try again.");
      return;
    }

    toast.success("Booking request submitted! We'll contact you shortly.");
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests("2");
    setRoomId("");
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <section id="booking" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-accent/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div ref={ref} className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Reserve Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Book Your Stay</h2>
            <p className="text-lg text-muted-foreground">Reserve your perfect room at Newa Home Hotel</p>
          </div>

          <Card className={`shadow-2xl border-border backdrop-blur-sm bg-card/95 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <CardHeader>
              <CardTitle className="text-2xl">Reservation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date()} className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d < (checkIn || new Date())} className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <Select value={roomId} onValueChange={setRoomId}>
                      <SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger>
                      <SelectContent>
                        {rooms.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} — ${Number(r.price_per_night).toFixed(0)}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Guests</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n} {n===1?"Guest":"Guests"}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" maxLength={100} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" maxLength={255} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 9812345678" maxLength={30} />
                  </div>
                </div>

                {selectedRoom && nights > 0 && (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 p-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{nights} {nights===1?"night":"nights"} · {selectedRoom.name}</div>
                      <div className="text-xs text-muted-foreground">${Number(selectedRoom.price_per_night).toFixed(0)} × {nights}</div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">${total.toFixed(0)}</div>
                  </div>
                )}

                <Button type="submit" disabled={submitting} className="w-full py-6 text-lg group hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <span className="flex items-center justify-center gap-2">
                    {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>) : (<>Submit Booking Request <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" /></>)}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
