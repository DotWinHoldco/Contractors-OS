// TODO: Generate from Supabase after database connection is established
// Run: npx supabase gen types typescript --project-id [id] > lib/supabase/types.ts
export type Database = Record<string, any>;

// Placeholder types for development - these will be replaced by generated types
export type Tables<T extends string> = Record<string, any> & { id: string };
export type Enums<T extends string> = string;
