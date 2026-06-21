import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";

type Row = { user_id: string; email: string; created_at: string; roles: string[] };

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [me, setMe] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: s } = await supabase.auth.getUser();
    setMe(s.user?.id ?? null);
    const { data, error } = await supabase.rpc("list_users_with_roles");
    if (error) toast.error(error.message);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const grant = async (user_id: string, role: "admin" | "moderator") => {
    const { error } = await supabase.from("user_roles").insert({ user_id, role });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
    load();
  };

  const revoke = async (user_id: string, role: "admin" | "moderator") => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", role);
    if (error) return toast.error(error.message);
    toast.success(`Revoked ${role}`);
    load();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-semibold">Users & Roles</h1>
        <p className="text-sm text-muted-foreground mt-1">Grant or revoke admin and moderator access.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">All Users ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const isMe = r.user_id === me;
                  const isAdmin = r.roles.includes("admin");
                  const isMod = r.roles.includes("moderator");
                  return (
                    <TableRow key={r.user_id}>
                      <TableCell className="font-medium">
                        {r.email} {isMe && <span className="text-xs text-muted-foreground">(you)</span>}
                      </TableCell>
                      <TableCell className="space-x-1">
                        {r.roles.length === 0 ? (
                          <span className="text-xs text-muted-foreground">none</span>
                        ) : (
                          r.roles.map((role) => (
                            <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>
                              {role}
                            </Badge>
                          ))
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {isAdmin ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isMe}
                            onClick={() => revoke(r.user_id, "admin")}
                          >
                            <ShieldOff className="w-3.5 h-3.5 mr-1.5" /> Revoke admin
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => grant(r.user_id, "admin")}>
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Make admin
                          </Button>
                        )}
                        {isMod ? (
                          <Button size="sm" variant="ghost" onClick={() => revoke(r.user_id, "moderator")}>
                            Revoke mod
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => grant(r.user_id, "moderator")}>
                            Make mod
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
