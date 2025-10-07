import React, { useEffect, useState } from "react";
import "./App.css";
import KekaTimeManager from "./KekaTimeManager/KekaTimeManager";
import AppCanvas from "./AppCanvas/AppCanvas";
import { Backgrounds } from "./Background.js";

const App = () => {
  const [refresh, setRefresh] = useState(true);
  const [showKekaCalculator, setShowKekaCalculator] = useState(JSON.parse(localStorage.getItem("view")) ?? true);

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setShowKekaCalculator((prev)=>!prev);
    }
  }

  const handleKeyUp = (event) => {
    if (event.key === "Escape") {
      setShowKekaCalculator((prev)=>!prev);
    }
  };

  useEffect(() => {
    let useDefault = localStorage.getItem("useDefault");
    const currentDate = new Date();
    const flagArr = ["147", "157", "167", "250", "260", "270"];
    const gjArr = ["19", "29", "39"];
    const santaArr = [
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
    const value =
      currentDate.getDate().toString() + currentDate.getMonth().toString();

    if (!useDefault) {
      useDefault = "true";
    }

    if (useDefault === "true") {
      console.log(value);
      if (flagArr.includes(value)) {
        localStorage.setItem("canvasTheme", Backgrounds.Flag);
      } else if (gjArr.includes(value)) {
        localStorage.setItem("canvasTheme", Backgrounds.Gandhi);
      } else if (santaArr.includes(value)) {
        localStorage.setItem("canvasTheme", Backgrounds.Santa);
      }
    } else if (!localStorage.getItem("canvasTheme")) {
      localStorage.setItem("canvasTheme", Backgrounds.Ripple);
    }

    if (!localStorage.getItem("useDefault")) {
      localStorage.setItem("useDefault", "true");
    }

    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.addEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <AppCanvas refresh={refresh} />
      <div className="app">
        <KekaTimeManager refresh={refresh} setRefresh={setRefresh} showKekaCalculator={showKekaCalculator} setShowKekaCalculator={setShowKekaCalculator}/>
      </div>
    </>
  );
};

export default App;
