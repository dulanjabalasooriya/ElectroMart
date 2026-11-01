
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";

import { formatPrice } from "../data/products";
import { getProductById } from "../services/productService";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Load selected product from MongoDB
  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setQuantity(1);
      setMessage("");

      try {
        const data = await getProductById(id);

        if (active) {
          setProduct(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  // Add product to existing localStorage cart
  function addToCart() {
    if (!product || product.stock <= 0) return;

    let cart = [];

    try {
      const saved = JSON.parse(
        localStorage.getItem("electromart-cart") || "[]"
      );

      cart = Array.isArray(saved) ? saved : [];
    } catch {
      cart = [];
    }

    const existing = cart.find(
      (item) => String(item.id) === String(product.id)
    );

    const currentQuantity = existing?.quantity || 0;

    if (currentQuantity + quantity > product.stock) {
      setMessage("Not enough stock available.");
      return;
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem(
      "electromart-cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("electromart-cart-updated")
    );

    setMessage("Product added to cart successfully!");
  }

  if (loading) {
    return (
      <main className="pd-not-found">
        <h2>Loading product...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pd-not-found">
        <h2>Unable to load product</h2>
        <p>{error}</p>
        <Link to="/shop">Back to Shop</Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pd-not-found">
        <h2>Product not found</h2>
        <Link to="/shop">Back to Shop</Link>
      </main>
    );
  }

  return (
    <main className="pd-page">
      <div className="pd-container">

        <Link to="/shop" className="pd-back">
          <ArrowLeft size={18} />
          Back to Shop
        </Link>

        <div className="pd-layout">

          {/* PRODUCT IMAGE */}
          <div className="pd-image-card">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* PRODUCT DETAILS */}
          <div className="pd-information">
            <span className="pd-brand">
              {product.brand}
            </span>

            <h1>{product.name}</h1>

            <div className="pd-rating">
              <Star size={18} fill="currentColor" />
              <strong>{product.rating ?? 0}</strong>
              <span>
                ({product.reviews ?? 0} reviews)
              </span>
            </div>

            <div className="pd-prices">
              <strong>
                {formatPrice(product.price)}
              </strong>

              {product.oldPrice > product.price && (
                <del>
                  {formatPrice(product.oldPrice)}
                </del>
              )}
            </div>

            <div className="pd-stock">
              {product.stock > 0
                ? `In Stock — ${product.stock} available`
                : "Out of Stock"}
            </div>

            <p className="pd-description">
              {product.description ||
                `Discover ${product.name} at ElectroMart. Designed to offer excellent performance, reliability and everyday convenience.`}
            </p>

            <div className="pd-benefits">
              <div>
                <Truck size={20} />
                Island-wide Delivery
              </div>

              <div>
                <ShieldCheck size={20} />
                Warranty Information Available
              </div>
            </div>

            {/* QUANTITY */}
            <div className="pd-quantity-row">
              <span>Quantity</span>

              <div className="pd-quantity">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} />
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(product.stock, q + 1)
                    )
                  }
                  disabled={
                    product.stock <= 0 ||
                    quantity >= product.stock
                  }
                  aria-label="Increase quantity"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <div className="pd-actions">
              <button
                type="button"
                className="pd-add-cart"
                onClick={addToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

            {message && (
              <p className="pd-message" role="status">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
