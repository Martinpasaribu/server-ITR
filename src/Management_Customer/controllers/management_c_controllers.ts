import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from "dotenv";
import CustomerModel from "../models/management_cmodels";
import crypto from "crypto";
import { Request, Response } from "express";
import { RoomServices } from "../../Room/services/service_room";
import RoomModel from "../../Room/models/room_models";

dotenv.config()

export class ManagementController {


    static async  getCustomer (req : any, res:any) {

        try {
            const customer = await CustomerModel.find().populate('room_key');
            
            res.status(200).json(
            {
                requestId: uuidv4(), 
                message: "Data Customer.",
                success: false,
                data: customer
            }

        );
        } catch (error) {
            console.log(error);
        }
    }

    static async  cekUser (req : any, res:any) {

        try {

            const { email } = req.params;

            const users = await CustomerModel.findOne({email: email});

            if(users){
                res.status(200).json(
                    {
                        requestId: uuidv4(), 
                        message: "User Available.",
                        success: true,
                        data: users
                    }
                );
            }else {
                res.status(200).json(
                    {
                        requestId: uuidv4(), 
                        message: "User Unavailable.",
                        success: false,
                        data: users
                    }
                );
            }

        } catch (error) {
            res.status(400).json(
                {
                    requestId: uuidv4(), 
                    data: null,
                    message:  (error as Error).message,
                    success: false
                }
            );
        }
    }


