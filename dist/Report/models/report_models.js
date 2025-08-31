"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReportSchema = new mongoose_1.default.Schema({
    customer_key: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Customer',
        // default: '', 
        required: false
    },
    report_type: { type: String, required: false, enum: ["FK", "FU", "K"], },
    broken_type: { type: String, required: false, enum: ["SP", "R", "SR", ""], },
    progress: { type: String, required: false, enum: ["A", "P", "S", "T"], default: 'A' },
    complain_des: { type: String, required: false },
    broken_des: { type: String, required: false },
    admin_note: { type: String, required: false, default: '' },
    status: { type: Boolean, default: false },
    image: { type: String, default: '', required: false },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const ReportModel = mongoose_1.default.model('Report', ReportSchema, 'Report');
exports.default = ReportModel;
