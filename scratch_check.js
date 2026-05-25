const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zncvhhibbnpcihsualen.supabase.co';
const supabaseKey = 'sb_publishable_bIGjVwDVbjCgSbSqz92CQw_3SqS12_A';
const supabase = createClient(supabaseUrl, supabaseKey);
async function checkTemplates() {
  const { data, error } = await supabase.from('book_categories').select('id, name');
  if (error) {
    console.error('Error fetching categories:', error.message);
  } else {
    console.log('Categories in DB:');
    data.forEach(c => console.log(`- ${c.name} (${c.id})`));
  }
}
checkTemplates();
