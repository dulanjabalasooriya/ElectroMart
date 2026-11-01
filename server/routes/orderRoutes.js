
import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const router = express.Router();

// POST /api/orders
router.post("/", async (req, res) => {
  const { customer, items, paymentMethod } = req.body;

  if (paymentMethod !== "Cash on Delivery") {
    return res.status(400).json({
      success: false,
      message: "Only Cash on Delivery demo orders are supported.",
    });
  }

  const required = [
    "fullName",
    "email",
    "phone",
    "address",
    "city",
    "district",
  ];

  if (
    !customer ||
    required.some(
      (field) =>
        typeof customer[field] !== "string" ||
        !customer[field].trim()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required delivery fields.",
    });
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    !/^0\d{9}$/.test(customer.phone.replace(/\s/g, ""))
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email and phone number.",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Your cart is empty.",
    });
  }

  // Validate IDs and quantities before beginning a transaction.
  const quantities = new Map();

  for (const item of items) {
    const productId = String(item.id || "");

    if (
      !mongoose.isValidObjectId(productId) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity.",
      });
    }

    quantities.set(
      productId,
      (quantities.get(productId) || 0) + item.quantity
    );
  }

  try {
    let savedOrder;

    // Orders and inventory updates succeed or fail together.
    await mongoose.connection.transaction(async (session) => {
      const orderItems = [];
      let subtotal = 0;

      for (const [productId, quantity] of quantities) {
        const product = await Product.findById(productId)
          .session(session);

        if (!product) {
          throw new Error("A product in your cart no longer exists.");
        }

        // Reserve stock safely using the database stock value.
        const result = await Product.updateOne(
          {
            _id: productId,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          { session }
        );

        if (result.modifiedCount !== 1) {
          throw new Error(
            `Not enough stock for ${product.name}.`
          );
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        });

        subtotal += product.price * quantity;
      }

      const [order] = await Order.create(
        [
          {
            customer: {
              fullName: customer.fullName.trim(),
              email: customer.email.trim(),
              phone: customer.phone.replace(/\s/g, ""),
              address: customer.address.trim(),
              city: customer.city.trim(),
              district: customer.district.trim(),
              postalCode: String(customer.postalCode || "").trim(),
              notes: String(customer.notes || "").trim(),
            },
            items: orderItems,
            subtotal,
            deliveryFee: null,
            total: null,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending",
            orderStatus: "Pending",
            demo: true,
          },
        ],
        { session }
      );

      savedOrder = order;
    });

    return res.status(201).json({
      success: true,
      message: "Demo order placed successfully!",
      orderId: savedOrder._id.toString(),
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error.message);

    const isStockError =
      error.message.includes("stock") ||
      error.message.includes("no longer exists");

    return res.status(isStockError ? 409 : 500).json({
      success: false,
      message: isStockError
        ? error.message
        : "Unable to place order. Please try again.",
    });
  }
});

export default router;
