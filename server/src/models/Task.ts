import { Schema, model, Document } from 'mongoose';

interface Itask extends Document{
    title: string;
    description?: string;
    category: 'Work' | 'Personal' | 'Other';
    status: 'Pending' | 'In Progress' | 'Completed';    
    userId: Schema.Types.ObjectId; // Reference to the user who created the task
    createdAt: Date;
}

const taskSchema = new Schema<Itask>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Other'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to the user who created the task
    // The userId field is a reference to the User model, which allows us to associate tasks with specific users.
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export default model<Itask>('Task', taskSchema);