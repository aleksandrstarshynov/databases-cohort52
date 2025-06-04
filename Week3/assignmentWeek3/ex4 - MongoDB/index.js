require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { seedDatabase } = require("./seedDatabase.js");

async function createEpisodeExercise(client) {
  const db = client.db("databaseWeek3");
  const episode = {
    episode: "S09E13",
    title: "MOUNTAIN HIDE-AWAY",
    elements: [
      "CIRRUS", "CLOUDS", "CONIFER", "DECIDIOUS", "GRASS",
      "MOUNTAIN", "MOUNTAINS", "RIVER", "SNOWY_MOUNTAIN",
      "TREE", "TREES"
    ]
  };

  const result = await db.collection("bob_ross_episodes").insertOne(episode);
  console.log(
    `Created season 9 episode 13 and the document got the id ${result.insertedId}`
  );
}

async function findEpisodesExercises(client) {
  const db = client.db("databaseWeek3");

  // 1. Title of episode 2 in season 2
  const ep1 = await db.collection("bob_ross_episodes").findOne({ episode: "S02E02" });
  console.log(`The title of episode 2 in season 2 is ${ep1.title}`);

  // 2. Find by title
  const ep2 = await db.collection("bob_ross_episodes").findOne({ title: "BLACK RIVER" });
  console.log(`The season and episode number of the "BLACK RIVER" episode is ${ep2.episode}`);

  // 3. All episodes with CLIFF
  const cliffEpisodes = await db.collection("bob_ross_episodes")
    .find({ elements: "CLIFF" })
    .project({ title: 1, _id: 0 })
    .toArray();
  const cliffTitles = cliffEpisodes.map(e => e.title).join(", ");
  console.log(`The episodes that Bob Ross painted a CLIFF are ${cliffTitles}`);

  // 4. CLIFF and LIGHTHOUSE
  const cliffLighthouseEpisodes = await db.collection("bob_ross_episodes")
    .find({ elements: { $all: ["CLIFF", "LIGHTHOUSE"] } })
    .project({ title: 1, _id: 0 })
    .toArray();
  const cliffLighthouseTitles = cliffLighthouseEpisodes.map(e => e.title).join(", ");
  console.log(`The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${cliffLighthouseTitles}`);
}

async function updateEpisodeExercises(client) {
  const db = client.db("databaseWeek3");

  // 1. Rename title of S30E13
  const updateResult1 = await db.collection("bob_ross_episodes").updateOne(
    { episode: "S30E13", title: "BLUE RIDGE FALLERS" },
    { $set: { title: "BLUE RIDGE FALLS" } }
  );
  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${updateResult1.modifiedCount} episodes`
  );

  // 2. Replace 'BUSHES' with 'BUSH'
  const updateResult2 = await db.collection("bob_ross_episodes").updateMany(
    { elements: "BUSHES" },
    {
      $addToSet: { elements: "BUSH" },
      $pull: { elements: "BUSHES" }
    }
  );
  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${updateResult2.modifiedCount} episodes`
  );
}

async function deleteEpisodeExercise(client) {
  const db = client.db("databaseWeek3");

  const deleteResult = await db.collection("bob_ross_episodes").deleteOne({
    episode: "S31E14"
  });
  console.log(
    `Ran a command to delete episode and it deleted ${deleteResult.deletedCount} episodes`
  );
}

async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }

  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed 
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();