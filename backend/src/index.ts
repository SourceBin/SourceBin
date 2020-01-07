import express from 'express';
import mongoose from 'mongoose';

import routes from './routes';

const app = express();
app.use(routes);

mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`)))
  .catch(console.error);
