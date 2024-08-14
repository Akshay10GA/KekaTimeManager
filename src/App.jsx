import React, { useEffect } from "react";
import "./App.css";
import KekaTimeManager from "./KekaTimeManager/KekaTimeManager";
import AppCanvas from "./AppCanvas/AppCanvas";
import { Backgrounds } from "./Background.js";

const App = () => {
  useEffect(() => {
    const currentDate = new Date();
    const arr = ["147", "157", "167", "250", "260", "270"];
    const value =
      currentDate.getDate().toString() + currentDate.getMonth().toString();

    if (arr.includes(value)) {
      localStorage.setItem("canvasTheme", "flag");
    } else {
      localStorage.setItem("canvasTheme", Backgrounds.RIPPLE);
    }
  }, []);
  return (
    <>
      <AppCanvas />
      <div className="app">
        <KekaTimeManager />
      </div>
    </>
  );
};

export default App;
