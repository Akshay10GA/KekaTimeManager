import {
  Center,
  OrbitControls,
  PerspectiveCamera,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";
import * as POSTPROCESSING from "postprocessing";
import circleImg from "../../../assets/images/circle.png";
import { useLoader } from "@react-three/fiber";

const Text = ({ cameraRef }) => {
  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);
  const material = new THREE.MeshBasicMaterial({ color: "blue" });

  let linePositions = [];
  let positions = useMemo(() => {
    let positions = [];
    console.log(cameraRef);

    for (let xi = 0; xi < 3; xi++) {
      for (let yi = 0; yi < 3; yi++) {
        let x = 5 * (xi - 3 / 2);
        let y = 5 * (yi - 3 / 2);
        let z = 0;
        positions.push(x, y, z);
      }
    }
    linePositions = new Float32Array(positions.slice(8));
    return new Float32Array(positions);
  }, []);

  return (
    <>
      <PerspectiveCamera fov={75} position={[0, 6, 60]} makeDefault={true} />
      <ambientLight />
      <mesh position={[0, 0, -500]} scaleX={1.2}>
        <circleGeometry args={[200, 50]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
      <mesh>
        <Center>
          <Text3D
            font="/helvetiker_regular.typeface.json"
            size={10}
            height={0.5}
            curveSegments={12}
            bevelEnabled
            bevelThickness={1}
            bevelSegments={5}
            bevelOffset={0}
            bevelSize={0.02}
            material={material}
          >
            Go
          </Text3D>
          <Text3D
            font="/helvetiker_regular.typeface.json"
            size={10}
            height={0.5}
            curveSegments={12}
            bevelEnabled
            bevelThickness={1}
            bevelSegments={5}
            bevelOffset={0}
            bevelSize={0.02}
            material={material}
            position={[10, -9, 0]}
          >
            digital
          </Text3D>
        </Center>
        <group rotation={[0, 0, Math.PI / 4]} position={[0, 20, 0]}>
          <points>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                array={positions}
                count={positions.length / 3}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              attach="material"
              map={imgTex}
              color={"rgb(0, 0, 255)"}
              size={5}
              sizeAttenuation
              transparent={false}
              alphaTest={0.5}
              opacity={1.0}
            />
          </points>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-2.5, 2.5, -1]}>
            <capsuleGeometry args={[0.5, 10, 4, 8]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI]} position={[-7.5, -2.5, -1]}>
            <capsuleGeometry args={[0.5, 10, 4, 8]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-2.5, -7.5, -1]}>
            <capsuleGeometry args={[0.5, 10, 4, 8]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI]} position={[2.5, -5, -1]}>
            <capsuleGeometry args={[0.5, 5, 4, 8]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -2.5, -1]}>
            <capsuleGeometry args={[0.5, 5, 4, 8]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </group>
      </mesh>
      <OrbitControls></OrbitControls>
    </>
  );
};

export default Text;
