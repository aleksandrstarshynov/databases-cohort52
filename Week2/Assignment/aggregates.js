import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
});

try {
  await connection.query("USE w2_assignment");

  // All articles and number of authors
  const [papersWithAuthorCount] = await connection.query(`
    SELECT 
      rp.paper_title,
      COUNT(ap.author_id) AS author_count
    FROM 
      research_Papers rp
    LEFT JOIN 
      authorPapers ap ON rp.paper_id = ap.paper_id
    GROUP BY 
      rp.paper_id;
  `);
  console.log("\n Papers and number of authors:");
  console.table(papersWithAuthorCount);

  // Number of articles published by women
  const [femalePaperCount] = await connection.query(`
    SELECT 
      COUNT(ap.paper_id) AS total_papers_by_female_authors
    FROM 
      authors a
    JOIN 
      authorPapers ap ON a.author_id = ap.author_id
    WHERE 
      LOWER(TRIM(a.gender)) LIKE '%female%';
  `);
  console.log("\n Total papers by female authors:");
  console.table(femalePaperCount);

  // Average h-index by universities
  const [avgHIndexPerUni] = await connection.query(`
    SELECT 
      university,
      AVG(h_index) AS average_h_index
    FROM 
      authors
    GROUP BY 
      university;
  `);
  console.log("\n Average h-index per university:");
  console.table(avgHIndexPerUni);

  // Total number of articles by authors by university
  const [paperSumPerUni] = await connection.query(`
    SELECT 
      a.university,
      COUNT(ap.paper_id) AS total_papers
    FROM 
      authors a
    LEFT JOIN 
      authorPapers ap ON a.author_id = ap.author_id
    GROUP BY 
      a.university;
  `);
  console.log("\n Total papers per university:");
  console.table(paperSumPerUni);

  // Min and Max h-index by universities
  const [minMaxHIndexPerUni] = await connection.query(`
    SELECT 
      university,
      MIN(h_index) AS min_h_index,
      MAX(h_index) AS max_h_index
    FROM 
      authors
    GROUP BY 
      university;
  `);
  console.log("\n5️⃣ Min and Max h-index per university:");
  console.table(minMaxHIndexPerUni);

} catch (error) {
  console.error(" Error:", error.message);
} finally {
  await connection.end();
}
