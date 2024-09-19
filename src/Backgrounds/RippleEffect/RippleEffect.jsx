import React, { useCallback, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import circleImg from "../../../assets/images/circle.png";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

const RippleEffect = () => {
  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef();
  const materialRef = useRef();

  let startColor = [255, 0, 0]; // Red
  let endColor = [0, 0, 255]; // Blue
  let duration = 7000; // 7 seconds
  let reverse = false;

  let t = 0;
  let timestamp = 0;
  let f = 0.002;
  let a = 3;
  let r = 255;
  const graph = useCallback(
    (x, z, offset) => {
      return Math.sin(f * (x ** 2 - z ** 2 + t)) * a + offset;
    },
    [t, f, a]
  );

  const count = 100;
  const sep = 3;
  let positions = useMemo(() => {
    let positions = [];

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        for (let yi = -5; yi < 11; yi += 5) {
          let x = sep * (xi - count / 2);
          let z = sep * (zi - count / 2);
          let y = graph(x, z, yi);
          positions.push(x, y, z);
        }
      }
    }

    return new Float32Array(positions);
  }, [count, sep, graph]);

  useFrame(() => {
    // Updating Color
    if (timestamp < 0 || timestamp > duration) {
      reverse = !reverse;
    }
    reverse ? (timestamp -= 15) : (timestamp += 15);
    const progress = Math.min(timestamp / duration, 1);
    const newColor = startColor.map((start, index) => {
      return Math.round(start + (endColor[index] - start) * progress);
    });

    materialRef.current.color = new THREE.Color(`rgb(${newColor.join(",")})`);

    // Updating Position
    t += 15;
    let positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        for (let yi = -5; yi < 11; yi += 5) {
          let x = sep * (xi - count / 2);
          let z = sep * (zi - count / 2);

          positions[i + 1] = graph(x, z, yi);
          i += 3;
        }
      }
    }

    // Update the scene with new positions and color
    bufferRef.current.needsUpdate = true;
    materialRef.current.needsUpdate = true;
  });

  return (
    <>
      <PerspectiveCamera position={[50, 15, 0]} makeDefault />
      <OrbitControls />
      <Environment preset="sunset" />
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            ref={bufferRef}
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          ref={materialRef}
          attach="material"
          map={imgTex}
          color={"rgb(255, 0, 0)"}
          size={0.5}
          sizeAttenuation
          transparent={false}
          alphaTest={0.5}
          opacity={1.0}
        />
      </points>
    </>
  );
};

export default RippleEffect;
