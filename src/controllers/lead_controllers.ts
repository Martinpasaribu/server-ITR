
import { v4 as uuidv4 } from 'uuid'; 
import LeadModel from '../models/lead_models';

export class LeadControllers {

        static async  PostLead  (req : any , res:any)  {

            const { email , name, message, phone } = req.body;

            try {

                if( !email || !name || !message ||!phone){
                    return  res.status(400).json({
                        requestId: uuidv4(), 
                        message: `All Field can't be empty`,
                    })
                }
                const lead = await LeadModel.create({
                    name: name,
                    email: email, 
                    phone: phone, 
                    message : message
                });


                res.status(201).json(
                    {
                        requestId: uuidv4(), 
                        data: lead,
                        message: "Successfully post lead.",
                        success: true
                    }
                );

            } catch (error) {
                res.status(400).json(
                    {
                        requestId: uuidv4(), 
                        data: null,
                        message:  (error as Error).message,
                        success: false
                    }
                );
            }
        
        }

        static async  GetLead  (req : any , res:any)  {

            try {

                const users = await LeadModel.find({isDeleted:false});
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: users,
                    success: true
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


}