    static async Register(req: any, res: any) {
        const {  nik, username, email, password, phone, checkIn, bill_status, room_key, booking_status } = req.body;

        try {
            // Generate user_id: 4 karakter acak + username
            const randomCode = crypto.randomBytes(1).toString("hex").toUpperCase(); // 4 hex char
            const user_id = `${username}${randomCode}`;

            const required = ["username", "email", "room_key", "phone", "checkIn"];

            // Cari field kosong
            for (const field of required) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        requestId: uuidv4(),
                        message: `${field} tidak boleh kosong`,
                        success: false,
                    });
                }
            }

            // 1. Cek apakah user_id sudah ada
            const existingUser = await CustomerModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: `Username ${user_id} sudah terdaftar.`,
                    success: false
                });
            }

            // 2. Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    message: "Format email tidak valid.",
                    success: false,
                });
            }

            const RoomStatus = await RoomServices.CekRoomAvailable(room_key);
            if (RoomStatus === false) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: "Room yang dipilih tidak tersedia",
                    success: false,
                });
            }

            await RoomServices.CekRoomAvailableOnUse(room_key);

            // 3. Cek apakah email & phone sudah ada
            const existingOrder = await CustomerModel.findOne({ email: email, phone: phone });
            if (existingOrder) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: "Email atau no telepon sudah ada, gunakan yang lain.",
                    success: false,
                });
            }


            // 3. Hash password jika ada
            let hashPassword = "";
            if (password) {
                const salt = await bcrypt.genSalt();
                hashPassword = await bcrypt.hash(password, salt);
            }

            // 4. Simpan user
            const user = await CustomerModel.create({
                user_id,
                username,
                nik,
                phone,
                checkIn,
                bill_status,
                room_key,
                email,
                booking_status,
                password: hashPassword || undefined,
            });

            await RoomServices.AddCustomerToRoom(room_key, user._id);


            // 6. Respon sukses
            return res.status(201).json({
                requestId: uuidv4(),
                data: user,
                message: "Customer berhasil didaftarkan.",
                success: true
            });

        } catch (error) {
            console.error("Register Error:", error);
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message || "Terjadi kesalahan pada server.",
                success: false
            });
        }
    }


    static async UpdateStatusBooking(req: Request, res: Response) {

        const { id } = req.params;
        const { status, roomId } = req.body;

        if (!status) {
            return res.status(400).json({
            success: false,
            message: "Status harus diisi",
            });
        }

        try {

            const StatusRoom = await RoomModel.findOne(
                
                {_id: roomId, status: false, isDeleted: false }
            );

            let newStatus: boolean;

            if (status === "M" || status === "P") {

                if(StatusRoom) throw new Error("Room sudah di gunakan");

                newStatus = false; // kamar dipakai

                const updatedRoom = await RoomModel.findByIdAndUpdate(
                    roomId,
                    { status: newStatus },
                    { new: true }
                );

                if (!updatedRoom) {
                    throw new Error(`Room not found ${roomId}`); // lempar error, biar controller yang handle response
                }


            } else if (status === "K") {
                newStatus = true; // kamar dilepas

                const updatedRoom = await RoomModel.findByIdAndUpdate(
                    roomId,
                    { status: newStatus },
                    { new: true }
                );

                if (!updatedRoom) {
                    throw new Error(`Room not found ${roomId}`); // lempar error, biar controller yang handle response
                }

            }
            //  else {
            //     throw new Error("Status tidak valid");
            // }

            const updated = await CustomerModel.findOneAndUpdate(
                { _id:id, isDeleted: false },
                { booking_status: status },
                { new: true, runValidators: true }
            );

            if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Customer tidak ditemukan",
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


    static async UpdateCustomer(req: Request, res: Response) {
        
        const { id } = req.params;

        const { password, ...data } = req.body; // pisahkan password dari field lain

        if (!id) {
            return res.status(400).json({ success: false, message: "ID kosong" });
        }

        await RoomServices.CekRoomAvailableOnUse(data.room_key);

        try {
            // Hash password jika ada
            if (password && password.trim() !== "") {
                const salt = await bcrypt.genSalt();
                data.password = await bcrypt.hash(password, salt);
            }

            const updated = await CustomerModel.findOneAndUpdate(
                { _id: id, isDeleted: false },
                data,
                { new: true, runValidators: true }
            );

            if (!updated) {
                return res.status(404).json({ success: false, message: "Customer tidak ditemukan" });
            }
            
            await RoomServices.AddCustomerToRoom(data.room_key, id);

            return res.status(200).json({ success: true, message: "Customer berhasil diupdate", data: updated });

        } catch (error) {
            return res.status(500).json(
            {
            requestId: uuidv4(),
            message: (error as Error).message || "Terjadi kesalahan pada server.",
            success: false,
            }
        );
        }
    }


    static async UpdateCustomerClient(req: Request, res: Response) {
    
        const { _id } = req.params;
        const { username, email, user_id, phone, password } = req.body;
    
        if (!_id) {
            return res.status(400).json({ success: false, message: "ID kosong" });
        }
    
        const oldAdmin = await CustomerModel.findById(_id);
        if (!oldAdmin) {
            return res.status(404).json({ success: false, message: "oldEmployee not found" });
        }
    
        
        try {
            const updateData: any = {};
    
            // isi hanya kalau ada datanya
            if (username && username.trim() !== "") updateData.username = username;
            if (email && email.trim() !== "") updateData.email = email;
            if (user_id && user_id.trim() !== "") updateData.user_id = user_id;
            if (phone !== undefined && phone !== null && String(phone).trim() !== "") {
                updateData.phone = String(phone).trim();
            }
            if (password && password.trim() !== "") {
                const salt = await bcrypt.genSalt();
                updateData.password = await bcrypt.hash(password, salt);
            }
    
            // 1. Cek apakah user_id sudah ada
            const existingUser = await CustomerModel.findOne({ user_id: user_id, username: username , isDelete: false });
            if (existingUser) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: `UserID: ${user_id} atau Username: ${username} sudah terdaftar.`,
                    success: false
                });
            }

            if(email){
                
                // 2. Validasi format email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        requestId: uuidv4(),
                        message: "Format email tidak valid.",
                        success: false,
                    });
                }
            }

            // 3. Cek apakah email & phone sudah ada
            const existingOrder = await CustomerModel.findOne({email, phone , isDelete: false});
            if (existingOrder) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: `Email ${email} atau ${phone} sudah ada, gunakan yang lain.`,
                    success: false,
                });
            }

            const updated = await CustomerModel.findOneAndUpdate(
                { _id, isDeleted: false },
                { $set: updateData },
                { new: true, runValidators: true }
            );
    
            if (!updated) {
                return res.status(404).json({ success: false, message: "Profile tidak ditemukan" });
            }
    
            return res.status(200).json({
                success: true,
                message: "Profile berhasil diupdate",
                data: updated
            });

        } catch (err: any) {
            return res.status(500).json({
            success: false,
            message: err.message || "Server error"
            });
        }
     }

    static async DeletedCustomer(req: Request, res: Response) {
        const { _id, room_id } = req.params;

        if (!_id) {
            return res.status(400).json({
            requestId: uuidv4(),
            message: "ID customer tidak boleh kosong",
            success: false,
            });
        }

        try {
            
            const deleted = await CustomerModel.findByIdAndDelete(_id);

            if (!deleted) {
                return res.status(404).json({
                    requestId: uuidv4(),
                    message: "Customer tidak ditemukan",
                    success: false,
                });
            }

            const UpdateRoom = await RoomServices.UpdateStatusRoom("K",room_id)

            return res.status(200).json({
                requestId: uuidv4(),
                message: "Berhasil menghapus customer",
                UpdateRoom: UpdateRoom,
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

    

}