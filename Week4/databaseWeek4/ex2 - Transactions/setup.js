import { connectToDb, closeDbConnection } from "./db.js";

export default async function setupAccounts() {
  try {
    const db = await connectToDb();
    const accounts = db.collection("accounts");

    // Clean the collection
    await accounts.deleteMany({});

    // Insert sample accounts
    await accounts.insertMany([
      {
        account_number: 101,
        balance: 5000,
        account_changes: [
          {
            change_number: 1,
            amount: 5000,
            changed_date: new Date(),
            remark: "Initial deposit",
          },
        ],
      },
      {
        account_number: 102,
        balance: 3000,
        account_changes: [
          {
            change_number: 1,
            amount: 3000,
            changed_date: new Date(),
            remark: "Initial deposit",
          },
        ],
      },
    ]);

    console.log("Sample accounts setup completed.");
  } catch (err) {
    console.error("❌ Error setting up accounts:", err);
  } finally {
    await closeDbConnection();
  }
}
