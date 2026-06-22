import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_policies') || await supabase.from('promotions').select('*');
  console.log("Promotions:", data?.length);
  
  // let's try to delete a non-existent one to see if it throws an error
  const res = await supabase.from('promotions').delete().eq('id', '00000000-0000-0000-0000-000000000000');
  console.log("Delete test:", res);
}

check();
