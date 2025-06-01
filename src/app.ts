import express from 'express';
import LeadRoutes from './routes/lead_routes';
import cors from 'cors';

const app = express();


app.use(cors({

    origin:   [
      
                "http://localhost:3000","http://localhost:3001",
                "https://savoy-client.vercel.app",
              
              ],

    methods: ["POST", "GET", "PATCH", "DELETE", 'PUT', "OPTIONS"],
    credentials: true,

    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Server Savoy!');
});

app.use('/api/v1/lead', LeadRoutes);

export default app;
