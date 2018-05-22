import { Pool } from 'pg';


const pool = process.env.NODE_ENV === 'development' ?
  new Pool() : new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });

const insertUser = async (user) => {
  const query = {
    text: 'INSERT INTO users (id, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5)',
    values: [user.id, user.email, user.password, user.firstName, user.lastName],
  };

  try {
    await pool.query(query);
  } catch (err) {
    console.error(err.stack);
  }
};

const getUsers = async () => {
  const query = {
    text: 'SELECT email, first_name, last_name, id FROM users',
  };
  const res = await pool.query(query);
  return res.rows;
};

export default { insertUser, getUsers };
