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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityControllers = void 0;
const uuid_1 = require("uuid");
const facility_models_1 = __importDefault(require("../models/facility_models"));
class FacilityControllers {
    static PostFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, code, price, status, date_in, date_repair, price_repair, qty } = req.body;
            try {
                // 1. Validasi input
                if (!name || !code || !price || !status || !date_in || !date_repair || !qty) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `All fields can't be empty`,
                        success: false,
                    });
                }
                // 2. Cek apakah code sudah ada di DB
                const existingRoom = yield facility_models_1.default.findOne({ name: name, code: code.trim().toUpperCase() });
                if (existingRoom) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Kode facilty atau nama fasilitas sudah digunakan, silakan gunakan kode atau nama lain.",
                        success: false,
                    });
                }
                // 3. Create room
                const newRoom = yield facility_models_1.default.create({
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
                    requestId: (0, uuid_1.v4)(),
                    data: newRoom,
                    message: "Successfully created facility.",
                    success: true,
                });
            }
            catch (error) {
                // 5. Tangkap error
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static GetFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield facility_models_1.default.find({ isDeleted: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: users,
                    success: true,
                    message: 'Data facility success fetch'
                });
            }
            catch (error) {
                console.log(error);
                // Kirim hasil response
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Internal Server Error",
                    success: false
                });
            }
        });
    }
    static DeleteFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID room tidak boleh kosong",
                    success: false,
                });
            }
            try {
                const deleted = yield facility_models_1.default.findByIdAndDelete(id);
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus room",
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
    static UpdateFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            const { data } = req.body;
            // Validasi status sesuai enum
            if (!code) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Code Tidak ada",
                    success: false,
                });
            }
            try {
                const updatedRoom = yield facility_models_1.default.findOneAndUpdate({ code: code, isDeleted: false }, data, { new: true, runValidators: true });
                if (!updatedRoom) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Facility tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil update facility",
                    data: updatedRoom,
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
    static UpdateFacilityStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status harus diisi",
                });
            }
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { status }, { new: true, runValidators: true });
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
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Server error",
                });
            }
        });
    }
    static AddImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { image } = req.body;
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { image }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Main image updated successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static AddImageIRepair(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { image_irepair } = req.body;
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { image_IRepair: image_irepair }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "image invoice repair updated successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static AddImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { images } = req.body;
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { $push: { images } }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Image added to gallery successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static DeletedImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { images } = req.body; // isi dengan URL yang mau dihapus
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { $pull: { images } }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Image removed from gallery successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    // Sub Data
    static GetCodeRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield facility_models_1.default.find({ isDeleted: false }, // filter
                { code: 1 } // projection: ambil hanya `code`, sembunyikan `_id`
                );
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: rooms,
                    success: true
                });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Internal Server Error",
                    success: false
                });
            }
        });
    }
}
exports.FacilityControllers = FacilityControllers;
