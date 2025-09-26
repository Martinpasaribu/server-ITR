
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import FacilityModel from '../models/facility_models';

export class FacilityControllers {


        static async PostFacility(req: any, res: any) {
            const { name, code, price, status, date_in, date_repair, price_repair, qty } = req.body;

            try {
                // 1. Validasi input
                if (!name || !code || !price || !status || !date_in || !qty) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    message: `All fields can't be empty`,
                    success: false,
                });
                }

                // 2. Cek apakah code sudah ada di DB
                const existingRoom = await FacilityModel.findOne({ name: name, code: code.trim().toUpperCase() });
                if (existingRoom) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: "Kode facilty atau nama fasilitas sudah digunakan, silakan gunakan kode atau nama lain.",
                    success: false,
                });
                }

                // 3. Create room
                const newRoom = await FacilityModel.create({

                    code: code.trim().toUpperCase(),
                    price,
                    name,
                    qty,
                    status,
                    date_in,
                    date_repair,
                    price_repair,

                });

                // 4. Response sukses
                return res.status(201).json({
                    requestId: uuidv4(),
                    data: newRoom,
                    message: "Successfully created facility.",
                    success: true,
                });
            } catch (error) {
                // 5. Tangkap error
                return res.status(500).json({
                    requestId: uuidv4(),
                    data: null,
                    message: (error as Error).message,
                    success: false,
                });
            }
        }


        static async GetFacility  (req : any , res:any)  {

            try {

                const users = await FacilityModel.find({isDeleted:false});
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: users,
                    success: true,
                    message: 'Data facility success fetch'
                });
            
            } catch (error) {

                console.log(error);
                // Kirim hasil response
                return res.status(400).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message || "Internal Server Error",
                success: false
                });

            }
        
        }


        static async DeleteFacility(req: Request, res: Response) {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                requestId: uuidv4(),
                message: "ID room tidak boleh kosong",
                success: false,
                });
            }

            try {
                const deleted = await FacilityModel.findByIdAndDelete(id);

                if (!deleted) {
                return res.status(404).json({
                    requestId: uuidv4(),
                    message: "Room tidak ditemukan",
                    success: false,
                });
                }

                return res.status(200).json({
                requestId: uuidv4(),
                message: "Berhasil menghapus room",
                success: true,
                });
            } catch (error: any) {
                return res.status(500).json({
                requestId: uuidv4(),
                message: error.message || "Terjadi kesalahan server",
                success: false,
                });
            }
        }


        static async UpdateFacility(req: Request, res: Response) {
            const { code } = req.query;
            const { data } = req.body;

            // Validasi status sesuai enum
            if (!code) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    message: "Code Tidak ada",
                    success: false,
                });
            }

            try {
                const updatedRoom = await FacilityModel.findOneAndUpdate(
                    { code: code, isDeleted: false },
                    data,
                    { new: true, runValidators: true }
                );


                if (!updatedRoom) {
                    return res.status(404).json({
                        requestId: uuidv4(),
                        message: "Facility tidak ditemukan",
                        success: false,
                    });
                }

                return res.status(200).json({
                    requestId: uuidv4(),
                    message: "Berhasil update facility",
                    data: updatedRoom,
                    success: true,
                });

            } catch (error: any) {
                return res.status(500).json({
                    requestId: uuidv4(),
                    message: error.message || "Terjadi kesalahan server",
                    success: false,
                });
            }
        }

        static async UpdateFacilityStatus(req: Request, res: Response) {

            const { code } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                success: false,
                message: "Status harus diisi",
                });
            }

            try {
                const updated = await FacilityModel.findOneAndUpdate(
                { code, isDeleted: false },
                { status },
                { new: true, runValidators: true }
                );

                if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Facility tidak ditemukan",
                });
                }

                return res.status(200).json({
                success: true,
                message: "Status berhasil diupdate",
                data: updated,
                });
            } catch (err: any) {
                return res.status(500).json({
                success: false,
                message: err.message || "Server error",
                });
            }
        }

        static async AddImage(req: Request, res: Response) {
        const { code } = req.params;
        const { image } = req.body;

        try {
            const updated = await FacilityModel.findOneAndUpdate(
            { code, isDeleted: false },
            { image },
            { new: true }
            );

            if (!updated) {
            return res.status(404).json({ success: false, message: "Facility not found" });
            }

            return res.status(200).json({
            success: true,
            message: "Main image updated successfully",
            data: updated,
            });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
        }

        static async AddImageIRepair(req: Request, res: Response) {
            const { code } = req.params;
            const { image_irepair } = req.body;

            try {
                const updated = await FacilityModel.findOneAndUpdate(
                    { code, isDeleted: false },
                    { image_IRepair: image_irepair },
                    { new: true }
                );

                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }

                return res.status(200).json({
                    success: true,
                    message: "image invoice repair updated successfully",
                    data: updated,
                });
            } catch (err: any) {
                res.status(500).json({ success: false, message: err.message });
            }
        }

        static async AddImages(req: Request, res: Response) {
        const { code } = req.params;
        const { images } = req.body;

        try {
            const updated = await FacilityModel.findOneAndUpdate(
                { code, isDeleted: false },
                { $push: { images } },
                { new: true }
            );

            if (!updated) {
            return res.status(404).json({ success: false, message: "Facility not found" });
            }

            return res.status(200).json({
                success: true,
                message: "Image added to gallery successfully",
                data: updated,
            });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
        }

        static async DeletedImages(req: Request, res: Response) {
        const { code } = req.params;
        const { images } = req.body; // isi dengan URL yang mau dihapus

        try {
            const updated = await FacilityModel.findOneAndUpdate(
            { code, isDeleted: false },
            { $pull: { images } },
            { new: true }
            );

            if (!updated) {
            return res.status(404).json({ success: false, message: "Facility not found" });
            }

            return res.status(200).json({
            success: true,
            message: "Image removed from gallery successfully",
            data: updated,
            });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
        }



        // Sub Data

        static async GetCodeRoom(req: any, res: any) {
            try {
                const rooms = await FacilityModel.find(
                    { isDeleted: false }, // filter
                    { code: 1}   // projection: ambil hanya `code`, sembunyikan `_id`
                );

                res.status(200).json({
                    requestId: uuidv4(),
                    data: rooms,
                    success: true
                });

            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: (error as Error).message || "Internal Server Error",
                    success: false
                });
            }
        }

}