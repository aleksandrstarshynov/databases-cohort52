import mysql from 'mysql2/promise';

async function createTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'w3_assignment',
  });

  try {
    await connection.beginTransaction();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS account (
        account_number INT PRIMARY KEY,
        balance DECIMAL(12, 2) NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS account_changes (
        change_number INT AUTO_INCREMENT PRIMARY KEY,
        account_number INT,
        amount DECIMAL(12, 2) NOT NULL,
        changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        remark TEXT,
        FOREIGN KEY (account_number) REFERENCES account(account_number)
      )
    `);

    await connection.commit();
    console.log('Tables created successfully');
  } catch (err) {
    await connection.rollback();
    console.error('Error creating tables:', err);
  } finally {
    await connection.end();
  }
}

createTables();
