import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjoacxcfaxiigdlabxrq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb2FjeGNmYXhpaWdkbGFieHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5Mzg4MDAsImV4cCI6MjA5NzUxNDgwMH0.hwP_wbi5WvJJ07S8H1WP_Gw_aaRYMou9vmvcDVgzQs0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('staff').delete().eq('id', '7bfff2f5-48cb-4321-b307-868ede7e0360');
  console.log("Delete Response:", data, error);
}

main();
