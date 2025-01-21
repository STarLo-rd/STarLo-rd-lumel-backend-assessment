import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { loadCSVData } from "../services/dataService"
import { getTopProducts, getTopProductsByCategory, getTopProductsByRegion } from "../services/analyticsService"

export const handleLoadData = async (req: Request, res: Response) => {
  try {
    const filePath = req.body.filePath || process.env.DEFAULT_CSV_PATH;
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    const stats = await loadCSVData(filePath);
    res.json({
      message: 'Data loading completed',
      stats: {
        recordsProcessed: stats.recordsProcessed,
        errorCount: stats.errors.length
      }
    });
  } catch (error) {
    logger.error('Error loading data:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
};

export const handleGetTopProducts = async (req: Request, res: Response) => {
  try {
    const { limit = '10', startDate, endDate } = req.query;
    const topProducts = await getTopProducts({
      limit: parseInt(limit as string),
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json(topProducts);
  } catch (error) {
    logger.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
};

export const handleGetTopProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { limit = '10', category, startDate, endDate } = req.query;
    const topProducts = await getTopProductsByCategory({
      limit: parseInt(limit as string),
      category: category as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json(topProducts);
  } catch (error) {
    logger.error('Error fetching top products by category:', error);
    res.status(500).json({ error: 'Failed to fetch top products by category' });
  }
};

export const handleGetTopProductsByRegion = async (req: Request, res: Response) => {
  try {
    const { limit = '10', region, startDate, endDate } = req.query;
    const topProducts = await getTopProductsByRegion({
      limit: parseInt(limit as string),
      region: region as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json(topProducts);
  } catch (error) {
    logger.error('Error fetching top products by region:', error);
    res.status(500).json({ error: 'Failed to fetch top products by region' });
  }
};