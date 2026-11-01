
import { useState } from "react";
import {
  PackageSearch,
  CheckCircle2,
  Circle,
  Truck
} from "lucide-react";
import "./TrackOrder.css";

const steps = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

// Demo data only
const demoOrder = {
  id: "EM-2026-00125",
  product: "Wireless Headphones",
  currentStep: 3,
  status: "Shipped"
};

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();

    const enteredId = orderId.trim().toUpperCase();

    if (enteredId === demoOrder.id) {
      setOrder(demoOrder);
      setError("");
    } else {
      setOrder(null);
      setError(
        "Demo order not found. Try EM-2026-00125."
      );
    }
  };

  return (
    <section className="tracking-section" id="track-order">
      <div className="tracking-container">
        <div className="tracking-title">
          <PackageSearch size={32} />

          <h2>Track Your Order</h2>
          <p>
            Enter your ElectroMart order number to
            view delivery progress.
          </p>
        </div>

        <form
          className="tracking-form"
          onSubmit={handleTrack}
        >
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            aria-label="Order ID"
            required
          />

          <button type="submit">
            <PackageSearch size={18} />
            Track Order
          </button>
        </form>

        <p className="tracking-demo">
          Demo Order ID: <strong>EM-2026-00125</strong>
        </p>

        {error && (
          <p className="tracking-error" role="alert">
            {error}
          </p>
        )}

        {order && (
          <div className="tracking-result">
            <div className="tracking-order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p>{order.product}</p>
              </div>

              <span className="tracking-status">
                <Truck size={16} />
                {order.status}
              </span>
            </div>

            <div className="tracking-timeline">
              {steps.map((step, index) => {
                const completed =
                  index <= order.currentStep;

                return (
                  <div
                    className={`tracking-step ${
                      completed ? "completed" : ""
                    }`}
                    key={step}
                  >
                    {completed ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Circle size={24} />
                    )}

                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrackOrder;
