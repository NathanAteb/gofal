import { createClient } from "@supabase/supabase-js";

let readonlyClient: ReturnType<typeof createClient> | null = null;

export function getReadonlyClient() {
  if (!readonlyClient) {
    const key = process.env.SUPABASE_READONLY_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
      throw new Error("No Supabase key available for readonly client");
    }
    if (!process.env.SUPABASE_READONLY_KEY) {
      console.warn("SUPABASE_READONLY_KEY not set — falling back to service role key. Set a readonly key for production.");
    }
    readonlyClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key
    );
  }
  return readonlyClient;
}
