
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "./Hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero-section">

      {/* VIDEO BACKGROUND */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-products.jpg"
        aria-hidden="true"
      >
        <source
          src="/videos/electromart-hero.mp4"
          type="video/mp4"
        />
      </video>

      {/* DARK OVERLAY */}
      <div className="hero-overlay" />

      {/* HERO CONTENT */}
      <div className="hero-content">

        <span className="hero-eyebrow">
          <ShieldCheck size={16} />
          GENUINE TECH · LOCAL WARRANTY
        </span>

        <h1>
          Upgrade Your Tech.
          <br />
          <em>Elevate Your Life.</em>
        </h1>

        <p>
          Discover smartphones, smartwatches, audio
          and more — handpicked tech, delivered
          across Sri Lanka.
        </p>

        <div className="hero-cta">
          <Link to="/shop" className="btn btn-primary">
            Shop collection
            <ArrowUpRight size={18} />
          </Link>

          <Link to="/shop" className="btn btn-ghost">
            <Sparkles size={18} />
            Find my perfect tech
          </Link>
        </div>

        <div className="hero-trust">
          <span>✓ Trusted selection</span>
          <span>✓ Smart recommendations</span>
          <span>✓ Island-wide delivery</span>
        </div>

      </div>
    </section>
  );
}
