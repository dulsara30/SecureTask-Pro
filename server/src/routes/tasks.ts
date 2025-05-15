import { Router } from 'express';
import { body } from 'express-validator';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { auth, adminOnly } from '../middlewares/auth'

const taskRouter = Router();

taskRouter.post( '/',
    auth,
    [
        body('title').notEmpty().withMessage('Title is required'),
        // body('description').notEmpty().withMessage('Description is required'),
        body('category').isIn(['Work', 'Personal', 'Other']).withMessage('Category must be one of Work, Personal, or Other'),
        body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be one of Pending, In Progress, or Completed'),
    ],
    createTask
    
);

taskRouter.get( '/',
    auth,
    getTasks
);

taskRouter.get( '/:id',
    auth,
    getTaskById
);

taskRouter.put( '/:id',
    auth,
    [
        body('title').notEmpty().withMessage('Title is required'),
        // body('description').notEmpty().withMessage('Description is required'),
        body('category').optional().isIn(['Work', 'Personal', 'Other']).withMessage('Category must be one of Work, Personal, or Other'),
        body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be one of Pending, In Progress, or Completed'),
    ],
    updateTask
);

taskRouter.delete( '/:id',
    auth, adminOnly,
    deleteTask
);

export default taskRouter;
// import { Router } from 'express';