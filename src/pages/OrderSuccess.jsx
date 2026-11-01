
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  PackageSearch,
  PackageCheck,
  Clock3,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from "lucide-react";

import "./OrderSuccess.css";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  let order = null;

  try {
    const orders = JSON.parse(
      localStorage.getItem("electromart-orders") || "[]"
    );

    order = Array.isArray(orders)
      ? orders.find((item) => String(item.id) === String(orderId))
      : null;
  } catch {
    order = null;
  }

  return (
    <main className="em-success-page">
      <div className="em-success-card">

        {order ? (
          <>
            <div className="em-success-icon">
              <CheckCircle2 size={54} strokeWidth={2.4} />
            </div>

            <span className="em-success-label">
              <Sparkles size={16} />
              ELECTROMART CHECKOUT
            </span>

            <h1>Order Placed Successfully!</h1>

            <p className="em-success-subtitle">
              Your ElectroMart demo order has been recorded.
              Thank you for shopping with us!
            </p>

            <div className="em-success-order">
              <span>YOUR ORDER ID</span>
              <strong>{order.id}</strong>

              <div className="em-success-status">
                <Clock3 size={16} />
                {order.orderStatus || "Pending"}
              </div>
            </div>

            <div className="em-success-info">
              <div className="em-success-info-box">
                <ShoppingBag size={25} />
                <strong>
                  {order.items?.length || 0} Products
                </strong>
                <span>Items in your order</span>
              </div>

              <div className="em-success-info-box">
                <PackageCheck size={25} />
                <strong>Order Received</strong>
                <span>Awaiting confirmation</span>
              </div>
            </div>

            <div className="em-success-alert">
              <ShieldCheck size={20} />
              <span>
                This is a demonstration order.
                No real payment has been charged
                or delivery arranged.
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="em-success-icon missing">
              <PackageSearch size={50} />
            </div>

            <h1>Order Not Found</h1>

            <p className="em-success-subtitle">
              We couldn't find this order
              in your current browser.
            </p>
          </>
        )}

        <div className="em-success-actions">
          <Link to="/shop" className="em-success-shop">
            <ShoppingBag size={19} />
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

          <Link to="/" className="em-success-home">
            Back to Home
          </Link>
        </div>

        <p className="em-success-footer">
          ✨ Thank you for choosing ElectroMart!
        </p>
      </div>
    </main>
  );
}
