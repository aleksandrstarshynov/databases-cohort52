import dotenv from "dotenv";
dotenv.config();

function getEnvVar(key, defaultValue) {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`❌ Переменная окружения ${key} не задана и не имеет значения по умолчанию`);
  }
  return value;
}

const config = {
  dbConnectionString: getEnvVar("MONGODB_URL", "mongodb://localhost:27017"),
  dbName: getEnvVar("DB_NAME", "databaseWeek4"),
};

module.exports = config;
