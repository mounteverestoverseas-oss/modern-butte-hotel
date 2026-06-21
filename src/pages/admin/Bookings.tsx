import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type BookingRow = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
  room_id: string;
  rooms?: { name: string } | null;
};

const Bookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, rooms(name)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setBookings((data as BookingRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`Marked ${status}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage every reservation.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">All Reservations ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.guest_name}</TableCell>
                      <TableCell className="text-xs">
                        <div>{b.guest_email}</div>
                        <div className="text-muted-foreground">{b.guest_phone}</div>
                      </TableCell>
                      <TableCell>{b.rooms?.name ?? "—"}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        {format(new Date(b.check_in), "MMM d")} →{" "}
                        {format(new Date(b.check_out), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{b.guests}</TableCell>
                      <TableCell>${Number(b.total_price).toFixed(0)}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        {b.status !== "confirmed" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "confirmed")}>
                            Confirm
                          </Button>
                        )}
                        {b.status !== "cancelled" && (
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(b.id, "cancelled")}>
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;
