import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStaff() {
  const { data, error } = await supabase.from('staff').select('*');
  console.log("Staff table:", data);
  console.log("Error:", error);
}

checkStaff();
