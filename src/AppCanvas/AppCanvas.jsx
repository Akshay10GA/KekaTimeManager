import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import circleImg from "../../assets/images/circle.png";
import RippleEffect from "../Backgrounds/RippleEffect/RippleEffect";
import Flag from "../Backgrounds/Flag/Flag";

const AppCanvas = () => {
  const [cameraPosition, setCameraPosition] = useState([50, 25, 0]);
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
      <Canvas style={{ backgroundColor: "rgba(0,11,17,255)" }}>
        <PerspectiveCamera
          fov={75}
          position={cameraPosition}
          makeDefault={true}
        />
        {true && (
          <>
            {!showFlag && <RippleEffect />}
            {showFlag && <Flag />}
            <OrbitControls></OrbitControls>
          </>
        )}
      </Canvas>
    </Suspense>
  );
};

export default AppCanvas;
