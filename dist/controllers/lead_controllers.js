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
exports.LeadControllers = void 0;
const uuid_1 = require("uuid");
const lead_models_1 = __importDefault(require("../models/lead_models"));
class LeadControllers {
    static PostLead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, message, phone } = req.body;
            try {
                if (!email || !name || !message || !phone) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `All Field can't be empty`,
                    });
                }
                const lead = yield lead_models_1.default.create({
                    name: name,
                    email: email,
                    phone: phone,
                    message: message
                });
                res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: lead,
                    message: "Successfully post lead.",
                    success: true
                });
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
    static GetLead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield lead_models_1.default.find({ isDeleted: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: users,
                    success: true
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
}
exports.LeadControllers = LeadControllers;
