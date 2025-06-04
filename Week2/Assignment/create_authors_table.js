const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('example.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS authors (
      author_id INTEGER PRIMARY KEY,
      author_name TEXT,
      university TEXT,
      date_of_birth TEXT,
      h_index INTEGER,
      gender TEXT
    );
  `, (err) => {
    if (err) console.error('Error creating table:', err.message);
    else console.log('Table "authors" created successfully.');
  });
});

db.close();
