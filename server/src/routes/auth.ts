import {Router} from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { signup , login } from '../controllers/authController';

const userRouter = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 5 requests per windowMs
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});

userRouter.post('/signup', 
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    ],
    signup
);

userRouter.post('/login', loginLimiter,
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty().withMessage('password is required'),
    ],
    login
);

export default userRouter;