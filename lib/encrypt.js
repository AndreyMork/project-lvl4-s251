import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.load();

const secret = process.env.SECRET;

export default value => crypto.createHmac('sha256', secret)
  .update(value)
  .digest('hex');
