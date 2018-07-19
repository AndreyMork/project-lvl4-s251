import 'dotenv/config';
import gulp from 'gulp';
import repl from 'repl';
import getServer from '.';
import container from './container';

gulp.task('console', () => {
  const replServer = repl.start({
    prompt: '> ',
  });

  Object.keys(container).forEach((key) => {
    replServer.context[key] = container[key];
  });
});

gulp.task('initDb', async () => {
  const { sequelize, TaskStatus } = container.db;
  await sequelize.sync({ force: true });

  await TaskStatus.bulkCreate([
    { name: 'new' },
    { name: 'in work' },
    { name: 'in testing' },
    { name: 'completed' },
  ]);

  await sequelize.close();
});

gulp.task('server', () => {
  const port = process.env.PORT || 5000;
  getServer().listen(port, () => {
    console.log(`Listening on ${port}`);
  });
});
