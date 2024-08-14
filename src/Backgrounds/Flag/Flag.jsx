import React, { useCallback, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import circleImg from "../../../assets/images/circle.png";

const Flag = () => {
  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef();
  const materialRef = useRef();

  let t = 0;
  let timestamp = 0;
  let f = 0.005;
  let a = 10;
  const graph = useCallback(
    (x, z, offset) => {
      return Math.sin(f * (x * 2.5 + z + t)) * a + offset;
    },
    [t, f, a]
  );

  const height = 200;
  const width = 65;
  const sep = 3;

  const numSpokes = 24;
  const radius = 25; // Radius of the outer circle
  const innerRadius = 1.5; // Radius of the inner circle for spokes

  // Calculate colors for the points
  const colors = useMemo(() => {
    const colors = [];
    for (let zi = 0; zi < height; zi++) {
      for (let xi = 0; xi < width; xi++) {
        for (let yi = -5; yi < 11; yi += 5) {
          if (xi > 45) {
            colors.push(1, 0.403921568627451, 0.12156862745098039);
          } else if (xi > 20) {
            colors.push(1, 1, 1);
          } else {
            colors.push(
              0.01568627450980392,
              0.41568627450980394,
              0.2196078431372549
            );
          }
        }
      }
    }

    let temp = new Array(5787 / 3)
      .fill([0.023529411764705882, 0.011764705882352941, 0.5529411764705883])
      .flatMap((x) => x);
    colors.push(...temp);
    return new Float32Array(colors);
  }, [width, height, sep, graph]);

  let positions = useMemo(() => {
    let positions = [];

    for (let xi = 0; xi < height; xi++) {
      for (let zi = 0; zi < width; zi++) {
        for (let yi = -5; yi < 11; yi += 5) {
          let x = sep * (xi - height / 2);
          let z = sep * (zi - width / 2);
          let y = graph(x, z, yi);
          positions.push(x, y, z);
        }
      }
    }

    let ashokChakraPositions = [];
    const angleStep = (2 * Math.PI) / numSpokes;
    const outerRingAngleStep = (2 * Math.PI) / 200;

    // Center dot
    ashokChakraPositions.push(0, 0, 0);
    // for (let i = 0; i < 200; i++) {
    //   for (let j = 0; j < innerRadius; j = j + 0.5) {
    //     const angle = i * outerRingAngleStep;
    //     ashokChakraPositions.push(j * Math.cos(angle), 12, j * Math.sin(angle));
    //   }
    // }

    // Outer ring points
    for (let i = 0; i < 200; i++) {
      const angle = i * outerRingAngleStep;
      ashokChakraPositions.push(
        radius * Math.cos(angle),
        12,
        radius * Math.sin(angle)
      );
    }

    // Spokes
    for (let i = 0; i < numSpokes; i++) {
      for (let j = innerRadius; j < radius; j = j + 0.5) {
        const angle = i * angleStep;
        ashokChakraPositions.push(j * Math.cos(angle), 12, j * Math.sin(angle));
      }
    }

    positions = [...positions, ...ashokChakraPositions];
    return new Float32Array(positions);
  }, [width, height, sep, graph]);

  useFrame(() => {
    // Updating Position
    t += 15;
    let positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < height; xi++) {
      for (let zi = 0; zi < width; zi++) {
        for (let yi = -5; yi < 11; yi += 5) {
          let x = sep * (xi - height / 2);
          let z = sep * (zi - width / 2);

          positions[i + 1] = graph(x, z, yi);
          i += 3;
        }
      }
    }

    for (let index = i; index < positions.length; index = i) {
      let x = positions[i];
      let z = positions[i + 2];
      positions[i + 1] = graph(x, z, 12);
      i += 3;
    }

    // Update the scene with new positions and color
    bufferRef.current.needsUpdate = true;
    materialRef.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={bufferRef}
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        ref={materialRef}
        attach="material"
        map={imgTex}
        vertexColors={true}
        size={3}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
};

export default Flag;
