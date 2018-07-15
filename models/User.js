import uuid from 'uuid-js';
import { capitalize, encrypt } from '../lib';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      set(value) {
        this.setDataValue('firstName', capitalize(value));
      },
      validate: {
        isOneWord(value) {
          if (value.split(' ').length > 1) {
            throw new Error('First name must be one word');
          }
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      set(value) {
        this.setDataValue('lastName', capitalize(value));
      },
      validate: {
        isOneWord(value) {
          if (value.split(' ').length > 1) {
            throw new Error('Last name must be one word');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'User with this email is already exist',
      },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Your email isn't valid",
        },
      },
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuid.create().toString(),
    },
    passwordDigest: {
      type: DataTypes.STRING,
      field: 'password_digest',
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
      },
      validate: {
        len: {
          args: [4, +Infinity],
          msg: 'Minimum password length is 4',
        },
      },
    },
  }, {
    getterMethods: {
      fullName() {
        return (this.firstName || this.lastName)
          ? `${this.firstName} ${this.lastName}` : this.uuid;
      },
    },
    underscored: true,
  });

  User.associate = ({ Task }) => {
    User.hasMany(Task, {
      as: 'createdProjects',
      foreignKey: {
        name: 'creator_id',
        allowNull: false,
      },
    });
  };

  return User;
};
