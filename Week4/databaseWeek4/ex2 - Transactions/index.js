const setupAccounts = require("./setup");
const transferMoney = require("./transfer");

async function main() {
  await setupAccounts(); 
  await transferMoney(101, 102, 1000, "Rent payment"); 
}

main();
