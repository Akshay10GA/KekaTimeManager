import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Scene from "./Scene";
import {
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";

const BASE_POSITION = [0, 2, 6];
const LOOK_AT = [0, 1, 1];

const NewYear = () => {
  const cameraRef = useRef();
  const timeRef = useRef(0);

  // Set initial position ONCE
  useEffect(() => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(...BASE_POSITION);
    cameraRef.current.lookAt(...LOOK_AT);
  }, []);

  useFrame((_, delta) => {
    if (!cameraRef.current) return;

    timeRef.current += delta;

    // Smooth left-right rotation around initial lookAt
    const yaw = Math.sin(timeRef.current * 0.2) * 0.2;

    cameraRef.current.lookAt(
      LOOK_AT[0] + yaw,
      LOOK_AT[1],
      LOOK_AT[2]
    );
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={50}
      />

      <Environment preset="sunset" />
      <Scene />
    </>
  );
};

export default NewYear;
