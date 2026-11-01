
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "8.8.4.4"]);

function mongoLookup(hostname, options, callback) {
  resolver.resolve4(hostname, (error, addresses) => {
    if (error) {
      return callback(error);
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ElectroMart API",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    success: connected,
    message: connected
      ? "ElectroMart backend and MongoDB are connected!"
      : "MongoDB is not connected",
  });
});

// Connect MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    console.log("Connecting to MongoDB Atlas...");

await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 15000,
  lookup: mongoLookup,
});

    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `ElectroMart API running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
  console.error("MongoDB connection failed:", error.message);

  if (error.reason?.servers) {
    for (const [server, details] of error.reason.servers) {
      console.error("Server:", server);
      console.error(
        "Underlying error:",
        details.error?.message || "No specific error reported"
      );
    }
  }

  process.exit(1);
}
}

startServer();
