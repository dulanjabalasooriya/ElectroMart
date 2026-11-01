
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  Search,
  Star,
  RotateCcw,
  Check,
  ImageOff,
} from "lucide-react";

import { formatPrice } from "../data/products";

import CategoryDropdown from "../components/CategoryDropdown";
import "./Shop.css";
import { getProducts } from "../services/productService";

const MAX_PRICE = 350000;

// Read shopping cart
const readCart = () => {
  try {
    const value = JSON.parse(
      localStorage.getItem("electromart-cart") || "[]"
    );

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

// Read wishlist
const readWishlist = () => {
  try {
    const value = JSON.parse(
      localStorage.getItem("electromart-wishlist") || "[]"
    );

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function Shop() {
  const [params, setParams] = useSearchParams();

  // Category is controlled by the URL
  const selectedCategory = params.get("category") || "all";

  // Search and filters
  const [query, setQuery] = useState(
    params.get("search") || ""
  );

  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");

  // Wishlist and notification
  const [wishlist, setWishlist] = useState(readWishlist);
  const [notice, setNotice] = useState("");

  // Load products from MongoDB via the Express API
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await getProducts();
        if (active) setDbProducts(data);
      } catch (error) {
        if (active) setFetchError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => { active = false; };
  }, []);

  // Sync navbar search with Shop search
  useEffect(() => {
    setQuery(params.get("search") || "");
  }, [params]);

  // Filter and sort products
  const filtered = useMemo(() => {
    const result = dbProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const searchText = `
        ${product.name}
        ${product.brand}
        ${product.category}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        query.trim().toLowerCase()
      );

      const matchesPrice = product.price <= maxPrice;

      const matchesStock =
        !stockOnly || product.stock > 0;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice &&
        matchesStock
      );
    });

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "discount") {
      result.sort((a, b) => {
        const discountA =
          a.oldPrice > 0
            ? (a.oldPrice - a.price) / a.oldPrice
            : 0;

        const discountB =
          b.oldPrice > 0
            ? (b.oldPrice - b.price) / b.oldPrice
            : 0;

        return discountB - discountA;
      });
    }

    return result;
  }, [
    dbProducts,
    selectedCategory,
    query,
    maxPrice,
    stockOnly,
    sort,
  ]);

  // NEW: CategoryDropdown uses this function
  function changeCategory(category) {
    const updated = new URLSearchParams(params);

    if (category === "all") {
      updated.delete("category");
    } else {
      updated.set("category", category);
    }

    setParams(updated);
  }

  // Update search field and URL
  function handleSearch(value) {
    setQuery(value);

    const updated = new URLSearchParams(params);

    if (value.trim()) {
      updated.set("search", value);
    } else {
      updated.delete("search");
    }

    setParams(updated, { replace: true });
  }

  // Add item to cart
  function addToCart(product) {
    if (!product.stock) return;

    const cart = readCart();

    const found = cart.find(
      (item) => item.id === product.id
    );

    if (found) {
      if (found.quantity >= product.stock) {
        setNotice("Maximum sample stock reached");
        return;
      }

      found.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "electromart-cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("electromart-cart-updated")
    );

    setNotice(`${product.name} added to cart`);
  }

  // Save and remove wishlist products
  function toggleWishlist(product) {
    const next = wishlist.includes(product.id)
      ? wishlist.filter((id) => id !== product.id)
      : [...wishlist, product.id];

    setWishlist(next);

    localStorage.setItem(
      "electromart-wishlist",
      JSON.stringify(next)
    );

    window.dispatchEvent(
      new Event("electromart-wishlist-updated")
    );
  }

  // Reset all filters
  function resetFilters() {
    setParams({});
    setQuery("");
    setMaxPrice(MAX_PRICE);
    setStockOnly(false);
    setSort("featured");
    setNotice("");
  }

  return (
    <main className="em-shop">

      {/* SHOP HERO */}
      <section className="em-shop-intro">
        <div>
          <span className="em-eyebrow">
            ELECTROMART COLLECTION
          </span>

          <h1>Find your next upgrade.</h1>

          <p>
            Explore smart technology, useful accessories,
            and gift ideas — all in one place.
          </p>
        </div>

        <span
          className="em-shop-intro-glow"
          aria-hidden="true"
        >
          ✦
        </span>
      </section>

      {/* SHOP CONTENT */}
      <div className="em-shop-inner">

        {/* HEADING */}
        <div className="em-shop-topline">
          <div>
            <h2>Shop All Electronics</h2>
            <p>
              Discover products selected for every need
              and budget.
            </p>
          </div>

          <span>
            {filtered.length} products
          </span>
        </div>

        {/* FILTER BAR */}
        <div className="em-shop-toolbar">

          {/* SEARCH */}
          <label className="em-shop-search">
            <Search size={19} />

            <input
              type="search"
              value={query}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              placeholder="Search products, brands..."
              aria-label="Search shop products"
            />
          </label>

          {/* NEW EXPANDABLE CATEGORY DROPDOWN */}
          <CategoryDropdown
            value={selectedCategory}
            onChange={changeCategory}
          />

          {/* PRICE FILTER */}
          <label className="em-shop-price">
            <span>
              Max {formatPrice(maxPrice)}
            </span>

            <input
              type="range"
              aria-label="Maximum price"
              min="5000"
              max={MAX_PRICE}
              step="5000"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(Number(e.target.value))
              }
            />
          </label>

          {/* STOCK FILTER */}
          <label className="em-shop-stock">
            <input
              type="checkbox"
              checked={stockOnly}
              onChange={(e) =>
                setStockOnly(e.target.checked)
              }
            />

            In stock only
          </label>

          {/* SORT */}
          <select
            className="em-shop-sort"
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">
              Price: low to high
            </option>
            <option value="price-desc">
              Price: high to low
            </option>
            <option value="rating">
              Top rated
            </option>
            <option value="discount">
              Biggest discount
            </option>
          </select>

          {/* RESET */}
          <button
            type="button"
            className="em-reset"
            onClick={resetFilters}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {/* NOTIFICATION */}
        {notice && (
          <div
            className="em-shop-notice"
            role="status"
          >
            <Check size={17} />

            {notice}

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="em-shop-empty" role="status">Loading products...</div>
        ) : fetchError ? (
          <div className="em-shop-empty" role="alert">
            <h3>Could not load products</h3>
            <p>{fetchError}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="em-product-grid">

            {filtered.map((product) => {
              const discount =
                product.oldPrice > product.price
                  ? Math.round(
                      (1 - product.price / product.oldPrice) * 100
                    )
                  : 0;

              const saved = wishlist.includes(product.id);

              return (
                <article
                  className="em-product-card"
                  key={product.id}
                >

                  {/* PRODUCT IMAGE */}
                  <div className="em-product-image">

                    {discount > 0 && (
                      <span className="em-discount">
                        -{discount}%
                      </span>
                    )}

                    <button
                      type="button"
                      className={`em-heart ${
                        saved ? "saved" : ""
                      }`}
                      onClick={() =>
                        toggleWishlist(product)
                      }
                      aria-label={
                        saved
                          ? `Remove ${product.name} from wishlist`
                          : `Save ${product.name} to wishlist`
                      }
                      aria-pressed={saved}
                    >
                      <Heart
                        size={20}
                        fill={
                          saved
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

<Link
  to={`/product/${product.id}`}
  className="em-product-image-link"
  aria-label={`View details for ${product.name}`}
>
  <img
    src={product.image}
    alt={product.name}
    loading="lazy"
  />
</Link>

                  </div>

                  {/* PRODUCT INFORMATION */}
                  <div className="em-product-details">

                    <div className="em-product-meta">
                      <span>{product.brand}</span>

                      <span className="em-rating">
                        <Star
                          size={15}
                          fill="currentColor"
                        />
                        {product.rating}

                        <span className="em-review">
                          ({product.reviews})
                        </span>
                      </span>
                    </div>

<Link
  to={`/product/${product.id}`}
  className="em-product-link"
>
  <h3>{product.name}</h3>
</Link>
                    {/* PRICE AND CART */}
                    <div className="em-product-bottom">
                      <div>
                        <strong>
                          {formatPrice(product.price)}
                        </strong>

                        {product.oldPrice > product.price && (
                          <del>
                            {formatPrice(product.oldPrice)}
                          </del>
                        )}
                      </div>

                      <button
                        type="button"
                        className="em-cart-button"
                        onClick={() =>
                          addToCart(product)
                        }
                        disabled={!product.stock}
                        aria-label={`Add ${product.name} to cart`}
                        title={
                          product.stock
                            ? "Add to cart"
                            : "Out of stock"
                        }
                      >
                        <ShoppingCart size={21} />
                      </button>
                    </div>

                    {!product.stock && (
                      <span className="em-no-stock">
                        Out of stock
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (

          /* EMPTY STATE */
          <div className="em-shop-empty">
            <ImageOff size={34} />

            <h3>No products found</h3>

            <p>
              Try another category, search,
              or higher price.
            </p>

            <button
              type="button"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
