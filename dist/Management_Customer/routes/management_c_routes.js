"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const management_c_controllers_1 = require("../controllers/management_c_controllers");
const VerifyAdminId_1 = require("../../middleware/VerifyAdminId");
const CustomerRouter = express_1.default.Router();
// semantic meaning
CustomerRouter.get("/", management_c_controllers_1.ManagementController.getCustomer);
CustomerRouter.post("/", VerifyAdminId_1.verifyAdmin, management_c_controllers_1.ManagementController.Register);
CustomerRouter.patch("/status/:id", management_c_controllers_1.ManagementController.UpdateStatusBooking);
CustomerRouter.put("/:id", management_c_controllers_1.ManagementController.UpdateCustomer);
CustomerRouter.delete("/:_id/:room_id", management_c_controllers_1.ManagementController.DeletedCustomer);
CustomerRouter.patch("/update/:_id", management_c_controllers_1.ManagementController.UpdateCustomerClient);
exports.default = CustomerRouter;
