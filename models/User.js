import uuid from 'uuid-js';
import encrypt from '../lib/encrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuid.create().toString(),
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        len: [1, +Infinity],
      },
    },
  }, {
    getterMethods: {
      fullName() {
        return (this.firstName || this.lastName)
          ? `${this.firstName} ${this.lastName}` : this.uuid;
      },
      // associate(models) {
      //   // associations can be defined here
      // },
    },
  });

  return User;
};
