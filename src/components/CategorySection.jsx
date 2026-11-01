
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./CategorySection.css";

const categories = [
  {
    name: "Smartphones",
    image: "/images/smartphones.jpg",
    category: "smartphones",
    description: "Explore the latest smartphones",
  },
  {
    name: "Laptops",
    image: "/images/laptops.jpg",
    category: "laptops",
    description: "Powerful laptops for every need",
  },
  {
    name: "Audio",
    image: "/images/audio.jpg",
    category: "audio",
    description: "Premium headphones and speakers",
  },
  {
    name: "Smart Watches",
    image: "/images/smartwatches.jpg",
    category: "smartwatches",
    description: "Smart technology on your wrist",
  },
];

function CategorySection() {
  return (
    <section className="category-section">
      <div className="category-heading">
        <div>
          <span className="section-label">
            EXPLORE OUR COLLECTION
          </span>
          <h2>Shop by Category</h2>
          <p>
            Discover the latest technology at ElectroMart.
          </p>
        </div>

        <Link to="/shop" className="view-all-link">
          View All Products <ArrowRight size={18} />
        </Link>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/shop?category=${category.category}`}
            className="category-card"
          >
            <div className="category-image">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
              />
            </div>

            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>

              <span className="category-arrow">
                <ArrowRight size={19} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
