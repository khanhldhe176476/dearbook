const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'huybq',
  password: '1234',
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL successfully.');

  // Check if book_categories table exists and has data
  let tableExists = false;
  try {
    const res = await client.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_categories')");
    tableExists = res.rows[0].exists;
  } catch (err) {
    console.log('Error checking if table exists:', err.message);
  }

  let hasCategories = false;
  if (tableExists) {
    try {
      const res = await client.query('SELECT count(*) FROM book_categories');
      hasCategories = parseInt(res.rows[0].count, 10) > 0;
      console.log(`Table book_categories exists and has ${res.rows[0].count} rows.`);
    } catch (err) {
      console.log('Error counting book_categories:', err.message);
    }
  }

  if (!hasCategories) {
    console.log('Database appears empty or unseeded. Running init-mvp-schema.sql...');
    const schemaPath = path.join(__dirname, '../backend/init-mvp-schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('Schema and seed data from init-mvp-schema.sql loaded successfully.');
    } else {
      console.error('init-mvp-schema.sql not found at:', schemaPath);
    }

    console.log('Running insert_local_templates.sql...');
    const templatesPath = path.join(__dirname, '../insert_local_templates.sql');
    if (fs.existsSync(templatesPath)) {
      const templatesSql = fs.readFileSync(templatesPath, 'utf8');
      await client.query(templatesSql);
      console.log('Templates from insert_local_templates.sql loaded successfully.');
    } else {
      console.error('insert_local_templates.sql not found at:', templatesPath);
    }
  } else {
    console.log('Database already has data. Skipping schema init and template insert.');
  }

  await client.end();
}

main().catch(err => {
  console.error('Database setup failed:', err);
  process.exit(1);
});
