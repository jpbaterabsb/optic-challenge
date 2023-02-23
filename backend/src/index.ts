import dotenv from 'dotenv';
import express from 'express';
import { validatorMiddleware } from './middlewares/validator';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.get('/', validatorMiddleware({
    email: 'required|email',
    dateOfBirth: 'required|date',
    address: 'required|string|min:16',
}), (req: express.Request, res: express.Response) => {
  
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});


