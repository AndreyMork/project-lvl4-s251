import db from './models';
import usersTableInterface from './migrations/usersTableInterface';


const queryInterface = db.sequelize.getQueryInterface();
const usersTable = {
  down: () => usersTableInterface.down(queryInterface),
  up: () => usersTableInterface.up(queryInterface, db.Sequelize),
};

export default { db, usersTable };
