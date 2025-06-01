import express from 'express';

import { LeadControllers } from '../controllers/lead_controllers';

const LeadRoutes: express.Router = express.Router();


LeadRoutes.post('/create/lead', LeadControllers.PostLead );
LeadRoutes.get('/get/lead', LeadControllers.GetLead);

export default LeadRoutes;
