import mongoose, { Document, Schema } from 'mongoose';



interface IMCustomer extends Document {
    user_id: string,
    room_key: string;
    nik: number;
    bill_status: string;
    booking_status: string;
    username : string;
    password: string;
    email : string;
    phone : number;
    role: string;
    checkIn: Date;
    checkOut: Date;
    refresh_token: string;
    createAt : number;
    creatorId: string;    
}



const ManagementSchema: Schema = new Schema(
    {

        user_id: {
            type: String,
            required: [true, "userid cannot be empty"],
            trim: true
        },

        nik: {
            type: Number,
            required: [true, "userid cannot be empty"],
            trim: true
        },

        room_key: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: [true, "room code cannot be empty"],
            trim: true
        },

        bill_status: {
            type: String,
            enum: ['lunas', 'belum_lunas','pembayaran'],
            required: [true, "bill status cannot be empty"],
            trim: true
        },

        booking_status: {
            type: String,
            enum: ['M', 'K','AK','P'], // M : Masuk, K : keluar, AK :Ajukan Keluar, P: Pesan
            required: [true, "booking status cannot be empty"],
            trim: true
        },

        username: {
            type: String,
            // required: [true, "name cannot be empty"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "email cannot be empty"],
            trim: true
        },

        phone: {
            type: Number,
            required: [true, "phome cannot be empty"],
            trim: true
        },

        password: {
            type: String,
            // required: [true, "password cannot be empty"],
            trim: true
        },

        role: {
            type: String,
            enum: ['customer'],
            // required: [true, "password cannot be empty"],
            trim: true
        },
        checkIn: {
            type: Date,
            // required: [true, "password cannot be empty"],
            trim: true
        },

        checkOut: {
            type: Date,
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

const  CustomerModel = mongoose.model<IMCustomer>('Customer', ManagementSchema,'Customer');

export default CustomerModel;

