export default (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('task_status', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      // unique: true,
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

  // TaskStatus.associate = () => {};

  return TaskStatus;
};
