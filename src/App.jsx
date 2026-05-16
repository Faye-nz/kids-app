import { useState, useEffect } from "react";
import './App.css';

import dogImg      from './assets/animals/dog.png';
import catImg      from './assets/animals/cat.png';
import lionImg     from './assets/animals/lion.png';
import elephantImg from './assets/animals/elephant.png';
import giraffeImg  from './assets/animals/giraffe.png';
import zebraImg    from './assets/animals/zebra.png';
import cowImg      from './assets/animals/cow.png';
import sheepImg    from './assets/animals/sheep.png';
import horseImg    from './assets/animals/horse.png';
import pigImg      from './assets/animals/pig.png';
import roosterImg  from './assets/animals/rooster.png';
import duckImg     from './assets/animals/duck.png';

// Label colors cycling for animal name badges
const LABEL_COLORS = [
  "#E63946", "#3A86FF", "#FF9F1C", "#6A0DAD",
  "#2DC653", "#E63946", "#2DC653", "#6A0DAD",
  "#E63946", "#3A86FF", "#FF9F1C", "#2DC653"
];

const CATEGORIES = {
  animals: {
    label: "Animals",
    emoji: "🐾",
    color: "#7B2FBE",
    items: [
      { id: "dog",      name: "Dog",     image: dogImg,      sound: "/sounds/dog.mp3" },
      { id: "cat",      name: "Cat",     image: catImg,      sound: "/sounds/cat.mp3" },
      { id: "lion",     name: "Lion",    image: lionImg,     sound: "/sounds/lion.mp3" },
      { id: "elephant", name: "Elephant",image: elephantImg, sound: "/sounds/elephant.mp3" },
      { id: "giraffe",  name: "Giraffe", image: giraffeImg,  sound: "/sounds/giraffe.mp3" },
      { id: "zebra",    name: "Zebra",   image: zebraImg,    sound: "/sounds/zebra.mp3" },
      { id: "cow",      name: "Cow",     image: cowImg,      sound: "/sounds/cow.mp3" },
      { id: "sheep",    name: "Sheep",   image: sheepImg,    sound: "/sounds/sheep.mp3" },
      { id: "horse",    name: "Horse",   image: horseImg,    sound: "/sounds/horse.mp3" },
      { id: "pig",      name: "Pig",     image: pigImg,      sound: "/sounds/pig.mp3" },
      { id: "rooster",  name: "Chicken", image: roosterImg,  sound: "/sounds/rooster.mp3" },
      { id: "duck",     name: "Duck",    image: duckImg,     sound: "/sounds/duck.mp3" },
    ],
  },
  colors: {
    label: "Colors",
    emoji: "🎨",
    color: "#845EF7",
    bg: "#F5F0FF",
    items: [
      { id: "red",    name: "Red",    emoji: "🔴", swatch: "#E63946" },
      { id: "blue",   name: "Blue",   emoji: "🔵", swatch: "#1D6FA4" },
      { id: "green",  name: "Green",  emoji: "🟢", swatch: "#2DC653" },
      { id: "yellow", name: "Yellow", emoji: "🟡", swatch: "#FFD60A" },
      { id: "orange", name: "Orange", emoji: "🟠", swatch: "#FF8C00" },
    ],
  },
  shapes: {
    label: "Shapes",
    emoji: "🔷",
    color: "#20C997",
    bg: "#F0FFF8",
    items: [
      { id: "circle",   name: "Circle",   emoji: "⚪", shape: "circle" },
      { id: "square",   name: "Square",   emoji: "🟥", shape: "square" },
      { id: "triangle", name: "Triangle", emoji: "🔺", shape: "triangle" },
      { id: "star",     name: "Star",     emoji: "⭐", shape: "star" },
      { id: "heart",    name: "Heart",    emoji: "❤️", shape: "heart" },
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

// ─── Animal Card ──────────────────────────────────────────────────────────────
function AnimalCard({ item, index, onActivate, active }) {
  const labelColor = LABEL_COLORS[index % LABEL_COLORS.length];

  function handleClick() {
    if (item.sound) {
      const audio = new Audio(item.sound);
      audio.play().catch(() => {});
    }
    onActivate(item.id);
  }

  return (
    <button
      onClick={handleClick}
      className={`animal-card ${active ? "animal-card--active" : ""}`}
      aria-label={item.name}
    >
      <div className="animal-img-wrap">
        <img src={item.image} alt={item.name} className="animal-img" />
      </div>
      <span className="animal-label" style={{ background: labelColor }}>
        {item.name}
      </span>
    </button>
  );
}

// ─── Generic Item Card (colors & shapes) ─────────────────────────────────────
function ItemCard({ item, categoryKey, accentColor, onActivate, active }) {
  const cat = CATEGORIES[categoryKey];

  return (
    <button
      onClick={() => onActivate(item.id)}
      className={`item-card ${active ? "item-card--active" : ""}`}
      style={{ "--accent": accentColor, "--bg": cat.bg }}
      aria-label={item.name}
    >
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
      <span className="card-name">{item.name}</span>
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [category, setCategory] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!activeId) return;
    const t = setTimeout(() => setActiveId(null), 2000);
    return () => clearTimeout(t);
  }, [activeId]);

  function handleCategorySelect(key) {
    setCategory(key);
    setActiveId(null);
  }

  const cat = category ? CATEGORIES[category] : null;
  const isAnimals = category === "animals";

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
                style={{
                  "--cat-color": c.color,
                  "--cat-bg": key === "animals" ? "#1a2a5e" : c.bg
                }}
                onClick={() => handleCategorySelect(key)}
              >
                <span className="cat-emoji">{c.emoji}</span>
                <span className="cat-label" style={{ color: key === "animals" ? "#fff" : "#2D2D2D" }}>
                  {c.label}
                </span>
                <span className="cat-count">{c.items.length} items</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ANIMALS SCREEN ── */}
      {category && cat && isAnimals && (
        <div className="animals-screen">
          <div className="animals-header">
            <button className="animals-back-btn" onClick={() => setCategory(null)} aria-label="Back">
              ←
            </button>
            <h2 className="animals-title">
              <span>⭐</span> Animals <span>⭐</span>
            </h2>
            <div className="animals-sound-icon">🔊</div>
          </div>

          <div className="animals-hint">
            🔊 Tap an animal to see its name and hear its sound
          </div>

          <div className="animals-grid">
            {cat.items.map((item, index) => (
              <AnimalCard
                key={item.id}
                item={item}
                index={index}
                onActivate={setActiveId}
                active={activeId === item.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── COLORS & SHAPES SCREEN ── */}
      {category && cat && !isAnimals && (
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
        </div>
      )}

    </div>
  );
}
