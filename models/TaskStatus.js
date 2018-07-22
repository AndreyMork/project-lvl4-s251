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
    scopes: {
      defaultValue: {
        where: {
          id: 1,
        },
      },
      notDefaultStatuses: {
        where: {
          id: { not: 1 },
        },
        order: [['name', 'ASC']],
      },
    },
    underscored: true,
  });

  return TaskStatus;
};
