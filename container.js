import dotenv from 'dotenv';
import validatejs from 'validate.js';
import User from './entities/User';
import db from './db';

const validate = entity => validatejs(entity, entity.constructor.constraints);
// import logger from './lib/logger';

dotenv.config();

export default { User, validate, db };
