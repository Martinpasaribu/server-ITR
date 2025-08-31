
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import CustomerModel from '../../Management_Customer/models/management_cmodels';
import FacilityModel from '../../Facility/models/facility_models';
import BookingModel from '../../Booking/models/booking_models';
import RoomModel from '../../Room/models/room_models';
import ReportModel from '../../Report/models/report_models';

export class DashboardControllers {


        static async GetInfo(req: any, res: any) {

            try {

                const amountUser = await CustomerModel.countDocuments();
                const amountReport = await ReportModel.countDocuments();
                const amountFacility = await FacilityModel.countDocuments();
                const amountRoom = await RoomModel.countDocuments();
                const amountBooking = await BookingModel.countDocuments();


                // 4. Response sukses
                return res.status(201).json({
                    requestId: uuidv4(),
                    data: {

                        amountUser,
                        amountReport,
                        amountFacility,
                        amountRoom,
                        amountBooking,
                        
                    },
                    message: "Successfully created facility.",
                    success: true,
                });

            } catch (error) {
                // 5. Tangkap error
                return res.status(500).json({
                    requestId: uuidv4(),
                    data: null,
                    message: (error as Error).message,
                    success: false,
                });
            }
        
        }

        static async DeleteFacility(req: Request, res: Response) {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                requestId: uuidv4(),
                message: "ID room tidak boleh kosong",
                success: false,
                });
            }

            try {
                const deleted = await FacilityModel.findByIdAndDelete(id);

                if (!deleted) {
                return res.status(404).json({
                    requestId: uuidv4(),
                    message: "Room tidak ditemukan",
                    success: false,
                });
                }

                return res.status(200).json({
                requestId: uuidv4(),
                message: "Berhasil menghapus room",
                success: true,
                });
            } catch (error: any) {
                return res.status(500).json({
                requestId: uuidv4(),
                message: error.message || "Terjadi kesalahan server",
                success: false,
                });
            }
        }

        static async GetCodeRoom(req: any, res: any) {
            try {
                const rooms = await FacilityModel.find(
                    { isDeleted: false }, // filter
                    { code: 1}   // projection: ambil hanya `code`, sembunyikan `_id`
                );

                res.status(200).json({
                    requestId: uuidv4(),
                    data: rooms,
                    success: true
                });

            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: (error as Error).message || "Internal Server Error",
                    success: false
                });
            }
        }

}