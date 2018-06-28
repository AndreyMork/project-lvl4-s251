import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.load();

const sequelize = new Sequelize(process.env.DATABASE_URL);
export const User = sequelize.import('./User.js');

export default { User };
