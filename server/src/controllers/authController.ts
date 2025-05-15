import {Request, Response} from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * Handles user signup requests.
 *
 * This function validates the incoming request for errors using `validationResult`.
 * If validation errors are found, it responds with a 400 status code and an array of error details.
 *
 * @param req - The HTTP request object, expected to contain user signup data.
 * @param res - The HTTP response object used to send the response back to the client.
 * @returns A Promise that resolves to void. The response is sent directly to the client.
 *
 * @remarks
 * Ensure that the request body contains all required fields for user signup
 * and that validation middleware is applied before this controller.
 */
export const signup = async (req: Request, res: Response): Promise<void> => {

    // Validate the request body using express-validator
    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({error: error.array()});
    }

    const { email, password } =  req.body;
     
    // Check if the email and password are provided
    if(!email || !password){
        res.status(400).json({message: "Email and password are required"});
        return;
    }

    // Check if the email is valid
    if(!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)){
        res.status(400).json({message: "Invalid email address"});
        return;
    }
    // Check if the password is strong enough   
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/.test(password)){
        res.status(400).json({message: "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"});
        return;
    }
    // Check if the password is not the same as the email
    if(password === email){
        res.status(400).json({message: "Password cannot be the same as email"});
        return;
    }
    // Check if the password does not contain the email
    if(password.includes(email)){
        res.status(400).json({message: "Password cannot contain email"});
        return;
    } 
    // Check if the password is not too short
    if(password.length < 6){
        res.status(400).json({message: "Password must be at least 6 characters long"});
        return;
    }


    try{
        // Check if the user already exists in the database
        let user = await User.findOne({email});
        if(user) {
            res.status(400).json({message: "User already exists"});
            return;
        }

        user = new User({email, password});
        await user.save(); // Save the new user to the database

        const token = jwt.sign(
            {userId: user._id, role: user.role}, // Payload for the JWT
            process.env.JWT_SECRET as string, // Secret key for signing the JWT
            {expiresIn: '10m'} // Token expiration time
        );

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // CSRF protection
            maxAge: 3600000 // Cookie expiration time (1 hour)
        });

        res.status(201).json({ message: "User Created"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server Error"});
    }

};

/**
 * Handles user login requests.
 *
 * This function validates the incoming request for errors using `validationResult`.
 * If validation errors are found, it responds with a 400 status code and an array of error details.
 *
 * @param req - The HTTP request object, expected to contain user login data.
 * @param res - The HTTP response object used to send the response back to the client.
 * @returns A Promise that resolves to void. The response is sent directly to the client.
 *
 * @remarks
 * Ensure that the request body contains all required fields for user login
 * and that validation middleware is applied before this controller.
 */

export const login = async (req: Request, res: Response): Promise<void> => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
        return;
    }

    const {email, password} = req.body;

    try{

        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message: "Invalid email or password"});
            return;
        }

        const isMatch =  await user.comparePassword(password);
        // Compare the provided password with the hashed password in the database
        if(!isMatch){
            res.status(400).json({message: "Invalid email or password"});
            return;
        }

        const token = jwt.sign(
            {userId: user._id, role: user.role}, // Payload for the JWT
            process.env.JWT_SECRET as string, // Secret key for signing the JWT
            {expiresIn: '10m'} // Token expiration time
        ); 

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // CSRF protection
            maxAge: 3600000 // Cookie expiration time (1 hour)
        });

        res.json({ message: "User logged in successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server Error"});
    }
};