const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('research_db.db');

db.serialize(() => {
  // Generating 15 authors
  for (let i = 1; i <= 15; i++) {
    db.run(`
      INSERT INTO authors (author_id, author_name, university, date_of_birth, h_index, gender)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      i,
      `Author ${i}`,
      `University ${i % 5 + 1}`,
      `197${i % 10}-01-01`,
      Math.floor(Math.random() * 30) + 10,
      i % 2 === 0 ? 'Male' : 'Female'
    ]);
  }

  // Generating 30 articles
  for (let i = 1; i <= 30; i++) {
    db.run(`
      INSERT INTO research_Papers (paper_id, paper_title, conference, publish_date)
      VALUES (?, ?, ?, ?)
    `, [
      i,
      `Paper Title ${i}`,
      `Conference ${i % 3 + 1}`,
      `202${i % 5}-0${(i % 9) + 1}-15`
    ]);
  }

  // Linking authors to articles
  for (let i = 1; i <= 30; i++) {
    const authorsCount = 2 + (i % 2);
    for (let j = 0; j < authorsCount; j++) {
      const authorId = (i + j) % 15 + 1;
      db.run(`
        INSERT INTO author_paper (author_id, paper_id)
        VALUES (?, ?)
      `, [authorId, i]);
    }
  }

  console.log("Sample data inserted.");
});

db.close();
