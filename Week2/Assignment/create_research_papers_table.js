const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('research_db.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS authors (
      author_id INTEGER PRIMARY KEY,
      author_name VARCHAR(50) NOT NULL,
      university TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      h_index INTEGER,
      gender TEXT CHECK(gender IN ('Male', 'Female', 'Prefer not to say'))
    );
  `, (err) => {
    if (err) console.error('Error creating table:', err.message);
    else console.log('Table "authors" created successfully.');
  });
});

db.close();
