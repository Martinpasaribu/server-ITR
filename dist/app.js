"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lead_routes_1 = __importDefault(require("./routes/lead_routes"));
const cors_1 = __importDefault(require("cors"));
const customer_routes_1 = __importDefault(require("./routes/customer_routes"));
const router_customer_1 = __importDefault(require("./User/route/router_customer"));
const router_auth_1 = __importDefault(require("./Auth/route/router_auth"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const room_routes_1 = __importDefault(require("./Room/routes/room_routes"));
const Management_Customer_1 = __importDefault(require("./Management_Customer"));
const Booking_1 = __importDefault(require("./Booking"));
const Facility_1 = __importDefault(require("./Facility"));
const Dashboard_1 = __importDefault(require("./Dashboard"));
const Report_1 = __importDefault(require("./Report"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", "http://localhost:3001", "https://admin-itr.vercel.app",
        "https://customer-itr.vercel.app", "https://www.clickusaha.com",
        "https://clickusaha.com"
    ],
    methods: ["POST", "GET", "PATCH", "DELETE", 'PUT', "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, cookie_parser_1.default)()); // <— ini wajib
app.use(express_1.default.json());
const MongoDBStoreKU = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoDBStoreKU({
    uri: `${process.env.MongoDB_cloud}`,
    collection: 'sessions'
});
store.on('error', function (error) {
    console.log(error);
});
// app.set('trust proxy', 1)
app.set('trust proxy', true);
app.use((0, express_session_1.default)({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        //  ==========  Development  ============
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 hari
    }
}));
app.get('/', (req, res) => {
    res.send('Welcome to the Server Startup!');
});
app.use('/api/v1/lead', lead_routes_1.default);
app.use('/api/v1/customers', customer_routes_1.default);
app.use('/api/v1/booking', Booking_1.default);
app.use('/api/v1/report', Report_1.default);
app.use('/api/v1/dashboard', Dashboard_1.default);
app.use('/api/v1/facility', Facility_1.default);
app.use('/api/v1/management-customer', Management_Customer_1.default);
app.use('/api/v1/user-admin', router_customer_1.default);
app.use('/api/v1/auth', router_auth_1.default);
app.use('/api/v1/room', room_routes_1.default);
exports.default = app;
