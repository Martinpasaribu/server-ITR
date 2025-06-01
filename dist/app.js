"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lead_routes_1 = __importDefault(require("./routes/lead_routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", "http://localhost:3001",
        "https://savoy-client.vercel.app", "https://www.clickusaha.com",
        "https://clickusaha.com"
    ],
    methods: ["POST", "GET", "PATCH", "DELETE", 'PUT', "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Server Startup!');
});
app.use('/api/v1/lead', lead_routes_1.default);
exports.default = app;
