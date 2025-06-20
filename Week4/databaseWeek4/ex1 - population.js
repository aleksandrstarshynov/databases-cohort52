import { MongoClient } from "mongodb";
import csvtojson from "csvtojson";
import config from "./config.js";

async function main() {
  const client = new MongoClient(config.dbConnectionString);

  try {
    await client.connect();
    const db = client.db(config.dbName);
    const collection = db.collection("aggregation");

    // Task 1. I have uploaded data via Atlas

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

    const populationResult = await findPopulation.toArray();
    console.log("\n Task 2 Result:\n");
    console.log(populationResult);

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

    console.log(`\n Task 3 Result for Year: ${year}, Age: ${age}:\n`);
    console.log(continentData);

  } catch (err) {
    console.error("❌ Ошибка при выполнении:", err);
  } finally {
    await client.close();
  }
}

main();
