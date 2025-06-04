import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "w3_assignment",
});

await connection.beginTransaction();

const fromAccount = 101;
const toAccount = 102;
const amount = 1000;
const date = "2025-06-02";

const transactionFrom = {
  account_number: fromAccount,
  amount: -amount,
  changed_date: date,
  remark: `Transfer to account #${toAccount}`,
};

const transactionTo = {
  account_number: toAccount,
  amount: amount,
  changed_date: date,
  remark: `Transfer from account #${fromAccount}`,
};

try {
  const [availableBalanceResult] = await connection.query(
    "SELECT balance FROM account WHERE account_number = ?",
    [fromAccount]
  );

  const availableBalance = availableBalanceResult[0]?.balance;

  if (availableBalance < amount) {
    throw new Error("Insufficient balance to perform the transfer");
  }

  console.log(`Account #${fromAccount} available balance: ${availableBalance}`);

  // Deduct from sender
  await connection.query("INSERT INTO account_changes SET ?", transactionFrom);
  await connection.query(
    "UPDATE account SET balance = balance + ? WHERE account_number = ?",
    [transactionFrom.amount, fromAccount]
  );
  console.log(`$${amount} deducted from account #${fromAccount}`);

  // Add to receiver
  await connection.query("INSERT INTO account_changes SET ?", transactionTo);
  await connection.query(
    "UPDATE account SET balance = balance + ? WHERE account_number = ?",
    [transactionTo.amount, toAccount]
  );
  console.log(`$${amount} added to account #${toAccount}`);

  await connection.commit();
  console.log("Transaction completed successfully.");
} catch (error) {
  await connection.rollback();
  console.error("Transaction failed:", error.message);
} finally {
  await connection.end();
}
