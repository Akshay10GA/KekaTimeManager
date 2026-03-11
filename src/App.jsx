import { useEffect, useState } from "react";
import "./App.css";
import KekaTimeManager from "./KekaTimeManager/KekaTimeManager";
import AppCanvas from "./AppCanvas/AppCanvas";
import { Backgrounds } from "./Background.js";
import SideNav from "./components/Sidenav/SideNav.jsx";
import Confessions from "./components/Confessions/Confessions";
import MovieReviews from "./components/MovieReview/MovieReviews.jsx";
import NewQuiz from "./components/Quiz/NewQuiz.jsx";

// Theme Configuration
const THEME_DATES = {
  [Backgrounds.Flag]: ["147", "157", "167", "250", "260", "270"],
  [Backgrounds.Gandhi]: ["19", "29", "39"],
  [Backgrounds.Santa]: Array.from({ length: 16 }, (_, i) => `${15 + i}11`),
};

const App = () => {
  const [refresh, setRefresh] = useState(true);
  const [useDefaultBackground, setUseDefaultBackground] = useState(
    () => JSON.parse(localStorage.getItem("useDefault")) ?? true
  );

  const [currentView, setCurrentView] = useState("time");
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Handle Default Background Selection
  useEffect(() => {
    if (!useDefaultBackground) return;
    const now = new Date();
    const todayKey = `${now.getDate()}${now.getMonth()}`;
    const theme = Object.keys(THEME_DATES).find((key) =>
      THEME_DATES[key].includes(todayKey)
    ) || Backgrounds.Car;

    localStorage.setItem("canvasTheme", theme);
    localStorage.setItem("useDefault", true);
  }, [useDefaultBackground, refresh]);

  // Global Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        if (e.key.toLowerCase() === "1") { e.preventDefault(); setCurrentView("time"); }
        if (e.key.toLowerCase() === "2") { e.preventDefault(); setCurrentView("confessions"); }
        if (e.key.toLowerCase() === "3") { e.preventDefault(); setCurrentView("movies"); }
        if (e.key.toLowerCase() === "4") { e.preventDefault(); setCurrentView("quiz"); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleThemeChange = (themeName) => {
    localStorage.setItem("canvasTheme", themeName);
    localStorage.setItem("useDefault", false);
    setUseDefaultBackground(false);
    setRefresh(!refresh);
    setShowThemeModal(false);
  };

  return (
    <div className="trading-layout">
      {/* 3D Background */}
      <div className="canvas-wrapper">
        <AppCanvas refresh={refresh} className="canvas-section" />
        <div className="canvas-dark-overlay"></div>
      </div>

      {/* Sidebar Navigation */}
      <SideNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowThemeModal={setShowThemeModal}
      />

      {/* Main Content Area */}
      <main className="trading-main-content">
        <header className="trading-topbar">
          <h1 className="view-title">
            <span className="text-dim">/ </span>{currentView.toUpperCase()}
          </h1>
          <div className="market-time">
            {new Date().toLocaleTimeString('en-US', { hour12: false })} <span className="text-dim">IST</span>
          </div>
        </header>

        <div className="trading-workspace">
          {currentView === "time" && (
            <KekaTimeManager refresh={refresh} setRefresh={setRefresh} />
          )}
          {currentView === "confessions" && (
            <Confessions />
          )}
          {currentView === "movies" && (
            <MovieReviews />
          )}
          {currentView === "quiz" && (
            <NewQuiz />
          )}
        </div>
      </main>

      {/* Sleek Theme Modal */}
      {showThemeModal && (
        <div className="theme-modal-overlay" onClick={() => setShowThemeModal(false)}>
          <div className="theme-modal-content widget" onClick={e => e.stopPropagation()}>
            <div className="widget-header">CANVAS THEME SELECTOR</div>
            <div className="theme-options">
              {Object.values(Backgrounds).map((bg) => (
                <button key={bg} className="execute-btn" onClick={() => handleThemeChange(bg)}>
                  {bg}
                </button>
              ))}
              <button
                className="execute-btn highlight-btn mt-3"
                onClick={() => { setUseDefaultBackground(true); setShowThemeModal(false); }}
              >
                Auto (Based on Date)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;