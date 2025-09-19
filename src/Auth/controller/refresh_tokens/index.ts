
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import UserModel from '../../../AdminUser/models/models_admin_user';
import CustomerModel from '../../../Management_Customer/models/management_cmodels';
import AdminUserModel from '../../../AdminUser/models/models_admin_user';

dotenv.config();


export  const refreshToken = async (req : any, res : any) => {
    try {
        console.log("Cookies:", req.cookies);
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "Session cookies empty" });
        }

        // Cari user berdasarkan refresh token
        const user = await AdminUserModel.findOne({ refresh_token: refreshToken });

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Verifikasi refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any) => {
            if (err) {
                return res.status(403).json({ message: "Refresh token not verified" });
            }

            // Buat access token baru
            const userId = user._id;
            const name = user.username;
            const email = user.email;

            const accessToken = jwt.sign(
                { userId, name, email },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "15m" } // **Diperpanjang menjadi 5 menit**
            );


            return res.json({ accessToken });
        });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export  const refreshTokenCustomer = async (req : any, res : any) => {
    try {
        console.log("Cookies:", req.cookies);
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "Session cookies empty" });
        }

        // Cari user berdasarkan refresh token
        const user = await CustomerModel.findOne({ refresh_token: refreshToken });

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Verifikasi refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any) => {
            if (err) {
                return res.status(403).json({ message: "Refresh token not verified" });
            }

            // Buat access token baru
            const userId = user._id;
            const name = user.username;
            const email = user.email;

            const accessToken = jwt.sign(
                { userId, name, email },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "15m" } // **Diperpanjang menjadi 5 menit**
            );


            return res.json({ accessToken });
        });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

