
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import ReportModel from '../models/report_models';

export class ReportControllers {


        static async PostReport(req: any, res: any) {

            const { customer_key, report_type, broken_type, complain_des, broken_des, image } = req.body;

            try {
                // 1. Validasi input
                if (!report_type) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    message: `All fields report can't be empty`,
                    success: false,
                });
                }

                // 2. Create report
                const newReport = await ReportModel.create({
                    broken_des,
                    complain_des,
                    broken_type,
                    report_type,
                    customer_key,
                    image: image || "",   // langsung ambil dari req.body.image
                    status: true,
                });

                // 3. Response sukses
                return res.status(201).json({
                requestId: uuidv4(),
                data: newReport,
                message: "Successfully created report.",
                success: true,
                });
            } catch (error) {
                return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message,
                success: false,
                });
            }
        }


        static async GetReportCustomer (req : any , res:any)  {

            const {customer_id} = req.params

            try {

                const users = await ReportModel.find({ customer_key: customer_id,  isDeleted:false}).populate("customer_key").sort({ createdAt: -1 });;
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: users,
                    success: true,
                    message: 'success get data report customer'
                });
            
            } catch (error) {

                console.log(error);
                // Kirim hasil response
                    return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: (error as Error).message || "Internal Server Error",
                    success: false
                });

            }
        
        }

        static async GetReportAll(req: any, res: any) {
        try {
            const reports = await ReportModel.find({ isDeleted: false })
            .populate({
                path: "customer_key",
                populate: {
                path: "room_key",
                model: "Room", // pastikan nama model Room kamu sesuai
                },
            }).sort({ createdAt: -1 });;

            res.status(200).json({
            requestId: uuidv4(),
            data: reports,
            success: true,
            message: "success get all data report customer",
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
            requestId: uuidv4(),
            data: null,
            message: (error as Error).message || "Internal Server Error",
            success: false,
            });
        }
        }



        // ✅ Get Report by ID
        static async GetReportById(req: Request, res: Response) {
            try {
            const { id } = req.params;
            const report = await ReportModel.findById(id);

            if (!report) {
                return res.status(404).json({
                requestId: uuidv4(),
                message: "Report not found",
                success: false,
                });
            }

            return res.status(200).json({
                requestId: uuidv4(),
                data: report,
                success: true,
            });
            } catch (error) {
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message,
                success: false,
            });
            }
        }

        // ✅ Update Report
        static async UpdateReport(req: Request, res: Response) {
            try {
            const { id } = req.params;
            const updated = await ReportModel.findByIdAndUpdate(id, req.body, { new: true });

            if (!updated) {
                return res.status(404).json({
                requestId: uuidv4(),
                message: "Report not found",
                success: false,
                });
            }

            return res.status(200).json({
                requestId: uuidv4(),
                data: updated,
                message: "Report updated successfully",
                success: true,
            });
            } catch (error) {
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message,
                success: false,
            });
            }
        }

        // ✅ Delete Report
        static async DeleteReport(req: Request, res: Response) {
            try {
            const { id } = req.params;
            const deleted = await ReportModel.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({
                requestId: uuidv4(),
                message: "Report not found",
                success: false,
                });
            }

            return res.status(200).json({
                requestId: uuidv4(),
                data: deleted,
                message: "Report deleted successfully",
                success: true,
            });
            } catch (error) {
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message,
                success: false,
            });
            }
        }


}