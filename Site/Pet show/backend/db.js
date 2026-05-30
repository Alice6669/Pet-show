import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DB_pet_show',
  connectionLimit: 10,
});

export default pool;