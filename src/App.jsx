import { useEffect, useState } from "react";
import "./App.css";
import KekaTimeManager from "./KekaTimeManager/KekaTimeManager";
import AppCanvas from "./AppCanvas/AppCanvas";
import { Backgrounds } from "./Background.js";
import InteractiveTutorial from "./components/InteractiveTutorial/InteractiveTutorial.jsx";
import HamburgerMenu from "./components/Menu/HamburgerMenu.jsx";
import MenuDialog from "./components/Menu/MenuDialog.jsx";

// Theme Configuration
const THEME_DATES = {
  [Backgrounds.Flag]: ["147", "157", "167", "250", "260", "270"],
  [Backgrounds.Gandhi]: ["19", "29", "39"],
  [Backgrounds.Santa]: Array.from({ length: 16 }, (_, i) => `${15 + i}11`), // 1511 to 3011
};

const App = () => {
  const [refresh, setRefresh] = useState(true);
  const [showKekaCalculator, setShowKekaCalculator] = useState(
    () => JSON.parse(localStorage.getItem("view")) ?? true
  );
  const [showMenu, setShowMenu] = useState(false);
  const [useDefaultBackground, setUseDefaultBackground] = useState(
    () => JSON.parse(localStorage.getItem("useDefault")) ?? true
  );
  const [showQuiz, setShowQuiz] = useState(false);

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
  }, [useDefaultBackground]);

  // Global Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        if (e.key.toLowerCase() === "m") {
          e.preventDefault();
          setShowKekaCalculator((prev) => !prev);
        } else if (e.key.toLowerCase() === "q") {
          e.preventDefault();
          setShowQuiz((prev) => !prev);
        }
      } else if (e.key.toLowerCase() === "escape") {
        e.preventDefault();
        setShowMenu((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <InteractiveTutorial
        showKekaCalculator={showKekaCalculator}
        setShowKekaCalculator={setShowKekaCalculator}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      
      <HamburgerMenu onClick={() => setShowMenu(true)} setShowQuiz={setShowQuiz}/>
      
      <AppCanvas refresh={refresh} className="canvas-section" />
      
      <div className="app">
        <KekaTimeManager
          refresh={refresh}
          setRefresh={setRefresh}
          showKekaCalculator={showKekaCalculator}
          setShowKekaCalculator={setShowKekaCalculator}
          showQuiz={showQuiz}
          setShowQuiz={setShowQuiz}
        />
      </div>

      <MenuDialog
        refresh={refresh}
        setRefresh={setRefresh}
        open={showMenu}
        onClose={() => setShowMenu(false)}
        showKekaCalculator={showKekaCalculator}
        setShowKekaCalculator={setShowKekaCalculator}
        useDefaultBackground={useDefaultBackground}
        setUseDefaultBackground={setUseDefaultBackground}
        setShowQuiz={setShowQuiz}
      />
    </>
  );
};

export default App;