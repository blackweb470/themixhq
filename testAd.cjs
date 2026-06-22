import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjoacxcfaxiigdlabxrq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb2FjeGNmYXhpaWdkbGFieHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5Mzg4MDAsImV4cCI6MjA5NzUxNDgwMH0.hwP_wbi5WvJJ07S8H1WP_Gw_aaRYMou9vmvcDVgzQs0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetchAd() {
  const zone = 'Header Banner';
  const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('status', 'active')
      .eq('zone', zone);
      
  console.log("data:", data, "error:", error);
}

testFetchAd();
