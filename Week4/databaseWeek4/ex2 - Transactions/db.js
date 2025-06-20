import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("❌ No MONGODB_URI in .env");

const client = new MongoClient(uri);

export async function connectToDb() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db("bankDB");
}

export async function closeDbConnection() {
  await client.close();
}

export { client };
