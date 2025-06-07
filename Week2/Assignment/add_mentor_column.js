const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('research_db.db');

db.serialize(() => {
  db.run(`ALTER TABLE authors ADD COLUMN mentor INTEGER;`, (err) => {
    if (err && !err.message.includes("duplicate column")) {
      console.error('Error adding mentor column:', err.message);
    } else {
      console.log('Column "mentor" added.');
    }
  });

  db.run(`
    PRAGMA foreign_keys = OFF;
  `, () => {
    db.run(`
      CREATE TABLE authors_new (
        author_id INTEGER PRIMARY KEY,
        author_name  VARCHAR(50) NOT NULL,
        university TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        h_index INTEGER,
        gender TEXT CHECK(gender IN ('Male', 'Female', 'Prefer not to say')),
        mentor INTEGER,
        FOREIGN KEY (mentor) REFERENCES authors(author_id)
      );
    `, () => {
      db.run(`
        INSERT INTO authors_new (author_id, author_name, university, date_of_birth, h_index, gender, mentor)
        SELECT author_id, author_name, university, date_of_birth, h_index, gender, mentor FROM authors;
      `, () => {
        db.run(`DROP TABLE authors;`);
        db.run(`ALTER TABLE authors_new RENAME TO authors;`);
        db.run(`PRAGMA foreign_keys = ON;`);
        console.log('Foreign key on "mentor" column successfully added.');
      });
    });
  });
});

db.close();
