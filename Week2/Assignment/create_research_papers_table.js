const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('example.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS research_Papers (
      paper_id INTEGER PRIMARY KEY,
      paper_title TEXT,
      conference TEXT,
      publish_date TEXT
    );
  `, (err) => {
    if (err) console.error('Error creating research_Papers:', err.message);
    else console.log('Table "research_Papers" created successfully.');
  });
});

db.close();
