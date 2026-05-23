import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Defensive warning to avoid blank page crashes if keys are not yet configured by the user
const isPlaceholder = !supabaseUrl || 
                      supabaseUrl.includes('your-supabase-project-url') ||
                      !supabaseAnonKey || 
                      supabaseAnonKey.includes('your-project-anonymous-public-key');

if (isPlaceholder) {
  console.warn("Supabase connection credentials are placeholder values. Live cloud syncing is inactive. Please update your .env file with active Supabase keys.");
}

export const supabase = createClient(
  isPlaceholder ? 'https://placeholder.supabase.co' : supabaseUrl, 
  isPlaceholder ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder' : supabaseAnonKey
);

export const isSupabaseConfigured = !isPlaceholder;
