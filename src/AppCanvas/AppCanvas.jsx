import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Backgrounds } from "../Background";
// Background Components
import GdtcLogo from "../Backgrounds/GdtcLogo/GdtcLogo";
import Flag from "../Backgrounds/Flag/Flag";
import RippleEffect from "../Backgrounds/RippleEffect/RippleEffect";
import Car from "../Backgrounds/Car/Car";
import Planets_and_satellites from "../Backgrounds/PlanetsAndSatellites/Planets_and_satellites";
import Santa from "../Backgrounds/Santa/Santa_dance";
import GandhiJayanti from "../Backgrounds/GandhiJayanti/GandhiJayanti";
import NewYear from "../Backgrounds/NewYear/NewYear";

const AppCanvas = ({ refresh }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("canvasTheme"));
  const [bgColor] = useState("rgba(0,11,17,255)");

  useEffect(() => {
    setTheme(localStorage.getItem("canvasTheme"));
  }, [refresh]);

  return (
    <Suspense
      fallback={
        <div className="logo-row">
          <img src="/Leaf_logo.png" alt="Loading" className="logo-bounce" />
          <img src="/Leaf_logo.png" alt="Loading" className="logo-bounce delay1" />
          <img src="/Leaf_logo.png" alt="Loading" className="logo-bounce delay2" />
          <img src="/Leaf_logo.png" alt="Loading" className="logo-bounce delay3" />
        </div>
      }
    >
      <Canvas shadows style={{ backgroundColor: bgColor }}>
        {theme === Backgrounds.Ripple && <RippleEffect />}
        {theme === Backgrounds.Flag && <Flag />}
        {theme === Backgrounds.Car && <Car />}
        {theme === Backgrounds.Earth && <Planets_and_satellites />}
        {theme === Backgrounds.GDTCLOGO && <GdtcLogo />}
        {theme === Backgrounds.Santa && <Santa />}
        {theme === Backgrounds.Gandhi && <GandhiJayanti />}
        {theme === Backgrounds.NewYear && <NewYear />}
      </Canvas>
    </Suspense>
  );
};

export default AppCanvas;