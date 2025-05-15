import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request{
    user?: {
        userId: string;
        role: string;
    }
}

export const auth =  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

    const token = req.cookies.token; // Get the token from cookies
    if(!token){
        res.status(401).json({ message: "No token, authorization denied"});
        return;
    }

    try{
        const decoded =  jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string};
        req.user =  decoded; // Attach the decoded user information to the request object
        next(); // Call the next middleware or route handler    
    }catch(err){
        res.status(401).json({message: "Token is not valid"});
    }
};

// export default auth;
// // Exporting the auth middleware function for use in other files

export const adminOnly = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: "Admin access required" });
        return; // Stop the request processing if the user is not an admin
    }
    next(); // Call the next middleware or route handler
    return Promise.resolve(); // Explicitly return a resolved Promise
};

