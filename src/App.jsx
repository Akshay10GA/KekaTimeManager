import { useEffect, useState } from "react";
import "./App.css";
import KekaTimeManager from "./KekaTimeManager/KekaTimeManager";
import AppCanvas from "./AppCanvas/AppCanvas";
import { Backgrounds } from "./Background.js";
import InteractiveTutorial from "./components/InteractiveTutorial/InteractiveTutorial.jsx";
import HamburgerMenu from "./components/Menu/HamburgerMenu.jsx";
import MenuDialog from "./components/Menu/MenuDialog.jsx";

const App = () => {
  const [refresh, setRefresh] = useState(true);
  const [showKekaCalculator, setShowKekaCalculator] = useState(
    JSON.parse(localStorage.getItem("view")) ?? true
  );

  const [showMenu, setShowMenu] = useState(false);
  const [useDefaultBackground, setUseDefaultBackground] = useState(
    JSON.parse(localStorage.getItem("useDefault")) ?? true
  );
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!useDefaultBackground) return;

    const date = new Date();
    const todayKey = date.getDate().toString() + date.getMonth().toString();

    const flagDates = ["147", "157", "167", "250", "260", "270"];
    const gandhiDates = ["19", "29", "39"];
    const santaDates = [
      "1511",
      "1611",
      "1711",
      "1811",
      "1911",
      "2011",
      "2111",
      "2211",
      "2311",
      "2411",
      "2511",
      "2611",
      "2711",
      "2811",
      "2911",
      "3011",
    ];

    let selectedTheme = Backgrounds.Car; // DEFAULT fallback

    if (flagDates.includes(todayKey)) selectedTheme = Backgrounds.Flag;
    else if (gandhiDates.includes(todayKey)) selectedTheme = Backgrounds.Gandhi;
    else if (santaDates.includes(todayKey)) selectedTheme = Backgrounds.Santa;

    localStorage.setItem("canvasTheme", selectedTheme);
    localStorage.setItem("useDefault", true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setShowKekaCalculator((prev) => !prev);
      } else if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        setShowQuiz((prev) => !prev);
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
      {/* Interactive first-time tutorial */}
      <InteractiveTutorial
        showKekaCalculator={showKekaCalculator}
        setShowKekaCalculator={setShowKekaCalculator}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      {/* Hamburger menu button */}
      <HamburgerMenu onClick={() => setShowMenu(true)} />

      {/* Canvas background */}
      <AppCanvas refresh={refresh} className="canvas-section" />

      {/* Keka Time Manager */}
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

      {/* Menu Dialog */}
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
