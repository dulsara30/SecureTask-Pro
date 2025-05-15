import express, { Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import  connectDB  from './config/db';
import userRouter from './routes/auth';
import taskRouter from './routes/tasks';

dotenv.config();
const app: Express  = express();

// Middleware
app.use(helmet()); //Add secure HTTP headers
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true})); //Allow requests from the frontend
app.use(express.json()); //Parse JSON request bodies
app.use(express.urlencoded({extended: true})); //Parse URL-encoded request bodies

connectDB();

app.use("/api/auth" , userRouter); // Use the /api prefix for all routes

app.use("/api/tasks", taskRouter); // Use the /api prefix for all routes
// Health check route

app.route("/api/good").get((req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is running'});
});

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});