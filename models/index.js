import Sequelize from 'sequelize';

let sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    storage: ':memory:',
    dialect: 'sqlite',
    operatorsAliases: Sequelize.Op,
    snakecase: true,
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    operatorsAliases: Sequelize.Op,
    snakecase: true,
  });
}

const models = {
  User: sequelize.import('./User.js'),
  Task: sequelize.import('./Task.js'),
  TaskStatus: sequelize.import('./TaskStatus.js'),
  Tag: sequelize.import('./Tag.js'),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
