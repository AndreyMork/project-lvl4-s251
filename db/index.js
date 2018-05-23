import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.load();

// const client = new Pool();
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: true });
client.connect();

const isEmailInTable = async (email) => {
  const query = {
    text: 'SELECT 1 FROM users WHERE email=$1',
    values: [email],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (err) {
    console.error(err.stack);
  }

  return res.rowCount !== 0;
};

const insertUser = async (user) => {
  const query = {
    text: 'INSERT INTO users (id, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5)',
    values: [user.id, user.email, user.password, user.firstName || null, user.lastName || null],
  };

  try {
    await client.query(query);
  } catch (err) {
    console.error(err.stack);
  }
};

const getUsers = async () => {
  const query = {
    text: 'SELECT email, first_name, last_name, id FROM users',
  };
  const res = await client.query(query);

  return res.rows;
};

export default { isEmailInTable, insertUser, getUsers };
