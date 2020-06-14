import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import routes from './routes';
import { registerStrategies } from './strategies';

registerStrategies();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(routes);

mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`)))
  .catch(console.error);
