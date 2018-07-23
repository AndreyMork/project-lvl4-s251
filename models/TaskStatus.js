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
        where: { id: 1 },
      },
      notDefaultStatuses: {
        where: { id: { not: 1 } },
      },
      sorted: {
        order: [['name', 'ASC']],
      },
      withoutCertainIds: ids => ({
        where: { id: { not: ids } },
      }),
    },
    underscored: true,
  });

  TaskStatus.associate = ({ Task }) => {
    TaskStatus.hasMany(Task, {
      as: 'tasks',
      foreignKey: {
        name: 'status_id',
        allowNull: false,
      },
    });

    TaskStatus.addScope('active', {
      include: {
        model: Task,
        as: 'tasks',
        required: true,
      },
    });
  };

  return TaskStatus;
};
