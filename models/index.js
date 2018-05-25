import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.load();

const sequelize = new Sequelize(process.env.DATABASE_URL);
const User = sequelize.import('./User.js');
sequelize.sync();

export default { User };
