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
      id: 1,
    },
  });

  TaskStatus.getNotDefault = () => TaskStatus.findAll({
    where: {
      name: {
        id: 1,
      },
    },
    order: [['name', 'ASC']],
  });

  // TaskStatus.associate = () => {};

  return TaskStatus;
};
