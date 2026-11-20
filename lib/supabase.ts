import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isConfigured = Boolean(url && serviceRole);
export const supabase = isConfigured
  ? createClient(url!, serviceRole!, { auth: { persistSession: false } })
  : null;
