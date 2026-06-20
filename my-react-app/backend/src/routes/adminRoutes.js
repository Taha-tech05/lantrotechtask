import express from 'express';
import {
  updateIdeaStatus, getEngagementMetrics, getTrendingIdeas, getAllUsers,
} from '../controllers/adminController.js';
import {
  scoreIdeaFeasibility, clusterIdeaThemes, suggestResources, getAllInsights,
} from '../controllers/insightController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('ADMIN')); // every route below is admin-only

router.patch('/ideas/:id/status', updateIdeaStatus);
router.get('/metrics', getEngagementMetrics);
router.get('/trending', getTrendingIdeas);
router.get('/users', getAllUsers);

router.post('/insights/feasibility/:id', scoreIdeaFeasibility);
router.post('/insights/clusters', clusterIdeaThemes);
router.post('/insights/resources/:id', suggestResources);
router.get('/insights', getAllInsights);

export default router;