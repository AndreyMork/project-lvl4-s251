import _ from 'lodash';
import encrypt from './encrypt';

export encrypt from './encrypt';

export const buildFormObj = (object, error = { errors: [] }) => ({
  name: 'form',
  object,
  errors: _.groupBy(error.errors, 'path'),
});

export const buildFlashMsg = (text, type = 'info') => ({ text, type });

export const capitalize = (value) => {
  if (!(value.trim())) {
    return '';
  }
  const [first, ...rest] = value.toLowerCase().trim();
  return `${first.toUpperCase()}${rest.join('')}`;
};

export default {
  buildFlashMsg,
  encrypt,
  buildFormObj,
  capitalize,
};
