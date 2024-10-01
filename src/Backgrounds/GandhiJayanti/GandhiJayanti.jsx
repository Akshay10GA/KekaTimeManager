import React, { useRef, useState } from "react";
import Gandhi from "./Gandhi";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

const GandhiJayanti = (props) => {
  const cameraRef = useRef();
  const controlsRef = useRef();
  const [cameraPosition, setCameraPosition] = useState([0, 2, 10]);
    const [targetPosition, setTargetPosition] = useState([0, 2, 0]);


  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        position={cameraPosition}
        makeDefault
      />
      <OrbitControls ref={controlsRef} target={targetPosition} />
      <Environment preset="sunset" />
      <Gandhi />
    </>
  );
};

export default GandhiJayanti;
