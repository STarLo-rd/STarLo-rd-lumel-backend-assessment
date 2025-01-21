import { Order } from '../models/Order';
import { Product } from '../models/Product';

interface AnalyticsParams {
  limit: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  region?: string;
}

const createDateFilter = (startDate?: string, endDate?: string) => {
  const dateFilter: any = {};
  
  if (startDate || endDate) {
    dateFilter.saleDate = {};
    if (startDate) {
      dateFilter.saleDate.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.saleDate.$lte = new Date(endDate);
    }
  }

  return dateFilter;
};

export const getTopProducts = async ({ limit, startDate, endDate }: AnalyticsParams) => {
  const dateFilter = createDateFilter(startDate, endDate);

  return await Order.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$productId',
        totalQuantity: { $sum: '$quantitySold' }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        productId: '$product.productId',
        name: '$product.name',
        category: '$product.category',
        totalQuantity: 1
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
};

export const getTopProductsByCategory = async ({ limit, category, startDate, endDate }: AnalyticsParams) => {
  const dateFilter = createDateFilter(startDate, endDate);
  const matchStage: any = dateFilter;

  if (category) {
    const products = await Product.find({ category });
    const productIds = products.map(p => p._id);
    matchStage.productId = { $in: productIds };
  }

  return await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$productId',
        totalQuantity: { $sum: '$quantitySold' }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        productId: '$product.productId',
        name: '$product.name',
        category: '$product.category',
        totalQuantity: 1
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
};

export const getTopProductsByRegion = async ({ limit, region, startDate, endDate }: AnalyticsParams) => {
  const dateFilter = createDateFilter(startDate, endDate);
  const matchStage: any = dateFilter;

  if (region) {
    matchStage.region = region;
  }

  return await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          productId: '$productId',
          region: '$region'
        },
        totalQuantity: { $sum: '$quantitySold' }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id.productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        productId: '$product.productId',
        name: '$product.name',
        category: '$product.category',
        region: '$_id.region',
        totalQuantity: 1
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
};