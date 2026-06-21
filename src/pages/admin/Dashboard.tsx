import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, DollarSign, Clock, BedDouble, Loader2 } from "lucide-react";
import { format } from "date-fns";

type Booking = {
  id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  created_at: string;
  rooms?: { name: string } | null;
};

const Stat = ({ icon: Icon, label, value, hint }: any) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="text-3xl font-serif font-semibold mt-2">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomCount, setRoomCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [{ data: b }, { count }] = await Promise.all([
        supabase.from("bookings").select("*, rooms(name)").order("created_at", { ascending: false }),
        supabase.from("rooms").select("*", { count: "exact", head: true }),
      ]);
      setBookings((b as Booking[]) ?? []);
      setRoomCount(count ?? 0);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const revenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + Number(b.total_price), 0);
  const pending = bookings.filter((b) => b.status === "pending").length;
  const recent = bookings.slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">A glance at your property today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={CalendarCheck} label="Total Bookings" value={bookings.length} />
        <Stat icon={DollarSign} label="Confirmed Revenue" value={`$${revenue.toFixed(0)}`} />
        <Stat icon={Clock} label="Pending Review" value={pending} />
        <Stat icon={BedDouble} label="Rooms" value={roomCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Recent Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recent.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{b.guest_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {b.rooms?.name ?? "—"} · {format(new Date(b.check_in), "MMM d")} →{" "}
                      {format(new Date(b.check_out), "MMM d")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium">${Number(b.total_price).toFixed(0)}</span>
                    <Badge
                      variant={
                        b.status === "confirmed"
                          ? "default"
                          : b.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
