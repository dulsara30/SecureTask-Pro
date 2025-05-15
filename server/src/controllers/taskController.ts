import {Request, Response} from 'express';
import Task from '../models/Task';
import { validationResult } from 'express-validator';
import User from '../models/User';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

// Create a new task
export const createTask = async (req: AuthRequest, res:Response): Promise<void> => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({message: errors.array()});    
        return;
    }

    const { title, description, category } = req.body;

    try{
        const task = new Task({
            title,
            description,
            category,
            userId: req.user!.userId, // Get the userId from the request object
            status: 'Pending', // Default status
        });
        await task.save();
        res.status(201).json(task); // Return the created task;

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};

// Get all tasks for a user
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    
    try{
        const tasks = await Task.find({ userId: req.user!.userId});
        res.status(200).json(tasks); // Return the tasks for the user
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};

// Get a single task by ID
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {

    const taskId = req.params.id; // Get the task ID from the request parameters

    try{
        const task = await Task.findById(taskId);
        if(!task){
            res.status(404).json({message: 'Task not found'}); // Return 404 if task not found
            return;
        }
        if(task.userId.toString() !== req.user!.userId){
            res.status(403).json({message: 'Not authorized to access this task'}); // Return 403 if not authorized
            return;
        }
        res.status(200).json(task); // Return the task
}catch(err){
    console.error(err);
    res.status(500).json({message: 'server error'});
}
};

// Update a task by ID
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({message: errors.array()});
        return;
    }

    try{
        const task = await Task.findOne({ _id: req.params.id, userId: req.user!.userId});
        if(!task){
            res.status(404).json({message: 'Task not found or unauthorized'}); // Return 404 if task not found or unauthorized
            return;
        }

        Object.assign(task, req.body); // Update the task with the request body
        await task.save(); // Save the updated task
        res.json(task); // Return the updated task
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'}); // Return 500 if server error

    }
};

// Delete a task by ID
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    
    try{
        const task = await Task.findOne({ _id: req.params.id, userId: req.user!.userId});
        if(!task){
            res.status(404).json({message: 'Task not found or unauthorized'}); // Return 404 if task not found or unauthorized
            return;
        }

        if (task.userId.toString() !== req.user!.userId && req.user!.role !== 'admin') {
            res.status(403).json({message: 'Not authorized to delete this task'}); // Return 403 if not authorized
            return;
        }

        if(task){
            await task.deleteOne(); // Delete the task
            res.status(200).json({message: 'Task deleted successfully'}); // Return success message
        }
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'}); // Return 500 if server error
    }
};