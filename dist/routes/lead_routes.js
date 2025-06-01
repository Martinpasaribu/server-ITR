"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lead_controllers_1 = require("../controllers/lead_controllers");
const LeadRoutes = express_1.default.Router();
LeadRoutes.post('/create/lead', lead_controllers_1.LeadControllers.PostLead);
LeadRoutes.get('/get/lead', lead_controllers_1.LeadControllers.GetLead);
exports.default = LeadRoutes;
