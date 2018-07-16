import db from './models';
import usersTableInterface from './migrations/usersTableInterface';
import tasksTableInterface from './migrations/tasksTableInterface';


const queryInterface = db.sequelize.getQueryInterface();
const usersTable = {
  down: () => usersTableInterface.down(queryInterface),
  up: () => usersTableInterface.up(queryInterface, db.Sequelize),
};
const tasksTable = {
  down: () => tasksTableInterface.down(queryInterface),
  up: () => tasksTableInterface.up(queryInterface, db.Sequelize),
};

export default { db, usersTable, tasksTable };
