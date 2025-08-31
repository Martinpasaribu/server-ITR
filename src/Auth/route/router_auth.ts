import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controller/controller_auth";
import { refreshToken, refreshTokenCustomer, } from "../controller/refresh_tokens";

const AuthRouter: express.Router = express.Router();


// semantic meaning


// Auth

AuthRouter.get("/token", refreshToken);
AuthRouter.get("/token-customer", refreshTokenCustomer);
AuthRouter.get("/cek-refresh-token", AuthController.CheckRefreshToken);
AuthRouter.get("/tokens", AuthController.CheckRefreshTokenCustomer);
AuthRouter.post("/login", AuthController.Login);
AuthRouter.post("/login-customer", AuthController.LoginCustomer);
AuthRouter.delete("/logout", AuthController.Logout);
AuthRouter.delete("/logout-customer", AuthController.LogoutCustomer);
AuthRouter.get("/me", AuthController.Me);
AuthRouter.get("/me-customer", AuthController.MeCustomer);


export default AuthRouter;
