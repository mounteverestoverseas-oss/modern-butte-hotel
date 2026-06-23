import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, DollarSign, Receipt, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type MenuItem = { id: string; name: string; price: number; is_available: boolean };
type LineItem = { menu_item_id: string; name: string; price: number; qty: number };
type Order = {
  id: string;
  customer_name: string;
  table_number: string | null;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
};

const TAX_RATE = 0.13;
const STATUSES = ["pending", "preparing", "served", "paid", "cancelled"];

const RestaurantOrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("Walk-in");
  const [table, setTable] = useState("");
  const [lines, setLines] = useState<LineItem[]>([]);
  const [pick, setPick] = useState<string>("");

  const load = async () => {
    const [{ data: o }, { data: m }] = await Promise.all([
      supabase.from("restaurant_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("menu_items").select("id,name,price,is_available").eq("is_available", true).order("name"),
    ]);
    setOrders((o as any) ?? []);
    setMenu((m as MenuItem[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const tax = subtotal * TAX_RATE;
    return { subtotal, tax, total: subtotal + tax };
  }, [lines]);

  const stats = useMemo(() => {
    const paid = orders.filter(o => o.status === "paid");
    const revenue = paid.reduce((s, o) => s + Number(o.total), 0);
    const today = new Date(); today.setHours(0,0,0,0);
    const todays = paid.filter(o => new Date(o.created_at) >= today);
    const todayRev = todays.reduce((s, o) => s + Number(o.total), 0);
    const open = orders.filter(o => !["paid","cancelled"].includes(o.status)).length;
    return { revenue, todayRev, open, count: orders.length };
  }, [orders]);

  const addLine = () => {
    const item = menu.find(m => m.id === pick);
    if (!item) return;
    setLines(prev => {
      const found = prev.find(l => l.menu_item_id === item.id);
      if (found) return prev.map(l => l.menu_item_id === item.id ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { menu_item_id: item.id, name: item.name, price: Number(item.price), qty: 1 }];
    });
    setPick("");
  };

  const reset = () => { setCustomer("Walk-in"); setTable(""); setLines([]); setPick(""); };

  const create = async () => {
    if (lines.length === 0) return toast.error("Add at least one item");
    const { error } = await supabase.from("restaurant_orders").insert({
      customer_name: customer || "Walk-in",
      table_number: table || null,
      items: lines as any,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      status: "pending",
    });
    if (error) return toast.error(error.message);
    toast.success("Order created");
    setOpen(false); reset(); load();
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("restaurant_orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete order?")) return;
    await supabase.from("restaurant_orders").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Restaurant Orders</h1>
          <p className="text-sm text-muted-foreground">Take orders & track sales for the rooftop restaurant.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />New order</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>New restaurant order</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Customer</Label><Input value={customer} onChange={e => setCustomer(e.target.value)} /></div>
                <div><Label>Table #</Label><Input value={table} onChange={e => setTable(e.target.value)} placeholder="e.g. 7" /></div>
              </div>
              <div className="flex gap-2">
                <Select value={pick} onValueChange={setPick}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Choose menu item" /></SelectTrigger>
                  <SelectContent>{menu.map(m => <SelectItem key={m.id} value={m.id}>{m.name} — ${Number(m.price).toFixed(2)}</SelectItem>)}</SelectContent>
                </Select>
                <Button type="button" onClick={addLine} disabled={!pick}>Add</Button>
              </div>
              {lines.length > 0 && (
                <div className="border rounded-md divide-y">
                  {lines.map((l, idx) => (
                    <div key={l.menu_item_id} className="flex items-center gap-3 p-3">
                      <div className="flex-1"><div className="font-medium text-sm">{l.name}</div><div className="text-xs text-muted-foreground">${l.price.toFixed(2)} each</div></div>
                      <Input type="number" min={1} value={l.qty} onChange={e => setLines(ls => ls.map((x,i) => i===idx ? {...x, qty: Math.max(1, Number(e.target.value))} : x))} className="w-20" />
                      <div className="w-20 text-right font-medium">${(l.price * l.qty).toFixed(2)}</div>
                      <Button size="icon" variant="ghost" onClick={() => setLines(ls => ls.filter((_,i) => i!==idx))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <div className="p-3 space-y-1 text-sm bg-muted/30">
                    <div className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Tax ({(TAX_RATE*100).toFixed(0)}%)</span><span>${totals.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-semibold text-base pt-1 border-t"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter><Button onClick={create}>Create order</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign className="w-4 h-4" />} label="Total revenue" value={`$${stats.revenue.toFixed(2)}`} />
        <StatCard icon={<DollarSign className="w-4 h-4" />} label="Today" value={`$${stats.todayRev.toFixed(2)}`} />
        <StatCard icon={<Clock className="w-4 h-4" />} label="Open orders" value={String(stats.open)} />
        <StatCard icon={<Receipt className="w-4 h-4" />} label="All orders" value={String(stats.count)} />
      </div>

      <Card>
        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Table</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</TableCell>
                  <TableCell>{o.customer_name}</TableCell>
                  <TableCell>{o.table_number ?? "—"}</TableCell>
                  <TableCell className="text-xs">{(o.items ?? []).map(i => `${i.qty}× ${i.name}`).join(", ")}</TableCell>
                  <TableCell className="font-medium">${Number(o.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
                      <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => remove(o.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No orders yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">{icon}{label}</div>
        <div className="font-serif text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}

export default RestaurantOrdersAdmin;
