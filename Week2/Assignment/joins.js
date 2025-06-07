import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
});

try {
  await connection.query("research_db.db");

  // Request 1: Authors and their mentors
  const [authors_mentors] = await connection.query(`
    SELECT a.author_name AS Author, m.author_name AS Mentor, a.mentor AS "Mentor ID"
    FROM authors AS a
    LEFT JOIN authors AS m ON a.mentor = m.author_id
  `);

  console.log("\n Authors and their mentors:");
  console.table(authors_mentors);

  // Query 2: Authors and articles
  const [authors_papers] = await connection.query(`
    SELECT a.*, rp.paper_title
    FROM authors AS a
    LEFT JOIN authorPapers AS ap ON a.author_id = ap.author_id
    LEFT JOIN research_Papers AS rp ON rp.paper_id = ap.paper_id
  `);

  console.log("\n Authors and research papers:");
  console.table(authors_papers);

} catch (error) {
  console.error("Error:", error.message);
} finally {
  await connection.end();
}
