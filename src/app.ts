import express from 'express';
import cors from 'cors';
import UserRouter from './AdminUser/route/router_admin_user';
import AuthRouter from './Auth/route/router_auth';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import RoomRouter from './Room/routes/room_routes';
import CustomerManagementRoute from './Management_Customer';
import Booking from './Booking';
import Facility from './Facility';
import Dashboard from './Dashboard';
import Report from './Report';
import Admin from './AdminUser';
import Contact from './contact';


dotenv.config();

const app = express();

app.use(cors({

    origin: [
      
          "http://localhost:3000","http://localhost:3001","https://admin-itr.vercel.app",
          "https://customer-itr.vercel.app","https://adminbelwiskos.vercel.app","https://adminbelwiskostel.vercel.app",
          "https://customerbelwiskostel.vercel.app"


              
            ],

    methods: ["POST", "GET", "PATCH", "DELETE", 'PUT', "OPTIONS"],
    credentials: true,

    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(cookieParser()); // <— ini wajib

app.use(express.json());



 const MongoDBStoreKU = MongoDBStore(session);

 const store = new MongoDBStoreKU({
     uri: `${process.env.MongoDB_cloud as string}`, 
     collection: 'sessions' 
 });     

 store.on('error', function(error) {
    console.log(error);
});

// app.set('trust proxy', 1)
app.set('trust proxy', true);


app.use(session({
    secret: process.env.SESS_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {

        //  ==========  Development  ============

        // secure: false,
        // httpOnly: true,      
        // maxAge: 1000 * 60 * 60 * 24, // 1 hari

        // httpOnly: true,
        // secure: false,  // localhost: tidak pakai https
        // sameSite: "lax", // Safari suka dengan lax untuk cross-port
        // maxAge: 1000 * 60 * 60 * 24, // 1 hari

        httpOnly: true,        // wajib
        secure: true,          // harus true kalau pakai HTTPS di live
        sameSite: "none",      // wajib "none" untuk cross-site di HTTPS
        maxAge: 1000 * 60 * 60 * 24,

        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'none',
        // httpOnly: true, 
        // maxAge: 1000 * 60 * 60 * 24, 

}}));

declare module 'express-serve-static-core' {
interface Request {
    userId?: string; // Tambahkan properti userId
}
}

declare module 'express-session' {
    interface SessionData {
      cart?: {
        roomId: string;
        quantity: number;
        price: number;
      }[],
      deviceInfo? : {
        userAgent?: string;
        ipAddress?: string;
      },
      userId: string;
      night: string;
      refreshToken : string;
      date : {
        checkin : Date |string ;
        checkout : Date |string ;
      };
    }
  }

app.get('/', (req, res) => {
    res.send('Welcome to the Server Startup!');
});

app.use('/api/v1/booking'  , Booking )  ;
app.use('/api/v1/report'  , Report ) ;
app.use('/api/v1/contact', Contact );
app.use('/api/v1/dashboard', Dashboard );
app.use('/api/v1/facility' , Facility ) ;
app.use('/api/v1/management-customer', CustomerManagementRoute);
app.use('/api/v1/admin', Admin);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/room', RoomRouter);

export default app;
