import mongoose,{Types ,Schema} from "mongoose"

interface IUser extends Document{
    username:string;
    email:string;
    password:string ;
    interests?: string[];
    friends: Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: {type: String , required: true , unique:true},
    email:{type: String , required:true , unique : true},
    password:{type: String, required:true},
    interests:{type:[String],default:[]},
    friends:[{type:mongoose.Schema.Types.ObjectId , ref:'User'}]
});

const User = mongoose.model('User', UserSchema);
export default User;