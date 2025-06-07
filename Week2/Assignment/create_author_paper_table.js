const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('research_db.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS author_paper (
      author_id INTEGER,
      paper_id INTEGER,
      PRIMARY KEY (author_id, paper_id),
      FOREIGN KEY (author_id) REFERENCES authors(author_id),
      FOREIGN KEY (paper_id) REFERENCES research_Papers(paper_id)
    );
  `, (err) => {
    if (err) console.error('Error creating author_paper table:', err.message);
    else console.log('Table "author_paper" created successfully.');
  });
});

db.close();
