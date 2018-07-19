export default (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('task_status', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Status name is required',
        },
      },
    },
  }, {
    underscored: true,
  });

  TaskStatus.getDefault = () => TaskStatus.findOne({
    where: {
      name: 'new',
    },
  });

  TaskStatus.getNotDefault = () => TaskStatus.findAll({
    where: {
      name: {
        not: 'new',
      },
    },
    order: [['name', 'ASC']],
  });

  // TaskStatus.associate = () => {};

  return TaskStatus;
};
