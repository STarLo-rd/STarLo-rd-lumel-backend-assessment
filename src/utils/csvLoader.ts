import { parse } from 'csv-parse';
import fs from 'fs';
import { Product } from '../models/Product';
import { Customer } from '../models/Customer';
import { Order } from '../models/Order';

interface RawSalesData {
  'Order ID': string;
  'Product ID': string;
  'Customer ID': string;
  'Product Name': string;
  'Category': string;
  'Region': string;
  'Date of Sale': string;
  'Quantity Sold': string;
  'Unit Price': string;
  'Discount': string;
  'Shipping Cost': string;
  'Payment Method': string;
  'Customer Name': string;
  'Customer Email': string;
  'Customer Address': string;
}

export async function loadCSVData(filePath: string) {
  const records: RawSalesData[] = [];
  
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    records.push(record);
  }

  console.log(`Loaded ${records.length} records from CSV`);
  
  // Process in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await processBatch(batch);
    console.log(`Processed batch ${i / batchSize + 1}`);
  }
}

async function processBatch(records: RawSalesData[]) {
  for (const record of records) {
    try {
      // Upsert Product
      const product = await Product.findOneAndUpdate(
        { productId: record['Product ID'] },
        {
          productId: record['Product ID'],
          name: record['Product Name'],
          category: record['Category']
        },
        { upsert: true, new: true }
      );

      // Upsert Customer
      const customer = await Customer.findOneAndUpdate(
        { customerId: record['Customer ID'] },
        {
          customerId: record['Customer ID'],
          name: record['Customer Name'],
          email: record['Customer Email'],
          address: record['Customer Address']
        },
        { upsert: true, new: true }
      );

      // Create Order
      await Order.findOneAndUpdate(
        { orderId: record['Order ID'] },
        {
          orderId: record['Order ID'],
          productId: product._id,
          customerId: customer._id,
          region: record['Region'],
          saleDate: new Date(record['Date of Sale']),
          quantitySold: parseInt(record['Quantity Sold']),
          unitPrice: parseFloat(record['Unit Price']),
          discount: parseFloat(record['Discount']),
          shippingCost: parseFloat(record['Shipping Cost']),
          paymentMethod: record['Payment Method']
        },
        { upsert: true }
      );
    } catch (error) {
      console.error(`Error processing record ${record['Order ID']}:`, error);
    }
  }
}