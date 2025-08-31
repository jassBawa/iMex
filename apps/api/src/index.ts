import express from 'express';
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/auth.route'
import candlesRouter from './routes/candles.route';

const app = express();


app.use(cors())
app.use(express.json())
app.use(errorHandler)

app.use("/auth", authRouter)

app.use("/candles", candlesRouter)

app.listen(4000, () => {
  console.log('server started');
});
