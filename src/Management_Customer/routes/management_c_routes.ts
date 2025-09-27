import express, { Request, Response, NextFunction } from "express";
import { ManagementController } from "../controllers/management_c_controllers";
import { verifyAdmin } from "../../middleware/VerifyAdminId";


const CustomerRouter: express.Router = express.Router();




// semantic meaning


CustomerRouter.get("/", ManagementController.getCustomer)
CustomerRouter.post("/", verifyAdmin, ManagementController.Register)
CustomerRouter.patch("/status/:id", ManagementController.UpdateStatusBooking);
CustomerRouter.put("/:id", ManagementController.UpdateCustomer);
CustomerRouter.delete("/:_id/:room_id", ManagementController.DeletedCustomer);
CustomerRouter.patch("/update/:_id", ManagementController.UpdateCustomerClient);

export default CustomerRouter;
