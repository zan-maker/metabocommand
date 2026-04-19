import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="p-8 space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Your account details</p>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <Field label="Display name" value={profile?.display_name ?? ""} />
          <Field label="Email" value={profile?.email ?? ""} />
          <Field label="Role" value={profile?.role ?? ""} />
        </CardContent>
      </Card>
      <p className="text-xs text-slate-500">
        Password change + notification preferences coming in the next build phase.
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm text-slate-900 mt-1">{value}</div>
    </div>
  );
}
