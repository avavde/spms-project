const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL, // замените на вашу строку подключения
});

const updateSchema = async () => {
  try {
    await client.connect();

    // Удаляем существующий внешний ключ
    await client.query('ALTER TABLE beacons DROP CONSTRAINT IF EXISTS beacons_zone_id_fkey');

    // Добавляем новый внешний ключ с каскадным удалением
    await client.query(`ALTER TABLE beacons ADD CONSTRAINT beacons_zone_id_fkey
      FOREIGN KEY (zone_id)
      REFERENCES zones (id)
      ON DELETE CASCADE`);

    console.log('Schema updated successfully');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await client.end();
  }
};

updateSchema();
