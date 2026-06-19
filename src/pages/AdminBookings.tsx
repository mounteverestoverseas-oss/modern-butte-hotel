import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
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

const AdminBookings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setEmail(session.user.email ?? null);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);

      if (admin) {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, rooms(name)")
          .order("created_at", { ascending: false });
        if (error) toast.error(error.message);
        else setBookings((data as BookingRow[]) ?? []);
      }
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`Marked ${status}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" /> Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              You're signed in as <span className="font-medium">{email}</span>, but this account does
              not have the <code>admin</code> role. Ask an existing admin to grant you access.
            </p>
            <Button variant="outline" onClick={signOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bookings Dashboard</h1>
            <p className="text-sm text-muted-foreground">Signed in as {email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>All Reservations ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No bookings yet.</p>
            ) : (
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
                      <TableCell className="text-xs">
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
                      <TableCell className="text-right space-x-2">
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
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminBookings;
