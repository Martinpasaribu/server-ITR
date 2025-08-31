"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_user_1 = require("../controller/controller_user");
const UserRouter = express_1.default.Router();
// semantic meaning
// User
UserRouter.get("/getUser", controller_user_1.UserController.getUser);
UserRouter.post("/register", controller_user_1.UserController.Register);
exports.default = UserRouter;
