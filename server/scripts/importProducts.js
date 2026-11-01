
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";

import Product from "../models/Product.js";
import { products } from "../../src/data/products.js";

dotenv.config();

// MongoDB DNS workaround for your network
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "8.8.4.4"]);

function mongoLookup(hostname, options, callback) {
  resolver.resolve4(hostname, (error, addresses) => {
    if (error) return callback(error);

    if (!addresses || addresses.length === 0) {
      return callback(
        new Error("No DNS addresses found")
      );
    }

    if (options?.all) {
      return callback(
        null,
        addresses.map((address) => ({
          address,
          family: 4,
        }))
      );
    }

    callback(null, addresses[0], 4);
  });
}

async function importProducts() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing from .env");
    }

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI, {
      lookup: mongoLookup,
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB connected!");

    // Import only missing products.
    // Do not overwrite existing product records.
    const operations = products.map(({ id, ...product }) => ({
      updateOne: {
        filter: {
          name: product.name,
          brand: product.brand,
          category: product.category,
        },
        update: {
          $setOnInsert: product,
        },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(operations);

    console.log("Import completed successfully!");
    console.log(`Products in source: ${products.length}`);
    console.log(`New products inserted: ${result.upsertedCount}`);

    const total = await Product.countDocuments();
    console.log(`Total products in MongoDB: ${total}`);

  } catch (error) {
    console.error("Import failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

importProducts();
