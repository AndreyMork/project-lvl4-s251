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

  return Promise.resolve();
});

gulp.task('server', () => {
  const port = process.env.PORT || 5000;
  getServer().listen(port, () => {
    console.log(`Listening on ${port}`);
  });
});
