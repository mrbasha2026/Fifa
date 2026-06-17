// ============================================================
// Supabase Client (REAL implementation)
// ============================================================
// This module creates a singleton Supabase client using the
// anon/publishable key (safe for client-side use).
//
// If env vars are missing (e.g., dev without Supabase), the
// app gracefully falls back to the mock layer in
// `supabase-client-mock.ts`.
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer publishable key, fall back to anon
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    console.warn('[Supabase] Not configured — URL:', supabaseUrl, 'Key:', supabaseKey ? 'present' : 'missing');
    return null;
  }
  if (_client) return _client;
  try {
    _client = createClient(supabaseUrl!, supabaseKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 2 } },
    });
    console.log('[Supabase] Client created successfully');
    return _client;
  } catch (e) {
    console.error('[Supabase] Failed to create client:', e);
    return null;
  }
}

// Server-side admin client (service_role key — NEVER expose to browser)
// Only call this from server components / route handlers / sync scripts.
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
