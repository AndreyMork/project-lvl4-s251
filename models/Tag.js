import { capitalize } from '../lib';

export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('tag', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      set(value) {
        this.setDataValue('name', capitalize(value));
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Tag name is required',
        },
      },
    },
  }, {
    scopes: {
      sorted: {
        order: [['name', 'ASC']],
      },
    },
    underscored: true,
  });

  Tag.associate = async ({ Task }) => {
    Tag.belongsToMany(Task, {
      through: 'task_tag',
    });
    Tag.addScope('active', {
      include: {
        model: Task,
        as: 'tasks',
        required: true,
      },
    });
  };

  return Tag;
};
