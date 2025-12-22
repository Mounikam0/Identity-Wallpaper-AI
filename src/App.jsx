import { useState, useEffect } from "react";
import { buildPrompt } from "./utils/promptBuilder";

export default function App() {
  const [role, setRole] = useState("Focused professional");
  const [mindset, setMindset] = useState("Deep focus");
  const [style, setStyle] = useState("Soft neutral light");
  const [device, setDevice] = useState("mobile");
  const [accentColor, setAccentColor] = useState("#667eea");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("wallpaper-history");
    const savedFavorites = localStorage.getItem("wallpaper-favorites");
    const savedTheme = localStorage.getItem("theme");
    
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("wallpaper-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("wallpaper-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  async function generateImage() {
    setLoading(true);
    setImage(null);

    const prompt = buildPrompt(role, mindset, style, device, accentColor);
    console.log("Generated prompt:", prompt);

    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 100000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=1344&seed=${seed}&nologo=true`;

    setTimeout(() => {
      setImage(imageUrl);
      setLoading(false);
      
      const newEntry = {
        url: imageUrl,
        timestamp: Date.now(),
        role,
        mindset,
        style,
        device,
        accentColor
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 20));
    }, 1500);
  }

  function randomGenerate() {
    const roles = ["Focused professional", "Creative thinker", "Founder / Builder", "Quiet achiever", "Student", "Minimalist"];
    const mindsets = ["Deep focus", "Calm clarity", "Low-stress productivity", "Evening wind-down", "Morning energy", "Creative flow"];
    const styles = ["Soft neutral light", "Muted dark elegance", "Warm minimal calm", "Cool modern stillness", "Pastel dreamscape", "Monochrome zen"];
    const colors = ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#fa709a", "#feca57"];

    setRole(roles[Math.floor(Math.random() * roles.length)]);
    setMindset(mindsets[Math.floor(Math.random() * mindsets.length)]);
    setStyle(styles[Math.floor(Math.random() * styles.length)]);
    setAccentColor(colors[Math.floor(Math.random() * colors.length)]);
    
    setTimeout(() => generateImage(), 100);
  }

  function downloadImage(url = image) {
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallpaper-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function addToFavorites(url = image) {
    if (!url) return;
    
    const newFav = {
      url,
      timestamp: Date.now(),
      role,
      mindset,
      style
    };
    
    setFavorites(prev => [newFav, ...prev]);
  }

  function removeFromFavorites(timestamp) {
    setFavorites(prev => prev.filter(fav => fav.timestamp !== timestamp));
  }

  function isFavorite(url) {
    return favorites.some(fav => fav.url === url);
  }

  function loadFromHistory(entry) {
    setRole(entry.role);
    setMindset(entry.mindset);
    setStyle(entry.style);
    setDevice(entry.device);
    setAccentColor(entry.accentColor);
    setImage(entry.url);
    setShowHistory(false);
  }

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }

  function clearHistory() {
    if (confirm("Clear all history?")) {
      setHistory([]);
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎨 Identity Wallpaper AI</h1>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
      
      <p className="subtitle">Generate wallpapers that match your vibe</p>

      <div className="tabs">
        <button 
          className={`tab-btn ${!showHistory && !showFavorites ? 'active' : ''}`}
          onClick={() => { setShowHistory(false); setShowFavorites(false); }}
        >
          🎨 Create
        </button>
        <button 
          className={`tab-btn ${showHistory ? 'active' : ''}`}
          onClick={() => { setShowHistory(true); setShowFavorites(false); }}
        >
          📜 History ({history.length})
        </button>
        <button 
          className={`tab-btn ${showFavorites ? 'active' : ''}`}
          onClick={() => { setShowFavorites(true); setShowHistory(false); }}
        >
          ⭐ Favorites ({favorites.length})
        </button>
      </div>

      {!showHistory && !showFavorites && (
        <>
          <div className="form-group">
            <label>👤 Your Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Focused professional</option>
              <option>Creative thinker</option>
              <option>Founder / Builder</option>
              <option>Quiet achiever</option>
              <option>Student</option>
              <option>Minimalist</option>
            </select>
          </div>

          <div className="form-group">
            <label>🧠 Mental State</label>
            <select value={mindset} onChange={(e) => setMindset(e.target.value)}>
              <option>Deep focus</option>
              <option>Calm clarity</option>
              <option>Low-stress productivity</option>
              <option>Evening wind-down</option>
              <option>Morning energy</option>
              <option>Creative flow</option>
            </select>
          </div>

          <div className="form-group">
            <label>🎨 Visual Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option>Soft neutral light</option>
              <option>Muted dark elegance</option>
              <option>Warm minimal calm</option>
              <option>Cool modern stillness</option>
              <option>Pastel dreamscape</option>
              <option>Monochrome zen</option>
            </select>
          </div>

          <div className="form-group">
            <label>🎨 Accent Color</label>
            <div className="color-picker-container">
              <input 
                type="color" 
                value={accentColor} 
                onChange={(e) => setAccentColor(e.target.value)}
                className="color-picker"
              />
              <span className="color-value">{accentColor}</span>
            </div>
          </div>

          <div className="form-group">
            <label>📱 Device</label>
            <select value={device} onChange={(e) => setDevice(e.target.value)}>
              <option value="mobile">Mobile (9:16)</option>
              <option value="desktop">Desktop (16:9)</option>
            </select>
          </div>

          <div className="button-group">
            <button 
              className="generate-btn primary" 
              onClick={generateImage}
              disabled={loading}
            >
              {loading ? "✨ Generating..." : "🚀 Generate"}
            </button>
            <button 
              className="generate-btn secondary" 
              onClick={randomGenerate}
              disabled={loading}
            >
              🎲 Surprise Me
            </button>
          </div>

          <p className="info-text">
            ✨ AI-powered wallpapers tailored to your identity
          </p>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}

          {image && !loading && (
            <>
              <div className="image-container">
                <img
                  src={image}
                  alt="Generated wallpaper"
                  className="generated-image"
                />
              </div>
              <div className="button-group">
                <button className="action-btn download" onClick={() => downloadImage()}>
                  ⬇️ Download
                </button>
                <button 
                  className={`action-btn favorite ${isFavorite(image) ? 'active' : ''}`}
                  onClick={() => isFavorite(image) ? null : addToFavorites()}
                  disabled={isFavorite(image)}
                >
                  {isFavorite(image) ? "⭐ Favorited" : "⭐ Add to Favorites"}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {showHistory && (
        <div className="history-section">
          <div className="section-header">
            <h2>📜 Generation History</h2>
            {history.length > 0 && (
              <button className="clear-btn" onClick={clearHistory}>
                🗑️ Clear
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <p className="empty-state">No history yet. Generate your first wallpaper!</p>
          ) : (
            <div className="grid">
              {history.map((entry) => (
                <div key={entry.timestamp} className="history-card">
                  <img 
                    src={entry.url} 
                    alt="History item"
                    onClick={() => loadFromHistory(entry)}
                  />
                  <div className="card-info">
                    <p className="card-title">{entry.role}</p>
                    <p className="card-subtitle">{entry.mindset}</p>
                    <div className="card-actions">
                      <button onClick={() => downloadImage(entry.url)} title="Download">
                        ⬇️
                      </button>
                      <button onClick={() => loadFromHistory(entry)} title="Load">
                        🔄
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showFavorites && (
        <div className="favorites-section">
          <h2>⭐ Your Favorites</h2>
          
          {favorites.length === 0 ? (
            <p className="empty-state">No favorites yet. Add some wallpapers you love!</p>
          ) : (
            <div className="grid">
              {favorites.map((fav) => (
                <div key={fav.timestamp} className="favorite-card">
                  <img src={fav.url} alt="Favorite item" />
                  <div className="card-info">
                    <p className="card-title">{fav.role}</p>
                    <p className="card-subtitle">{fav.mindset}</p>
                    <div className="card-actions">
                      <button onClick={() => downloadImage(fav.url)} title="Download">
                        ⬇️
                      </button>
                      <button 
                        onClick={() => removeFromFavorites(fav.timestamp)} 
                        title="Remove"
                        className="remove-btn"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}