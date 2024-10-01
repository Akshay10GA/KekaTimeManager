import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Text from "../Backgrounds/GdtcLogo/GdtcLogo";
import Flag from "../Backgrounds/Flag/Flag";
import RippleEffect from "../Backgrounds/RippleEffect/RippleEffect";
import { Backgrounds } from "../Background";
import Car from "../Backgrounds/Car/Car";
import Planets_and_satellites from "../Backgrounds/PlanetsAndSatellites/Planets_and_satellites";
import BlackHole from "../Backgrounds/BlackHole/BlackHole";
import GandhiJayanti from "../Backgrounds/GandhiJayanti/GandhiJayanti";

const AppCanvas = () => {
  const [theme, setTheme] = useState("");
  const [bgColor, setBgColor] = useState("rgba(0,11,17,255)");
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setTheme(localStorage.getItem("canvasTheme"));
  }, []);

  const handleChange = () => {
    console.log("hii");
    setHide(!hide);
  };

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
              {theme === Backgrounds.GDTCLOGO && <Text />}
              {theme === Backgrounds.Flag && <Flag />}
              {theme === Backgrounds.Ripple && <RippleEffect />}
              {theme === Backgrounds.Car && <Car />}
              {theme === Backgrounds.Earth && <Planets_and_satellites />}
              {theme === Backgrounds.BlackHole && <BlackHole />}
              {theme === Backgrounds.Gandhi && <GandhiJayanti hide={hide} />}
            </>
          )}
        </Canvas>
      </Suspense>
      {theme === Backgrounds.Gandhi && (
        <button className="view-change-button" onClick={handleChange}>
          Change View
        </button>
      )}
    </>
  );
};

export default AppCanvas;
