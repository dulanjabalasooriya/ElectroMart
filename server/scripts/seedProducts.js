
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import Product from "../models/Product.js";

dotenv.config();

// DNS configuration for MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "8.8.4.4"]);

// Custom hostname lookup for MongoDB connections
function mongoLookup(hostname, options, callback) {
  resolver.resolve4(hostname, (error, addresses) => {
    if (error) {
      return callback(error);
    }

    if (!addresses || addresses.length === 0) {
      return callback(new Error("No IP addresses found"));
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

async function seedProducts() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI, {
      lookup: mongoLookup,
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB Atlas connected successfully!");

    const existingProduct = await Product.findOne({
      name: "Samsung Galaxy A17 5G",
    });

    if (existingProduct) {
      console.log("Sample product already exists.");
      return;
    }

    await Product.create({
      name: "Samsung Galaxy A17 5G",
      brand: "Samsung",
      category: "smartphones",
      price: 69900,
      oldPrice: 74900,
      rating: 4.5,
      reviews: 25,
      stock: 10,
      image: "/images/products/samsung-a17.png",
      description: "Sample smartphone for ElectroMart testing.",
    });

    console.log("Sample product created successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
