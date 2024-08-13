import React, { Suspense, useCallback, useMemo, useRef } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import circleImg from "../../assets/images/circle.png";
import RippleEffect from "../Backgrounds/RippleEffect/RippleEffect";

const AppCanvas = () => {
  // useEffect(() => {
  //   localStorage.setItem()
  // }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas
        camera={{ fov: 75, position: [50, 25, 0] }}
        style={{ backgroundColor: "rgba(0,11,17,255)" }}
      >
        {true && (
          <>
            <RippleEffect />
            <OrbitControls></OrbitControls>
          </>
        )}
      </Canvas>
    </Suspense>
  );
};

export default AppCanvas;
