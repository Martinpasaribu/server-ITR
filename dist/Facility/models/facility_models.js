"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FacilitySchema = new mongoose_1.default.Schema({
    name: { type: String, unique: true, required: false },
    code: { type: String, unique: true, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    price_repair: { type: Number, required: false },
    date_repair: { type: Date, required: false },
    date_in: { type: Date, required: false },
    status: {
        type: String,
        required: false,
        enum: ["B", "P", "T", "R"],
    },
    image: { type: String, default: "", required: false }, // satu gambar utama
    image_IRepair: { type: String, default: "", required: false }, // satu gambar utama
    images: [{ type: String }], // koleksi galeri
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const FacilityModel = mongoose_1.default.model("Facility", FacilitySchema, "Facility");
exports.default = FacilityModel;
