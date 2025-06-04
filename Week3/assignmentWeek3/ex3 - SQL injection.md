1. - Give an example of a value that can be passed as name and code that would take advantage of SQL-injection and ( fetch all the records in the database)
- answer:
- SELECT Population FROM Countries WHERE Name = '' OR '1'='1' and code = '' OR '1'='1'
- I think it would work sinse '1'='1' is always true the query will return all rows in the table, ignoring filtering by name and code.

2. 
```
function getPopulation(Country, name, code, cb) {
  const allowedTables = ['Countries', 'OtherValidTable']; 
  if (!allowedTables.includes(Country)) {
    return cb(new Error("Invalid table name"));
  }

  const sql = `SELECT Population FROM ${Country} WHERE Name = ? AND code = ?`;

  conn.query(sql, [name, code], function (err, result) {
    if (err) return cb(err);
    if (result.length === 0) return cb(new Error("Not found"));
    cb(null, result[0].Population);
  });
}
```