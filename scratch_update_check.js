import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: promos } = await supabase.from('promotions').select('id').limit(1);
  if (promos && promos.length > 0) {
    const id = promos[0].id;
    console.log("Found promo:", id);
    const { data, error, count } = await supabase.from('promotions').update({ status: 'inactive' }).eq('id', id).select();
    console.log("Update test:", { data, error, count });
  } else {
    console.log("No promotions found");
  }
}

check();
