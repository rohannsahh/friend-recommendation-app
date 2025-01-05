import mongoose, { Types, Schema, Document } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    interests?: string[];
    friends: Types.ObjectId[];
    friendRequests: Types.ObjectId[]; // Field for storing pending friend requests
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: { type: [String], default: [] },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Friend list
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Pending friend requests
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
