/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 .\scene.gltf 
Author: halloween (https://sketchfab.com/yellow09)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/elf-girl-52f2e84961b94760b7805c178890d644
Title: Elf Girl
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("./scene.gltf");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.Rig2lambert23SG}
        />
        <mesh
          geometry={nodes.Object_3.geometry}
          material={materials.Rig2lambert23SG}
        />
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials.lambert22SG}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.lambert22SG}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials.lambert22SG}
        />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials.lambert25SG}
        />
        <mesh
          geometry={nodes.Object_8.geometry}
          material={materials.pasted__lambert2SG}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/scene.gltf");