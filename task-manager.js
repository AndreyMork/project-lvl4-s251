import getServer from '.';

const port = process.env.PORT || 5000;
getServer().listen(port, () => {
  console.log(`Listening on ${port}`);
});
