
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tv,
  Gamepad2,
  Gift,
  LayoutGrid,
} from "lucide-react";

import "./CategoryDropdown.css";

const categoryGroups = [
  {
    name: "Mobile Phones",
    icon: Smartphone,
    items: [
      { label: "Smartphones", id: "smartphones" },
      { label: "Feature Phones", id: "feature-phones" },
      { label: "Phone Accessories", id: "phone-accessories" },
    ],
  },
  {
    name: "Laptops & Computers",
    icon: Laptop,
    items: [
      { label: "Laptops", id: "laptops" },
      { label: "Desktop PCs", id: "desktops" },
      { label: "Monitors", id: "monitors" },
      { label: "Computer Accessories", id: "computer-accessories" },
    ],
  },
  {
    name: "Audio",
    icon: Headphones,
    items: [
      { label: "Headphones", id: "headphones" },
      { label: "Earbuds", id: "earbuds" },
      { label: "Speakers", id: "speakers" },
    ],
  },
  {
    name: "Smart Watches",
    icon: Watch,
    items: [
      { label: "Smart Watches", id: "smartwatches" },
      { label: "Fitness Trackers", id: "fitness-trackers" },
    ],
  },
  {
    name: "TV & Home Electronics",
    icon: Tv,
    items: [
      { label: "Smart TVs", id: "televisions" },
      { label: "Home Appliances", id: "home-appliances" },
    ],
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    items: [
      { label: "Gaming Consoles", id: "gaming-consoles" },
      { label: "Gaming Accessories", id: "gaming-accessories" },
    ],
  },
  {
    name: "Gifts",
    icon: Gift,
    items: [
      { label: "Gift Bundles", id: "gifts" },
    ],
  },
];

function CategoryDropdown({ value = "all", onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);

  const allItems = categoryGroups.flatMap(
    (group) => group.items
  );

  const selectedItem = allItems.find(
    (item) => item.id === value
  );

  const selectedLabel = selectedItem
    ? selectedItem.label
    : "All Products";

  const handleSelect = (id) => {
    onChange(id);
    setIsOpen(false);
  };

  const toggleGroup = (name) => {
    setExpandedGroup((previous) =>
      previous === name ? null : name
    );
  };

  return (
    <div className="em-category-dropdown">
      {/* CATEGORY SELECT BUTTON */}
      <button
        type="button"
        className="em-category-trigger"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label="Select product category"
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={17} />
      </button>

      {/* EXPANDABLE DROPDOWN */}
      {isOpen && (
        <div className="em-category-menu">
          <button
            type="button"
            className="em-category-all"
            onClick={() => handleSelect("all")}
          >
            <LayoutGrid size={18} />
            <span>All Products</span>
          </button>

          {categoryGroups.map((group) => {
            const Icon = group.icon;
            const expanded = expandedGroup === group.name;

            return (
              <div
                className="em-category-section"
                key={group.name}
              >
                <button
                  type="button"
                  className="em-category-group"
                  onClick={() => toggleGroup(group.name)}
                  aria-expanded={expanded}
                >
                  <Icon size={18} />
                  <span>{group.name}</span>

                  {expanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {expanded && (
                  <div className="em-category-children">
                    {group.items.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={
                          value === item.id ? "active" : ""
                        }
                        onClick={() => handleSelect(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
