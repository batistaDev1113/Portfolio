import { createClient } from "@supabase/supabase-js";

// Throw error if SUPABASE_URL or SUPABASE_KEY is missing
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY");
}

// Initialize supabase
const supabaseUrl: string = process.env.SUPABASE_URL;
const supabaseKey: string = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 1;

export async function fetchData() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.log(error);
  }
}
