const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URL);

async function transferMoney(fromAcc, toAcc, amount, remark) {
  const client = new MongoClient(process.env.MONGODB_URL);
  try {
    await client.connect();
    const session = client.startSession();
    const db = client.db("bankDB");
    const accounts = db.collection("accounts");

    await session.withTransaction(async () => {
      const fromDoc = await accounts.findOne({ account_number: fromAcc }, { session });
      const toDoc = await accounts.findOne({ account_number: toAcc }, { session });

      if (!fromDoc || !toDoc) throw new Error("Account not found.");
      if (fromDoc.balance < amount) throw new Error("Insufficient funds.");

      // Calculate new balances
      const newFromBalance = fromDoc.balance - amount;
      const newToBalance = toDoc.balance + amount;

      // Get latest change_number
      const lastFromChange = fromDoc.account_changes.at(-1)?.change_number || 0;
      const lastToChange = toDoc.account_changes.at(-1)?.change_number || 0;

      // Update sender
      await accounts.updateOne(
        { account_number: fromAcc },
        {
          $set: { balance: newFromBalance },
          $push: {
            account_changes: {
              change_number: lastFromChange + 1,
              amount: -amount,
              changed_date: new Date(),
              remark: `Transfer to ${toAcc}: ${remark}`,
            },
          },
        },
        { session }
      );

      // Update receiver
      await accounts.updateOne(
        { account_number: toAcc },
        {
          $set: { balance: newToBalance },
          $push: {
            account_changes: {
              change_number: lastToChange + 1,
              amount: amount,
              changed_date: new Date(),
              remark: `Transfer from ${fromAcc}: ${remark}`,
            },
          },
        },
        { session }
      );
    });

    console.log(` Transfer of ${amount} from ${fromAcc} to ${toAcc} complete.`);
  } catch (err) {
    console.error(" Transaction error:", err.message);
  } finally {
    await client.close();
  }
}

module.exports = transferMoney;
