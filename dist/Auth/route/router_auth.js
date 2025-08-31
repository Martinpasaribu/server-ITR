"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_auth_1 = require("../controller/controller_auth");
const refresh_tokens_1 = require("../controller/refresh_tokens");
const AuthRouter = express_1.default.Router();
// semantic meaning
// Auth
AuthRouter.get("/token", refresh_tokens_1.refreshToken);
AuthRouter.get("/token-customer", refresh_tokens_1.refreshTokenCustomer);
AuthRouter.get("/cek-refresh-token", controller_auth_1.AuthController.CheckRefreshToken);
AuthRouter.get("/tokens", controller_auth_1.AuthController.CheckRefreshTokenCustomer);
AuthRouter.post("/login", controller_auth_1.AuthController.Login);
AuthRouter.post("/login-customer", controller_auth_1.AuthController.LoginCustomer);
AuthRouter.delete("/logout", controller_auth_1.AuthController.Logout);
AuthRouter.delete("/logout-customer", controller_auth_1.AuthController.LogoutCustomer);
AuthRouter.get("/me", controller_auth_1.AuthController.Me);
AuthRouter.get("/me-customer", controller_auth_1.AuthController.MeCustomer);
exports.default = AuthRouter;
