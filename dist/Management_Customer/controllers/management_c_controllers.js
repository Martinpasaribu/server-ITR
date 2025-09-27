"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const management_cmodels_1 = __importDefault(require("../models/management_cmodels"));
const crypto_1 = __importDefault(require("crypto"));
const service_room_1 = require("../../Room/services/service_room");
const room_models_1 = __importDefault(require("../../Room/models/room_models"));
dotenv_1.default.config();
class ManagementController {
    static getCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield management_cmodels_1.default.find().populate('room_key');
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Data Customer.",
                    success: false,
                    data: customer
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static cekUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const users = yield management_cmodels_1.default.findOne({ email: email });
                if (users) {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "User Available.",
                        success: true,
                        data: users
                    });
                }
                else {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "User Unavailable.",
                        success: false,
                        data: users
                    });
                }
            }
            catch (error) {
                res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false
                });
            }
        });
    }
    static Register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nik, username, email, password, phone, checkIn, bill_status, room_key, booking_status } = req.body;
            try {
                // Generate user_id: 4 karakter acak + username
                const randomCode = crypto_1.default.randomBytes(1).toString("hex").toUpperCase(); // 4 hex char
                const user_id = `${username}${randomCode}`;
                const required = ["username", "email", "room_key", "phone", "checkIn"];
                // Cari field kosong
                for (const field of required) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            requestId: (0, uuid_1.v4)(),
                            message: `${field} tidak boleh kosong`,
                            success: false,
                        });
                    }
                }
                // 1. Cek apakah user_id sudah ada
                const existingUser = yield management_cmodels_1.default.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        data: null,
                        message: `Username ${user_id} sudah terdaftar.`,
                        success: false
                    });
                }
                // 2. Validasi format email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Format email tidak valid.",
                        success: false,
                    });
                }
                const RoomStatus = yield service_room_1.RoomServices.CekRoomAvailable(room_key);
                if (RoomStatus === false) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room yang dipilih tidak tersedia",
                        success: false,
                    });
                }
                yield service_room_1.RoomServices.CekRoomAvailableOnUse(room_key);
                // 3. Cek apakah email & phone sudah ada
                const existingOrder = yield management_cmodels_1.default.findOne({ email: email, phone: phone });
                if (existingOrder) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Email atau no telepon sudah ada, gunakan yang lain.",
                        success: false,
                    });
                }
                // 3. Hash password jika ada
                let hashPassword = "";
                if (password) {
                    const salt = yield bcrypt_1.default.genSalt();
                    hashPassword = yield bcrypt_1.default.hash(password, salt);
                }
                // 4. Simpan user
                const user = yield management_cmodels_1.default.create({
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
                yield service_room_1.RoomServices.AddCustomerToRoom(room_key, user._id);
                // 6. Respon sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: user,
                    message: "Customer berhasil didaftarkan.",
                    success: true
                });
            }
            catch (error) {
                console.error("Register Error:", error);
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Terjadi kesalahan pada server.",
                    success: false
                });
            }
        });
    }
    static UpdateStatusBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status, roomId } = req.body;
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status harus diisi",
                });
            }
            try {
                const StatusRoom = yield room_models_1.default.findOne({ _id: roomId, status: false, isDeleted: false });
                let newStatus;
                if (status === "M" || status === "P") {
                    if (StatusRoom)
                        throw new Error("Room sudah di gunakan");
                    newStatus = false; // kamar dipakai
                    const updatedRoom = yield room_models_1.default.findByIdAndUpdate(roomId, { status: newStatus }, { new: true });
                    if (!updatedRoom) {
                        throw new Error(`Room not found ${roomId}`); // lempar error, biar controller yang handle response
                    }
                }
                else if (status === "K") {
                    newStatus = true; // kamar dilepas
                    const updatedRoom = yield room_models_1.default.findByIdAndUpdate(roomId, { status: newStatus }, { new: true });
                    if (!updatedRoom) {
                        throw new Error(`Room not found ${roomId}`); // lempar error, biar controller yang handle response
                    }
                }
                //  else {
                //     throw new Error("Status tidak valid");
                // }
                const updated = yield management_cmodels_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { booking_status: status }, { new: true, runValidators: true });
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
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Server error",
                });
            }
        });
    }
    static UpdateCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const _a = req.body, { password } = _a, data = __rest(_a, ["password"]); // pisahkan password dari field lain
            if (!id) {
                return res.status(400).json({ success: false, message: "ID kosong" });
            }
            yield service_room_1.RoomServices.CekRoomAvailableOnUse(data.room_key);
            try {
                // Hash password jika ada
                if (password && password.trim() !== "") {
                    const salt = yield bcrypt_1.default.genSalt();
                    data.password = yield bcrypt_1.default.hash(password, salt);
                }
                const updated = yield management_cmodels_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Customer tidak ditemukan" });
                }
                yield service_room_1.RoomServices.AddCustomerToRoom(data.room_key, id);
                return res.status(200).json({ success: true, message: "Customer berhasil diupdate", data: updated });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    message: error.message || "Terjadi kesalahan pada server.",
                    success: false,
                });
            }
        });
    }
    static UpdateCustomerClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const { username, email, user_id, phone, password } = req.body;
            if (!_id) {
                return res.status(400).json({ success: false, message: "ID kosong" });
            }
            const oldAdmin = yield management_cmodels_1.default.findById(_id);
            if (!oldAdmin) {
                return res.status(404).json({ success: false, message: "oldEmployee not found" });
            }
            try {
                const updateData = {};
                // isi hanya kalau ada datanya
                if (username && username.trim() !== "")
                    updateData.username = username;
                if (email && email.trim() !== "")
                    updateData.email = email;
                if (user_id && user_id.trim() !== "")
                    updateData.user_id = user_id;
                if (phone !== undefined && phone !== null && String(phone).trim() !== "") {
                    updateData.phone = String(phone).trim();
                }
                if (password && password.trim() !== "") {
                    const salt = yield bcrypt_1.default.genSalt();
                    updateData.password = yield bcrypt_1.default.hash(password, salt);
                }
                // 1. Cek apakah user_id sudah ada
                const existingUser = yield management_cmodels_1.default.findOne({ user_id: user_id, username: username, isDelete: false });
                if (existingUser) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        data: null,
                        message: `UserID: ${user_id} atau Username: ${username} sudah terdaftar.`,
                        success: false
                    });
                }
                if (email) {
                    // 2. Validasi format email
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        return res.status(400).json({
                            requestId: (0, uuid_1.v4)(),
                            message: "Format email tidak valid.",
                            success: false,
                        });
                    }
                }
                // 3. Cek apakah email & phone sudah ada
                const existingOrder = yield management_cmodels_1.default.findOne({ email, phone, isDelete: false });
                if (existingOrder) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `Email ${email} atau ${phone} sudah ada, gunakan yang lain.`,
                        success: false,
                    });
                }
                const updated = yield management_cmodels_1.default.findOneAndUpdate({ _id, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Profile tidak ditemukan" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Profile berhasil diupdate",
                    data: updated
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Server error"
                });
            }
        });
    }
    static DeletedCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, room_id } = req.params;
            if (!_id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID customer tidak boleh kosong",
                    success: false,
                });
            }
            try {
                const deleted = yield management_cmodels_1.default.findByIdAndDelete(_id);
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Customer tidak ditemukan",
                        success: false,
                    });
                }
                const UpdateRoom = yield service_room_1.RoomServices.UpdateStatusRoom("K", room_id);
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus customer",
                    UpdateRoom: UpdateRoom,
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    message: error.message || "Terjadi kesalahan server",
                    success: false,
                });
            }
        });
    }
}
exports.ManagementController = ManagementController;
