export default (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Task name is required',
        },
      },
    },
    description: DataTypes.TEXT,
  }, {
    underscored: true,
  });

  Task.associate = async ({ User, TaskStatus }) => {
    Task.belongsTo(User, {
      as: 'creator',
      foreignKey: {
        allowNull: false,
      },
    });

    Task.belongsTo(TaskStatus, { as: 'status' });
    // assignTo: {},
    // tags: {},
  };

  return Task;
};
