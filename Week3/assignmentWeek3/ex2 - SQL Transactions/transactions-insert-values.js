import mysql from 'mysql2/promise';

async function insertValues() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'w3_assignment',
  });

  try {
    await connection.beginTransaction();

    await connection.query(`
      INSERT INTO account (account_number, balance) VALUES
      (101, 5000.00),
      (102, 3000.00)
    `);

    await connection.query(`
      INSERT INTO account_changes (account_number, amount, remark) VALUES
      (101, 5000.00, 'Initial deposit'),
      (102, 3000.00, 'Initial deposit')
    `);

    await connection.commit();
    console.log('Values inserted successfully');
  } catch (err) {
    await connection.rollback();
    console.error('Error inserting values:', err);
  } finally {
    await connection.end();
  }
}

insertValues();
