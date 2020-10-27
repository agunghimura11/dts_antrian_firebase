import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';

import elasticRouter from './routes/elasticsearch.routes'

import firebaseRouter from './routes/firebase.routes'

const PORT = process.env.PORT || 3000;

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message
  });
});

//routes
// postman: https://www.getpostman.com/collections/09cb030a16b68e2da7a9
app.get('/', async (req, res, next) => {
  res.json({message: 'success'});
})

//app.use('/es', elasticRouter)
app.use('/fb', firebaseRouter)

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});