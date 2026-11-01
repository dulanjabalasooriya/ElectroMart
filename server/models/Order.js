
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      postalCode: { type: String, default: "" },
      notes: { type: String, default: "" },
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: { type: Number, default: null },
    total: { type: Number, default: null },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery"],
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    demo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
