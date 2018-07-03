import Sequelize from 'sequelize';

const db = {};
const sequelize = new Sequelize(process.env.DATABASE_URL);

export const User = sequelize.import('./User.js');
db[User.name] = User;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
