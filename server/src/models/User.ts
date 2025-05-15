import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document{
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String, // The "String" here refers to the JavaScript String constructor, not the TypeScript type.
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'adimin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    // Check if the password field has been modified
    if (!this.isModified('password')) return next();

    // Hash the password with bcrypt before saving
    this.password = await bcrypt.hash(this.password, 10);

    // Proceed to the next middleware or save operation
    next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    // Compare the provided password with the hashed password in the database
    return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', userSchema);
// Exporting the User model based on the IUser interface and userSchema