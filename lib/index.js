import _ from 'lodash';
import encrypt from './encrypt';

export const buildFormObj = (object, error = { errors: [] }) => ({
  name: 'form',
  object,
  errors: _.groupBy(error.errors, 'path'),
});
export const buildFlashMsg = (text, type = 'info') => ({ text, type });

export default { buildFlashMsg, encrypt, buildFormObj };
