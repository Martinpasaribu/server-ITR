import mongoose, { Document, Schema } from 'mongoose';



interface IUser extends Document {
    user_id: string,
    name : string;
    password: string;
    email : string;
    refresh_token: string;
    createAt : number;
    creatorId: string;    
}



const UserSchema: Schema = new Schema(
    {

        user_id: {
            type: String,
            required: [true, "name cannot be empty"],
            trim: true
        },
        name: {
            type: String,
            // required: [true, "name cannot be empty"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "email cannot be empty"],
            trim: true
        },
        password: {
            type: String,
            // required: [true, "password cannot be empty"],
            trim: true
        },


        refresh_token: {
            type: String,
            required: false
        },

        isDeleted: {
            type: Boolean,
            default: false  
        },


    },

    {
        timestamps: true,
    }

);

const  UserModel = mongoose.model<IUser>('User', UserSchema,'User');

export default UserModel;

