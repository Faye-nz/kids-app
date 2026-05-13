import { useState, useEffect } from "react";
import './App.css';

// ─── Data defined OUTSIDE component (fixes re-creation on every render) ───────
// Images replaced with emoji illustrations since assets aren't available here.
// Sound feedback replaced with visual + CSS animation feedback.

const CATEGORIES = {
  animals: {
    label: "Animals",
    emoji: "🐾",
    color: "#FF6B6B",
    bg: "#FFF0F0",
    items: [
      { id: "dog",   name: "Dog",   emoji: "🐶", sound: "/sounds/dog.mp3",   fact: "Dogs can hear 4x better than humans!" },
      { id: "cat",   name: "Cat",   emoji: "🐱", sound: "/sounds/cat.mp3",   fact: "Cats sleep up to 16 hours a day!" },
      { id: "lion",  name: "Lion",  emoji: "🦁", sound: "/sounds/lion.mp3",  fact: "A lion's roar can be heard 8km away!" },
      { id: "elephant", name: "Elephant", emoji: "🐘", sound: "/sounds/elephant.mp3", fact: "Elephants never forget!" },
      { id: "frog",  name: "Frog",  emoji: "🐸", sound: "/sounds/frog.mp3",  fact: "Frogs drink water through their skin!" },
    ],
  },
  colors: {
    label: "Colors",
    emoji: "🎨",
    color: "#845EF7",
    bg: "#F5F0FF",
    items: [
      { id: "red",    name: "Red",    emoji: "🔴", swatch: "#E63946", fact: "Red is the first color babies see!" },
      { id: "blue",   name: "Blue",   emoji: "🔵", swatch: "#1D6FA4", fact: "Blue is the world's favourite color!" },
      { id: "green",  name: "Green",  emoji: "🟢", swatch: "#2DC653", fact: "Green means go on traffic lights!" },
      { id: "yellow", name: "Yellow", emoji: "🟡", swatch: "#FFD60A", fact: "Yellow is the brightest warm color!" },
      { id: "orange", name: "Orange", emoji: "🟠", swatch: "#FF8C00", fact: "Orange was named after the fruit!" },
    ],
  },
  shapes: {
    label: "Shapes",
    emoji: "🔷",
    color: "#20C997",
    bg: "#F0FFF8",
    items: [
      { id: "circle",   name: "Circle",   emoji: "⚪", shape: "circle",   fact: "A circle has no corners at all!" },
      { id: "square",   name: "Square",   emoji: "🟥", shape: "square",   fact: "A square has 4 equal sides!" },
      { id: "triangle", name: "Triangle", emoji: "🔺", shape: "triangle", fact: "Triangles are the strongest shape!" },
      { id: "star",     name: "Star",     emoji: "⭐", shape: "star",     fact: "Stars in the sky are giant suns!" },
      { id: "heart",    name: "Heart",    emoji: "❤️", shape: "heart",    fact: "Hearts are the symbol of love!" },
    ],
  },
};

// ─── Shape SVG renderer ───────────────────────────────────────────────────────
function ShapeIllustration({ shape, color }) {
  const c = color || "#20C997";
  switch (shape) {
    case "circle":
      return <svg viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="36" fill={c} opacity="0.85"/></svg>;
    case "square":
      return <svg viewBox="0 0 80 80" width="80" height="80"><rect x="8" y="8" width="64" height="64" rx="6" fill={c} opacity="0.85"/></svg>;
    case "triangle":
      return <svg viewBox="0 0 80 80" width="80" height="80"><polygon points="40,6 74,74 6,74" fill={c} opacity="0.85"/></svg>;
    case "star":
      return <svg viewBox="0 0 80 80" width="80" height="80"><polygon points="40,5 49,30 76,30 54,48 62,74 40,57 18,74 26,48 4,30 31,30" fill={c} opacity="0.85"/></svg>;
    case "heart":
      return <svg viewBox="0 0 80 80" width="80" height="80"><path d="M40 68 C40 68 8 48 8 26 C8 14 18 6 28 8 C34 9 40 15 40 15 C40 15 46 9 52 8 C62 6 72 14 72 26 C72 48 40 68 40 68Z" fill={c} opacity="0.85"/></svg>;
    default:
      return null;
  }
}

// ─── Card component ───────────────────────────────────────────────────────────
function ItemCard({ item, categoryKey, accentColor, onActivate, active }) {
  const cat = CATEGORIES[categoryKey];

  function handleClick() {
    // Play sound if available (with error handling)
    if (item.sound) {
      const audio = new Audio(item.sound);
      audio.play().catch(() => {}); // Silently handle missing audio files
    }
    onActivate(item.id);
  }

  return (
    <button
      onClick={handleClick}
      className={`item-card ${active ? "item-card--active" : ""}`}
      style={{ "--accent": accentColor, "--bg": cat.bg }}
      aria-label={`${item.name}${item.fact ? ". " + item.fact : ""}`}
    >
      {/* Visual */}
      <div className="card-visual">
        {categoryKey === "shapes" && item.shape ? (
          <ShapeIllustration shape={item.shape} color={accentColor} />
        ) : categoryKey === "colors" && item.swatch ? (
          <div className="swatch" style={{ background: item.swatch }} />
        ) : (
          <span className="card-emoji">{item.emoji}</span>
        )}
        {active && <div className="ripple" />}
      </div>

      {/* Name */}
      <span className="card-name">{item.name}</span>

      {/* Fun fact (appears when active) */}
      {active && item.fact && (
        <span className="card-fact">{item.fact}</span>
      )}
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [category, setCategory] = useState(null);
  const [activeId, setActiveId] = useState(null);

  // Clear active card after 2 seconds
  useEffect(() => {
    if (!activeId) return;
    const t = setTimeout(() => setActiveId(null), 2000);
    return () => clearTimeout(t);
  }, [activeId]);

  // Clear active when switching category
  function handleCategorySelect(key) {
    setCategory(key);
    setActiveId(null);
  }

  const cat = category ? CATEGORIES[category] : null;

  return (
    <div className="app">
        {/* ── HOME ── */}
        {!category && (
          <div className="home">
            <div className="home-header">
              <div className="title-badge">🌟</div>
              <h1 className="home-title">Learn &amp; Play</h1>
              <p className="home-subtitle">Tap a category to start!</p>
            </div>
            <div className="category-grid">
              {Object.entries(CATEGORIES).map(([key, c]) => (
                <button
                  key={key}
                  className="category-btn"
                  style={{ "--cat-color": c.color, "--cat-bg": c.bg }}
                  onClick={() => handleCategorySelect(key)}
                >
                  <span className="cat-emoji">{c.emoji}</span>
                  <span className="cat-label">{c.label}</span>
                  <span className="cat-count">{c.items.length} items</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CATEGORY ── */}
        {category && cat && (
          <div className="category-screen">
            <div className="category-header" style={{ "--accent": cat.color, "--bg": cat.bg }}>
              <button className="back-btn" onClick={() => setCategory(null)} aria-label="Back to home">
                ← Back
              </button>
              <h2 className="category-title">
                <span>{cat.emoji}</span> {cat.label}
              </h2>
            </div>

            <div className="items-grid">
              {cat.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  categoryKey={category}
                  accentColor={cat.color}
                  onActivate={setActiveId}
                  active={activeId === item.id}
                />
              ))}
            </div>

            <p className="tap-hint">👆 Tap any card to learn more!</p>
          </div>
        )}
    </div>
  );
}


