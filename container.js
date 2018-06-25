import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import usersTableInterface from './migrations/usersTableInterface';
// import validatejs from 'validate.js';
// import User from './entities/User';
// import db from './db';
//
// const validate = entity => validatejs(entity, entity.constructor.constraints);
// // import logger from './lib/logger';

dotenv.load();
const queryInterface = new Sequelize(process.env.DATABASE_URL).getQueryInterface();
const usersTable = {
  down: () => usersTableInterface.down(queryInterface),
  up: () => usersTableInterface.up(queryInterface, Sequelize),
};

export default { Sequelize, usersTable };
