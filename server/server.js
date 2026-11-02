
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";

import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

// Use Google DNS for MongoDB Atlas SRV records
// on the local Windows development environment.
if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://electro-mart-gamma.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Keep the special DNS lookup for your Windows laptop.
const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "8.8.4.4"]);

function mongoLookup(hostname, options, callback) {
  resolver.resolve4(hostname, (error, addresses) => {
    if (error) return callback(error);

    if (!addresses?.length) {
      return callback(new Error("No DNS addresses found"));
    }

    if (options?.all) {
      return callback(
        null,
        addresses.map((address) => ({ address, family: 4 }))
      );
    }

    callback(null, addresses[0], 4);
  });
}

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  if (!connectionPromise) {
    const options = {
      serverSelectionTimeoutMS: 15000,
    };

    // Use the laptop-specific DNS workaround locally.
    // Allow Vercel to use its own DNS resolver.
    if (!process.env.VERCEL) {
      options.lookup = mongoLookup;
    }

    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, options)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}

// Connect before database-dependent requests.
app.use(async (req, res, next) => {
  if (req.path === "/") return next();

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database temporarily unavailable",
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ElectroMart API" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: mongoose.connection.readyState === 1,
    message: "ElectroMart API and MongoDB connected",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      console.log("MongoDB Atlas connected successfully!");

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`ElectroMart API running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    });
}

export default app;
