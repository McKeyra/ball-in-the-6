// App parameters — Supabase config is handled via environment variables
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env

export const appParams = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};
