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
exports.DashboardControllers = void 0;
const uuid_1 = require("uuid");
const management_cmodels_1 = __importDefault(require("../../Management_Customer/models/management_cmodels"));
const facility_models_1 = __importDefault(require("../../Facility/models/facility_models"));
const booking_models_1 = __importDefault(require("../../Booking/models/booking_models"));
const room_models_1 = __importDefault(require("../../Room/models/room_models"));
const report_models_1 = __importDefault(require("../../Report/models/report_models"));
class DashboardControllers {
    static GetInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const amountUser = yield management_cmodels_1.default.countDocuments();
                const amountReport = yield report_models_1.default.countDocuments();
                const amountFacility = yield facility_models_1.default.countDocuments();
                const amountRoom = yield room_models_1.default.countDocuments();
                const amountBooking = yield booking_models_1.default.countDocuments();
                // 4. Response sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: {
                        amountUser,
                        amountReport,
                        amountFacility,
                        amountRoom,
                        amountBooking,
                    },
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
exports.DashboardControllers = DashboardControllers;
