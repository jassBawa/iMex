import express from 'express';
import cors from 'cors'
import mainRouter from './routes/index.route'

const app = express();


app.use(cors())
app.use(express.json())

app.use("/api/v1", mainRouter)

app.listen(4000, () => {
  console.log('server started');
});
