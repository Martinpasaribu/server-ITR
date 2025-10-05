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
exports.RoomServices = void 0;
const room_models_1 = __importDefault(require("../models/room_models"));
class RoomService {
    KeepRoomBooking(status, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newStatus;
                const StatusRoom = yield room_models_1.default.findOneAndUpdate({ _id, status: true }, { status: false });
                if (status === "C") {
                    if (!StatusRoom)
                        throw new Error("Room sudah di gunakan");
                    newStatus = false; // kamar dipakai
                }
                else if (status === "CL") {
                    newStatus = true; // kamar dilepas
                }
                else {
                    throw new Error("Status tidak valid");
                }
                const updatedRoom = yield room_models_1.default.findByIdAndUpdate(_id, { status: newStatus }, { new: true });
                if (!updatedRoom) {
                    throw new Error(`Room not found ${_id} (KeepRoomBooking)`); // lempar error, biar controller yang handle response
                }
                return updatedRoom;
            }
            catch (err) {
                console.error("Gagal update status kamar:", err);
                throw err;
            }
        });
    }
    AddCustomerToRoom(_id, customer_key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1️⃣ Cek apakah customer sudah terdaftar di room lain
                const existingRoom = yield room_models_1.default.findOne({ customer_key });
                if (existingRoom) {
                    // 2️⃣ Kosongkan data lama di room sebelumnya
                    yield room_models_1.default.findByIdAndUpdate(existingRoom._id, {
                        $set: {
                            customer_key: null,
                            status: true, // kembali available
                        },
                    });
                    console.log(`Customer sebelumnya dihapus dari room ${existingRoom._id}`);
                }
                // 3️⃣ Tambahkan customer ke room baru
                const updatedRoom = yield room_models_1.default.findOneAndUpdate({ _id, status: true }, {
                    $set: {
                        status: false, // room jadi tidak available
                        customer_key,
                    },
                }, { new: true });
                if (!updatedRoom) {
                    throw new Error(`Room tidak ditemukan atau sudah terisi: ${_id}`);
                }
                console.log(`Customer ${customer_key} berhasil ditambahkan ke room ${_id}`);
                return true;
            }
            catch (err) {
                console.error("Gagal menambahkan customer ke room:", err);
                throw err;
            }
        });
    }
    CekRoomAvailable(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RoomStatus = yield room_models_1.default.findOne({ _id, isDeleted: false });
                if (!RoomStatus) {
                    throw new Error(`Room not found ${_id} (CekRoomAvailable)`); // lempar error, biar controller yang handle response
                }
                return RoomStatus.status;
            }
            catch (err) {
                console.error("Gagal cek status kamar:", err);
                throw err;
            }
        });
    }
    CekRoomAvailableOnUse(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RoomStatus = yield room_models_1.default.findOne({ _id: _id, status: true, isDeleted: false });
                if (!RoomStatus) {
                    throw new Error(`Room not found ${_id} (CekRoomAvailableOnUse)`); // lempar error, biar controller yang handle response
                }
                return true;
            }
            catch (err) {
                console.error("Gagal cek status kamar:", err);
                throw err;
            }
        });
    }
    UpdateStatusRoom(status, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const StatusRoom = yield room_models_1.default.findByIdAndUpdate(_id, { status: false });
                let newStatus;
                if (status === "M" || status === "P") {
                    if (!StatusRoom)
                        throw new Error("Room sudah di gunakan");
                    newStatus = false; // kamar dipakai
                }
                else if (status === "K") {
                    newStatus = true; // kamar dilepas
                }
                else {
                    throw new Error("Status tidak valid");
                }
                const updatedRoom = yield room_models_1.default.findByIdAndUpdate(_id, { status: newStatus }, { new: true });
                if (!updatedRoom) {
                    throw new Error(`Room not found ${_id} (UpdateStatusRoom)`); // lempar error, biar controller yang handle response
                }
                return updatedRoom;
            }
            catch (err) {
                console.error("Gagal update status kamar:", err);
                throw err;
            }
        });
    }
}
exports.RoomServices = new RoomService();
