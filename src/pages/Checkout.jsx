
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { formatPrice } from "../data/products";
import "./Checkout.css";

const CART_KEY = "electromart-cart";
const ORDERS_KEY = "electromart-orders";

function readCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  district: "",
  postalCode: "",
  notes: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const [cart] = useState(readCart);
  const [form, setForm] = useState(initialForm);
  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity || 0),
    0
  );

  const itemCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };



const handlePlaceOrder = async (event) => {
  event.preventDefault();
  if (placing) return;

  setError("");

  if (payment === "payhere") {
    setError(
      "PayHere payment is not connected yet. " +
      "Please select Cash on Delivery."
    );
    return;
  }

  const latestCart = readCart();

  if (latestCart.length === 0) {
    setError("Your cart is empty.");
    return;
  }

  if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
    setError("Enter a valid 10-digit Sri Lankan phone number.");
    return;
  }

  setPlacing(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          paymentMethod: "Cash on Delivery",
          items: latestCart.map((item) => ({
            id: String(item.id),
            quantity: Number(item.quantity),
          })),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to place order."
      );
    }

    // Save a local copy for the existing OrderSuccess page.
    // MongoDB is now the primary order record.
    const savedOrder = data.order;

    const localOrder = {
      id: data.orderId,
      createdAt: savedOrder.createdAt,
      customer: savedOrder.customer,
      items: savedOrder.items.map((item) => ({
        id: String(item.product),
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: savedOrder.subtotal,
      deliveryFee: savedOrder.deliveryFee,
      total: savedOrder.total,
      paymentMethod: savedOrder.paymentMethod,
      paymentStatus: savedOrder.paymentStatus,
      orderStatus: savedOrder.orderStatus,
      demo: true,
    };

    let previousOrders = [];

    try {
      const stored = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      );
      previousOrders = Array.isArray(stored) ? stored : [];
    } catch {
      previousOrders = [];
    }

    // MongoDB order already exists; local cache is optional.
    try {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([localOrder, ...previousOrders])
      );
    } catch (storageError) {
      console.warn("Could not cache order locally:", storageError);
    }

    localStorage.removeItem(CART_KEY);

    window.dispatchEvent(
      new Event("electromart-cart-updated")
    );

    navigate(
      `/order-success?orderId=${encodeURIComponent(data.orderId)}`,
      { replace: true }
    );
  } catch (error) {
    setError(
      error.message || "Unable to place order."
    );
  } finally {
    setPlacing(false);
  }
};


if (cart.length === 0) {
  return (
    <main className="checkout-page">
      <div className="checkout-empty">
        <ShoppingBag size={48} />

        <h1>Your cart is empty</h1>

        <p>
          Add products before proceeding to checkout.
        </p>

        <Link to="/shop">
          Return to Shop
        </Link>
      </div>
    </main>
  );
}

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <Link to="/cart" className="checkout-back">
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <div className="checkout-heading">
          <span>SECURE CHECKOUT · DEMO</span>
          <h1>
            Complete Your <em>Order</em>
          </h1>
          <p>
            Enter your delivery details to place a
            sample ElectroMart order.
          </p>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >
          <div className="checkout-main">
            <section className="checkout-panel">
              <h2>
                <MapPin size={22} />
                Delivery Information
              </h2>

              <div className="checkout-fields">
                <label className="checkout-field">
                  Full Name *
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="checkout-field">
                  Email *
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="checkout-field">
                  Phone Number *
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0771234567"
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="checkout-field">
                  City / Town *
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Colombo"
                    required
                  />
                </label>

                <label className="checkout-field checkout-wide">
                  Delivery Address *
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    autoComplete="street-address"
                    required
                  />
                </label>

                <label className="checkout-field">
                  District *
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Colombo District"
                    required
                  />
                </label>

                <label className="checkout-field">
                  Postal Code
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </label>

                <label className="checkout-field checkout-wide">
                  Delivery Notes
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Optional delivery instructions"
                    rows={3}
                  />
                </label>
              </div>
            </section>


<section className="checkout-panel">
  <h2>
    <ShieldCheck size={22} />
    Payment Method
  </h2>

  <div className="checkout-payment-options">

    <label className="checkout-payment">
      <input
        type="radio"
        name="payment"
        value="cod"
        checked={payment === "cod"}
        onChange={() => setPayment("cod")}
      />

      <div>
        <strong>Cash on Delivery</strong>
        <p>
          Pay when your order is delivered.
        </p>
      </div>
    </label>

    <label className="checkout-payment">
      <input
        type="radio"
        name="payment"
        value="payhere"
        checked={payment === "payhere"}
        onChange={() => setPayment("payhere")}
      />

      <div>
        <strong>Online Payment — PayHere</strong>
        <p>
          Secure online card payment.
          Sandbox integration coming next.
        </p>
      </div>
    </label>

  </div>
</section>

          </div>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-products">
              {cart.map((item) => (
                <div
                  className="checkout-product"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <strong>{item.name}</strong>
                    <small>Qty: {item.quantity}</small>
                  </div>

                  <span>
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-row">
              <span>Items ({itemCount})</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Delivery</span>
              <span>To be confirmed</span>
            </div>

            <div className="checkout-summary-total">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <p className="checkout-delivery-note">
              Final delivery charges and the total
              payable will be confirmed separately.
            </p>

            {error && (
              <p className="checkout-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="checkout-place-btn"
              disabled={placing}
            >
              {placing ? "Placing Order..." : "Place Demo Order"}
              <ArrowRight size={18} />
            </button>

            <div className="checkout-benefits">
              <span>
                <Truck size={17} />
                Island-wide delivery
              </span>
              <span>
                <ShieldCheck size={17} />
                Demo order — no payment charged
              </span>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
