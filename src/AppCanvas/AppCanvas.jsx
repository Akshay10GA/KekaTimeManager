import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Text from "../Backgrounds/GdtcLogo/GdtcLogo";
import Flag from "../Backgrounds/Flag/Flag";
import RippleEffect from "../Backgrounds/RippleEffect/RippleEffect";
import { Backgrounds } from "../Background";
import Reaver from "../Backgrounds/Reaver/Reaver";
import Car from "../Backgrounds/Car/Car";
import Planets_and_satellites from "../Backgrounds/PlanetsAndSatellites/Planets_and_satellites";
import BlackHole from "../Backgrounds/BlackHole/BlackHole";

const AppCanvas = () => {
  const [theme, setTheme] = useState("");
  const [bgColor, setBgColor] = useState("rgba(0,11,17,255)");
  useEffect(() => {
    setTheme(localStorage.getItem("canvasTheme"));
  }, []);

  return (
    <Suspense
      fallback={
        <div className="hourglassBackground">
          <div className="hourglassContainer">
            <div className="hourglassCurves"></div>
            <div className="hourglassCapTop"></div>
            <div className="hourglassGlassTop"></div>
            <div className="hourglassSand"></div>
            <div className="hourglassSandStream"></div>
            <div className="hourglassCapBottom"></div>
            <div className="hourglassGlass"></div>
          </div>
        </div>
      }
    >
      <Canvas shadows style={{ backgroundColor: bgColor }}>
        {true && (
          <>
            {theme === Backgrounds.GDTCLOGO && <Text />}
            {theme === Backgrounds.FLAG && <Flag />}
            {theme === Backgrounds.RIPPLE && <RippleEffect />}
            {theme === Backgrounds.REAVER && <Reaver setBgColor={setBgColor} />}
            {theme === Backgrounds.CAR && <Car />}
            {theme === Backgrounds.EARTH && <Planets_and_satellites />}
            {/* {theme === Backgrounds.BlackHole && <BlackHole />} */}
          </>
        )}
      </Canvas>
    </Suspense>
  );
};

export default AppCanvas;
