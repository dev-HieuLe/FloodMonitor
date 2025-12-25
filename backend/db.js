import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "!mao1501",
  database: "humanitarian_logistics",
  waitForConnections: true,
  connectionLimit: 10,
});

export default db;
