import React, { Suspense, useEffect, useRef, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Text from "../Backgrounds/Text/Text";
import Flag from "../Backgrounds/Flag/Flag";

const AppCanvas = () => {
  const [cameraPosition, setCameraPosition] = useState([10, 5, 0]);
  const [showFlag, setShowFlag] = useState(false);
  useEffect(() => {
    const theme = localStorage.getItem("canvasTheme");
    if (theme == "flag") {
      setCameraPosition([0, 100, -50]);
      setShowFlag(true);
    } else {
      setCameraPosition([50, 25, 0]);
      setShowFlag(false);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas shadows style={{ backgroundColor: "rgba(0,11,17,255)" }}>
        {true && (
          <>
            {!showFlag && <Text />}
            {showFlag && <Flag />}
          </>
        )}
      </Canvas>
    </Suspense>
  );
};

export default AppCanvas;
