import { client, connectToDb, closeDbConnection } from "./db.js";

export async function transferMoney(fromAcc, toAcc, amount, remark) {
  try {
    const db = await connectToDb();
    const accounts = db.collection("accounts");
    const session = client.startSession();

    await session.withTransaction(async () => {
      const fromDoc = await accounts.findOne({ account_number: fromAcc }, { session });
      const toDoc = await accounts.findOne({ account_number: toAcc }, { session });

      if (!fromDoc || !toDoc) throw new Error("Account not found.");
      if (fromDoc.balance < amount) throw new Error("Insufficient funds.");

      // Calculating new balances
      const newFromBalance = fromDoc.balance - amount;
      const newToBalance = toDoc.balance + amount;

      // Change numbers
      const lastFromChange = fromDoc.account_changes.at(-1)?.change_number || 0;
      const lastToChange = toDoc.account_changes.at(-1)?.change_number || 0;

      const now = new Date();

      // Sender update
      const fromRecord = {
        change_number: lastFromChange + 1,
        amount: -amount,
        changed_date: now,
        remark: `Transfer to ${toAcc}: ${remark}`,
      };

      await accounts.updateOne(
        { account_number: fromAcc },
        {
          $set: { balance: newFromBalance },
          $push: { account_changes: fromRecord },
        },
        { session }
      );

      // Recipient update
      const toRecord = {
        change_number: lastToChange + 1,
        amount: amount,
        changed_date: now,
        remark: `Transfer from ${fromAcc}: ${remark}`,
      };

      await accounts.updateOne(
        { account_number: toAcc },
        {
          $set: { balance: newToBalance },
          $push: { account_changes: toRecord },
        },
        { session }
      );
    });

    console.log(`Transfer of ${amount} from ${fromAcc} to ${toAcc} complete.`);
  } catch (err) {
    console.error("❌ Transaction error:", err.message);
  } finally {
    await closeDbConnection();
  }
}
