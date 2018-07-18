import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  operatorsAliases: Sequelize.Op,
  snakecase: true,
});

const models = {
  User: sequelize.import('./User.js'),
  Task: sequelize.import('./Task.js'),
  TaskStatus: sequelize.import('./TaskStatus.js'),
  Tag: sequelize.import('./Tag.js'),
};

export const { User } = models;
export const { Task } = models;
export const { TaskStatus } = models;
export const { Tag } = models;

Object.values(models).forEach(async (model) => {
  if (model.associate) {
    await model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
