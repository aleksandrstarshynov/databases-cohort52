const { MongoClient } = require("mongodb");
const csvtojson = require("csvtojson");
require("dotenv").config();

async function main() {
  const client = new MongoClient(process.env.MONGODB_URL);

  try {
    await client.connect();
    const db = client.db("databaseWeek4");
    const collection = db.collection("aggregation");
    // taks 1. I have uploaded data via Atlas

    // Task 2. Aggregation
const findPopulation = collection.aggregate([
      {
        $match: {
          Country: "Netherlands",
        },
      },
      {
        $group: {
          _id: "$Year",
          countPopulation: {
            $sum: { $add: ["$M", "$F"] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("\n📊 Task 2 Result:\n", await findPopulation.toArray());

    // Task 3. 
    async function getContinentDataForYearAndAge(db, year, ageGroup) {
      const collection = db.collection("aggregation");

      const result = await collection.aggregate([
        {
          $match: {
            Country: { $regex: /^[A-Z ]+$/ }, 
            Year: year,
            Age: ageGroup,
          },
        },
        {
          $addFields: {
            TotalPopulation: { $add: ["$M", "$F"] },
          },
        },
      ]).toArray();

      return result;
    }

    const year = 2020;
    const age = "100+";
    const continentData = await getContinentDataForYearAndAge(db, year, age);
    console.log(`\n🌍 Task 3 Result for Year: ${year}, Age: ${age}:\n`, continentData);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();