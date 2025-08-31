import mongoose from 'mongoose';

interface IReport extends Document{
    customer_key: string,
    report_type: "FK" | "FU" | "K";
    broken_type: "SP" | "R" | "SR"| "";
    progress: "A" | "P" | "S" | "T";
    complain_des: string,
    broken_des: string,
    admin_note: string,
    status: boolean,
    image: string
}

const ReportSchema = new mongoose.Schema({

    customer_key: {             
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        // default: '', 
        required: false 
    },

    report_type: { type: String, required: false, enum: [ "FK" , "FU" , "K"], },
    broken_type: { type: String, required: false, enum: [ "SP" , "R" , "SR", ""], },
    progress: { type: String, required: false, enum: [ "A" , "P" , "S", "T"], default:'A' },
    complain_des: { type: String, required: false },
    broken_des: { type: String, required: false },
    admin_note: { type: String, required: false, default: '' },
    status: { type: Boolean, default: false},
    image: { type: String, default: '',  required: false },
    isDeleted: {
        type: Boolean,
        default: false  
    },
},
    {
        timestamps: true,
    }
);

const  ReportModel = mongoose.model<IReport>('Report', ReportSchema,'Report');

export default ReportModel;
