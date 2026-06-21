import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  image_url: string | null;
  amenities: string[];
};

const empty = {
  slug: "",
  name: "",
  description: "",
  price_per_night: 0,
  max_guests: 2,
  image_url: "",
  amenities: "",
};

const Rooms = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rooms").select("*").order("name");
    if (error) toast.error(error.message);
    setRooms((data as Room[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...empty });
    setOpen(true);
  };

  const openEdit = (r: Room) => {
    setEditingId(r.id);
    setForm({
      slug: r.slug,
      name: r.name,
      description: r.description,
      price_per_night: Number(r.price_per_night),
      max_guests: r.max_guests,
      image_url: r.image_url ?? "",
      amenities: (r.amenities ?? []).join(", "),
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      price_per_night: Number(form.price_per_night),
      max_guests: Number(form.max_guests),
      image_url: form.image_url.trim() || null,
      amenities: form.amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const { error } = editingId
      ? await supabase.from("rooms").update(payload).eq("id", editingId)
      : await supabase.from("rooms").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Room updated" : "Room created");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Room deleted");
    load();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold">Rooms</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your property's room types.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Room
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              {r.image_url && (
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center justify-between gap-2">
                  <span className="truncate">{r.name}</span>
                  <span className="text-sm font-sans font-normal text-primary">
                    ${Number(r.price_per_night).toFixed(0)}/nt
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                <div className="text-xs text-muted-foreground">
                  Up to {r.max_guests} guests · {(r.amenities ?? []).length} amenities
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(r)}>
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-12">
              No rooms yet — add your first room.
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? "Edit Room" : "New Room"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price / night ($)</Label>
                <Input
                  type="number"
                  value={form.price_per_night}
                  onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Max guests</Label>
                <Input
                  type="number"
                  value={form.max_guests}
                  onChange={(e) => setForm({ ...form, max_guests: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div>
              <Label>Amenities (comma separated)</Label>
              <Input
                value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                placeholder="Wi-Fi, Breakfast, View"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
