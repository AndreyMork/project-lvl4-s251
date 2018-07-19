import { omit } from 'lodash';

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

  Task.associate = async ({ User, TaskStatus, Tag }) => {
    Task.belongsTo(User, {
      as: 'creator',
      foreignKey: {
        allowNull: false,
      },
    });

    Task.belongsTo(User, {
      as: 'assignee',
      foreignKey: {
        allowNull: false,
      },
    });

    Task.belongsTo(TaskStatus, {
      as: 'status',
      foreignKey: {
        allowNull: false,
      },
    });

    Task.belongsToMany(Tag, {
      through: 'task_tag',
    });
  };
  Task.findAndFilterAll = async (filters) => {
    const { tagId } = filters;
    const preparedFilters = omit(filters, 'tagId');

    const taskHasTag = task => task.tags.map(tag => tag.id).includes(tagId);
    const filterByTagId = tasks => tasks
      .filter(task => taskHasTag(task, tagId));

    const preFilteredTasks = await Task.findAll({
      where: preparedFilters,
      include: ['creator', 'status', 'assignee', 'tags'],
      order: [['name', 'ASC']],
    });

    return tagId ? filterByTagId(preFilteredTasks) : preFilteredTasks;
  };

  return Task;
};
