import { createClient } from '@supabase/supabase-js'

// for local development, ensure you have a .env file with the following variables set
// ask the team for the values if you don't have them
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)