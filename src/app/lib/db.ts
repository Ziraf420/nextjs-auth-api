import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'myapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
