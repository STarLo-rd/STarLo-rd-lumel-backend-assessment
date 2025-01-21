import { Router } from 'express';
import {
  handleLoadData,
  handleGetTopProducts,
  handleGetTopProductsByCategory,
  handleGetTopProductsByRegion
} from '../controllers/index';

const router = Router();

// Data management routes
router.post('/load-data', handleLoadData);

// Analytics routes
router.get('/analytics/top-products', handleGetTopProducts);
router.get('/analytics/top-products-by-category', handleGetTopProductsByCategory);
router.get('/analytics/top-products-by-region', handleGetTopProductsByRegion);

export default router;