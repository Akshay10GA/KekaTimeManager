import React, { useEffect } from "react";
import "./App.css";
import KekaTimeManager from "./KekaTimeManager/KekaTimeManager";
import AppCanvas from "./AppCanvas/AppCanvas";
import { Backgrounds } from "./Background.js";

const App = () => {
  useEffect(() => {
    const currentDate = new Date();
    const flagArr = ["147", "157", "167", "250", "260", "270"];
    const gjArr = ["19", "29", "39"];
    const value =
      currentDate.getDate().toString() + currentDate.getMonth().toString();

    if (flagArr.includes(value)) {
      localStorage.setItem("canvasTheme", Backgrounds.Flag);
    } else if (gjArr.includes(value)) {
      localStorage.setItem("canvasTheme", Backgrounds.Gandhi);
    } else if (!localStorage.getItem("canvasTheme")) {
      localStorage.setItem("canvasTheme", Backgrounds.Ripple);
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
