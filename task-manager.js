// import dotenv from 'dotenv';
import getServer from '.';

// dotenv.load();
const port = process.env.PORT || 5000;
getServer().listen(port, () => {
  console.log(`Listening on ${port}`);
});
