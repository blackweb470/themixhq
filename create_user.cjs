const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jjoacxcfaxiigdlabxrq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb2FjeGNmYXhpaWdkbGFieHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5Mzg4MDAsImV4cCI6MjA5NzUxNDgwMH0.hwP_wbi5WvJJ07S8H1WP_Gw_aaRYMou9vmvcDVgzQs0');

async function createUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'akhatasebhudojoseph1@gmail.com',
    password: 'Password123!',
  });
  console.log(JSON.stringify({data, error}, null, 2));

  if (!error && data.user) {
     const { error: insertError } = await supabase.from('staff').insert({
         id: data.user.id,
         name: 'Joseph Akhatase',
         email: 'akhatasebhudojoseph1@gmail.com',
         role: 'Admin'
     });
     console.log('Insert staff error:', insertError);
  }
}
createUser();
