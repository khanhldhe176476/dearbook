const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'huybq',
  password: '1234',
});

async function main() {
  await client.connect();
  console.log('Connected.');

  const tables = ['book_categories', 'book_templates', 'template_pages'];
  for (const table of tables) {
    const res = await client.query(`SELECT count(*) FROM ${table}`);
    console.log(`Table ${table} has ${res.rows[0].count} rows.`);
  }

  const templates = await client.query('SELECT id, name, is_active FROM book_templates LIMIT 5');
  console.log('Sample templates:', templates.rows);

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
