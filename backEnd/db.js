const postgres = require("postgres");

let sql;

if (!global._sql) {
  const connectionString = process.env.SUPABASE_DB_URL;

  global._sql = postgres(connectionString, {
    max: 10, // Maximum connections in pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    max_lifetime: 60 * 30, // Close connections after 30 minutes
  });

  console.log("Database connection pool created");
}

sql = global._sql;



module.exports = sql;
