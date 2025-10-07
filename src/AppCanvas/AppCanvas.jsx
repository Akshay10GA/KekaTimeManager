import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import GdtcLogo from "../Backgrounds/GdtcLogo/GdtcLogo";
import Flag from "../Backgrounds/Flag/Flag";
import RippleEffect from "../Backgrounds/RippleEffect/RippleEffect";
import { Backgrounds } from "../Background";
import Car from "../Backgrounds/Car/Car";
import Planets_and_satellites from "../Backgrounds/PlanetsAndSatellites/Planets_and_satellites";
import Santa from "../Backgrounds/Santa/Santa_dance";
import GandhiJayanti from "../Backgrounds/GandhiJayanti/GandhiJayanti";

const AppCanvas = ({refresh}) => {
  const [theme, setTheme] = useState("");
  const [bgColor, setBgColor] = useState("rgba(0,11,17,255)");
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setTheme(localStorage.getItem("canvasTheme"));
    console.log(localStorage.getItem("canvasTheme"));
  },[refresh]);

  return (
    <>
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
              {theme === Backgrounds.Ripple && <RippleEffect />}
              {theme === Backgrounds.Flag && <Flag />}
              {theme === Backgrounds.Car && <Car />}
              {theme === Backgrounds.Earth && <Planets_and_satellites />}
              {theme === Backgrounds.GDTCLOGO && <GdtcLogo />}
              {theme === Backgrounds.Santa && <Santa />}
              {theme === Backgrounds.Gandhi && <GandhiJayanti />}
            </>
          )}
        </Canvas>
      </Suspense>
    </>
  );
};

export default AppCanvas;
