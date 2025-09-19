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
exports.ReportControllers = void 0;
const uuid_1 = require("uuid");
const report_models_1 = __importDefault(require("../models/report_models"));
const Generate_code_1 = require("../../utils/Generate_code");
class ReportControllers {
    static PostReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_key, report_type, broken_type, complain_des, broken_des, image } = req.body;
            try {
                // 1. Validasi input
                if (!report_type) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `All fields report can't be empty`,
                        success: false,
                    });
                }
                const code = yield (0, Generate_code_1.generateReportCode)(report_type);
                // 2. Create report
                const newReport = yield report_models_1.default.create({
                    report_code: code,
                    broken_des,
                    complain_des,
                    broken_type,
                    report_type,
                    customer_key,
                    image: image || "", // langsung ambil dari req.body.image
                    status: true,
                });
                // 3. Response sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: newReport,
                    message: "Successfully created report.",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static GetReportCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_id } = req.params;
            try {
                const users = yield report_models_1.default.find({ customer_key: customer_id, isDeleted: false }).populate("customer_key").sort({ createdAt: -1 });
                ;
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: users,
                    success: true,
                    message: 'success get data report customer'
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
    static GetReportAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield report_models_1.default.find({ isDeleted: false })
                    .populate({
                    path: "customer_key",
                    populate: {
                        path: "room_key",
                        model: "Room", // pastikan nama model Room kamu sesuai
                    },
                }).sort({ createdAt: -1 });
                ;
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: reports,
                    success: true,
                    message: "success get all data report customer",
                });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Internal Server Error",
                    success: false,
                });
            }
        });
    }
    // ✅ Get Report by ID
    static GetReportById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const report = yield report_models_1.default.findById(id);
                if (!report) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Report not found",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: report,
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    // ✅ Update Report
    static UpdateReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { progress } = req.body;
                let progress_end = null;
                if (progress === "S" || progress === "T") {
                    progress_end = new Date();
                }
                const updated = yield report_models_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { progress_end }), { new: true });
                if (!updated) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Report not found",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: updated,
                    message: "Report updated successfully",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    // ✅ Delete Report
    static DeleteReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield report_models_1.default.findByIdAndDelete(id);
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Report not found",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: deleted,
                    message: "Report deleted successfully",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
}
exports.ReportControllers = ReportControllers;
