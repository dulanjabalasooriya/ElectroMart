
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { formatPrice } from "../data/products";
import "./Cart.css";

const CART_KEY = "electromart-cart";

function readCart() {
  try {
    const data = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function Cart() {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    const syncCart = () => setCart(readCart());

    window.addEventListener(
      "electromart-cart-updated",
      syncCart
    );

    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(
        "electromart-cart-updated",
        syncCart
      );

      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const saveCart = (updatedCart) => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);

    window.dispatchEvent(
      new Event("electromart-cart-updated")
    );
  };

  const changeQuantity = (id, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id !== id) return item;

      const maxQuantity = Math.max(
        0,
        Number(item.stock) || 0
      );

      const newQuantity = Math.max(
        1,
        Math.min(
          maxQuantity,
          Number(item.quantity || 1) + change
        )
      );

      return { ...item, quantity: newQuantity };
    });

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity || 1),
    0
  );

  const itemCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <div>
            <span className="cart-eyebrow">
              YOUR SHOPPING BAG
            </span>

            <h1>
              My <span>Shopping Cart</span>
            </h1>

            <p>
              Review your selected products before checkout.
            </p>
          </div>

          <Link to="/shop" className="cart-back-link">
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={40} />
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Discover exciting electronics and add your
              favorite products to your cart.
            </p>

            <Link to="/shop" className="cart-shop-btn">
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* LEFT: CART ITEMS */}
            <section className="cart-items">
              <div className="cart-items-heading">
                <h2>
                  Cart Items
                  <span>{itemCount}</span>
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="cart-clear"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => {
                const stock = Math.max(
                  0,
                  Number(item.stock) || 0
                );

                return (
                  <div className="cart-item" key={item.id}>

                    <Link
                      to={`/product/${item.id}`}
                      className="cart-item-image"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    </Link>

                    <div className="cart-item-info">
                      <span className="cart-item-brand">
                        {item.brand}
                      </span>

                      <Link
                        to={`/product/${item.id}`}
                        className="cart-item-name"
                      >
                        {item.name}
                      </Link>

                      <p className="cart-item-stock">
                        {stock > 0
                          ? `${stock} available`
                          : "Out of stock"}
                      </p>

                      <div className="cart-item-actions">
                        <div className="cart-quantity">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={Number(item.quantity) <= 1}
                            onClick={() =>
                              changeQuantity(item.id, -1)
                            }
                          >
                            <Minus size={15} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            disabled={
                              stock <= 0 ||
                              Number(item.quantity) >= stock
                            }
                            onClick={() =>
                              changeQuantity(item.id, 1)
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <strong>
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </strong>

                      <small>
                        {formatPrice(item.price)} each
                      </small>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* RIGHT: ORDER SUMMARY */}
            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Items ({itemCount})</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="cart-summary-total">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

           <Link
  to="/checkout"
  className="cart-checkout-btn"
>
  Proceed to Checkout
  <ArrowRight size={19} />
</Link>

              <p className="cart-checkout-note">
                Checkout will be connected in the next step.
              </p>

              <div className="cart-summary-benefits">
                <p>
                  <ShieldCheck size={18} />
                  Secure checkout planned
                </p>

                <p>
                  <Truck size={18} />
                  Delivery details at checkout
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
