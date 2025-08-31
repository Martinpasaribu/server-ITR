import mongoose, { Document } from "mongoose";

export interface IFacility extends Document {
  name: string;
  code: string;
  price: number;
  qty: number;
  status: "B" | "P" | "T" | "R";
  date_in: Date;
  date_repair: Date;
  price_repair: number;
  image: string;       // gambar utama
  image_IRepair: string;       // gambar utama
  images: string[];    // galeri
  isDeleted: boolean;
}

const FacilitySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const FacilityModel = mongoose.model<IFacility>(
  "Facility",
  FacilitySchema,
  "Facility"
);

export default FacilityModel;
