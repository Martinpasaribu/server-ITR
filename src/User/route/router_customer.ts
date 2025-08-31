import express, { Request, Response, NextFunction } from "express";
import { UserController } from "../controller/controller_user";


const UserRouter: express.Router = express.Router();




// semantic meaning

// User

UserRouter.get("/getUser", UserController.getUser)
UserRouter.post("/register", UserController.Register)




export default UserRouter;
