const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jjoacxcfaxiigdlabxrq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb2FjeGNmYXhpaWdkbGFieHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5Mzg4MDAsImV4cCI6MjA5NzUxNDgwMH0.hwP_wbi5WvJJ07S8H1WP_Gw_aaRYMou9vmvcDVgzQs0');

async function test() {
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets, bErr);
  
  if (buckets && buckets.some(b => b.name === 'media')) {
    const { data: files, error } = await supabase.storage.from('media').list();
    console.log('Files in media:', files?.length, error);
    
    if (files && files.length > 0) {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(files[0].name);
      console.log('Public URL:', publicUrl);
      const res = await fetch(publicUrl);
      console.log('Fetch status:', res.status, res.statusText);
    }
  }
}
test();
