
import { useEffect, useState } from "react";
import {
  Menu, X, Search, UserRound, Heart,
  ShoppingCart, Truck, PlugZap, ChevronDown,
  ChevronRight, Smartphone, Laptop,
  Headphones, Watch, Tv, Gamepad2,
  Gift, ShieldCheck, Sparkles, PackageSearch
} from "lucide-react";

import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
const categories = [
  {
    name: "Mobile Phones",
    icon: Smartphone,
    subcategories: [
      "Smartphones",
      "Feature Phones",
      "Phone Accessories"
    ]
  },
  {
    name: "Laptops & Computers",
    icon: Laptop,
    subcategories: [
      "Laptops",
      "Desktop Computers",
      "Monitors",
      "Computer Accessories"
    ]
  },
  {
    name: "Audio",
    icon: Headphones,
    subcategories: [
      "Headphones",
      "Earbuds",
      "Bluetooth Speakers"
    ]
  },
  {
    name: "Smart Watches",
    icon: Watch,
    subcategories: [
      "Smart Watches",
      "Fitness Trackers"
    ]
  },
  {
    name: "TV & Home Electronics",
    icon: Tv,
    subcategories: [
      "Smart TVs",
      "Home Appliances"
    ]
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    subcategories: [
      "Gaming Consoles",
      "Gaming Accessories"
    ]
  },
  {
    name: "Gifts",
    icon: Gift,
    subcategories: [
      "Gifts for Him",
      "Gifts for Her",
      "Birthday Gifts",
      "Gift Bundles"
    ]
  }
];

function getCartCount() {
  try {
    const cart = JSON.parse(
      localStorage.getItem("electromart-cart") || "[]"
    );

    if (!Array.isArray(cart)) return 0;

    return cart.reduce(
      (total, item) =>
        total + (Number(item.quantity) || 0),
      0
    );
  } catch {
    return 0;
  }
}


function Navbar() {

const navigate = useNavigate();

const [sidebarOpen, setSidebarOpen] = useState(false);
const [activeCategory, setActiveCategory] = useState(null);
const [search, setSearch] = useState("");

const [cartCount, setCartCount] = useState(getCartCount);

useEffect(() => {
  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  window.addEventListener(
    "electromart-cart-updated",
    updateCartCount
  );

  window.addEventListener("storage", updateCartCount);

  return () => {
    window.removeEventListener(
      "electromart-cart-updated",
      updateCartCount
    );

    window.removeEventListener(
      "storage",
      updateCartCount
    );
  };
}, []);

  const toggleCategory = (name) => {
    setActiveCategory((previous) =>
      previous === name ? null : name
    );
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

const handleSearch = (e) => {
  e.preventDefault();

  if (!search.trim()) return;

  navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
};

const categoryRoutes = {
  "Smartphones": "smartphones",
  "Feature Phones": "feature-phones",
  "Phone Accessories": "phone-accessories",
  "Laptops": "laptops",
  "Desktop Computers": "desktops",
  "Monitors": "monitors",
  "Computer Accessories": "computer-accessories",
  "Headphones": "headphones",
  "Earbuds": "earbuds",
  "Bluetooth Speakers": "speakers",
  "Smart Watches": "smartwatches",
  "Fitness Trackers": "fitness-trackers",
  "Smart TVs": "televisions",
  "Home Appliances": "home-appliances",
  "Gaming Consoles": "gaming-consoles",
  "Gaming Accessories": "gaming-accessories",
  "Gift Bundles": "gifts"
};

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <Truck size={18} />
        <span>
          Island-wide delivery across Sri Lanka ·
          Discover the latest technology
        </span>
<NavLink to="/shop">Shop deals</NavLink>
      </div>

      {/* MAIN NAVBAR */}
      <header className="main-navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="nav-icon-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open categories"
            aria-expanded={sidebarOpen}
          >
            <Menu size={27} />
          </button>

<NavLink to="/" className="brand">
            <span className="brand-logo">
              <PlugZap size={25} />
            </span>

            <span className="brand-name">
              Electro
              <span className="brand-blue">Mart</span>
            </span>
          </NavLink>
        </div>

        {/* SEARCH */}
        <form
          className="search-box"
          onSubmit={handleSearch}
        >
          <Search size={21} />

          <input
            type="search"
            placeholder="Search phones, laptops, audio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />

          <button type="submit" className="search-submit">
            Search
          </button>
        </form>

        {/* CUSTOMER ICONS */}
        <div className="navbar-actions">
          <button
            type="button"
            className="nav-icon-btn"
            aria-label="My account"
          >
            <UserRound size={24} />
          </button>

          <button
            type="button"
            className="nav-icon-btn"
            aria-label="Wishlist"
          >
            <Heart size={25} />
          </button>

<NavLink
  to="/cart"
  className="nav-icon-btn cart-button"
  aria-label={`View shopping cart (${cartCount} items)`}
>
  <ShoppingCart size={26} />

  {cartCount > 0 && (
    <span className="cart-badge">
      {cartCount}
    </span>
  )}
</NavLink>

        </div>
      </header>

      {/* SECONDARY NAVBAR */}
     
<nav
  className="secondary-navbar"
  aria-label="Main navigation"
>
  <NavLink to="/shop">
    <ShoppingCart size={17} />
    <span>Shop</span>
  </NavLink>

  <NavLink to="/gifts">
    <Gift size={17} />
    <span>Gifts</span>
  </NavLink>

  <NavLink to="/smart-finder">
    <Sparkles size={17} />
    <span>Smart Finder</span>
  </NavLink>

  <NavLink to="/track-order">
    <PackageSearch size={17} />
    <span>Track Order</span>
  </NavLink>

  <NavLink to="/warranty">
    <ShieldCheck size={17} />
    <span>Warranty</span>
  </NavLink>
</nav>

      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* CATEGORY SIDEBAR */}
      <aside
        className={`category-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="sidebar-header">
          <h2>All Categories</h2>

          <button
            type="button"
            className="nav-icon-btn"
            onClick={closeSidebar}
            aria-label="Close categories"
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-content">
          <p className="sidebar-subtitle">
            SHOP BY CATEGORY
          </p>

          {categories.map((category) => {
            const Icon = category.icon;
            const isActive =
              activeCategory === category.name;

            return (
              <div
                className="category-group"
                key={category.name}
              >
                <button
                  type="button"
                  className={`category-button ${
                    isActive ? "category-active" : ""
                  }`}
                  onClick={() =>
                    toggleCategory(category.name)
                  }
                  aria-expanded={isActive}
                >
                  <Icon size={20} />
                  <span>{category.name}</span>

                  {isActive
                    ? <ChevronDown size={18} />
                    : <ChevronRight size={18} />}
                </button>

                {isActive && (
                  <div className="subcategory-menu">
                    {category.subcategories.map((sub) => (
                     
<NavLink
  key={sub}
  to={`/shop?category=${categoryRoutes[sub] || "all"}`}
  onClick={closeSidebar}
>
  {sub}
</NavLink>

                      
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

export default Navbar;
