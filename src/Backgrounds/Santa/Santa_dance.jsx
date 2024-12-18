/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/santa_salsa_dancing_2/santa_dance.gltf 
Author: deveesreemurugan (https://sketchfab.com/deveesreemurugan)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/santa-salsa-dancing-2-322b5180a29c4513a5ee6a3e3bf0cf78
Title: Santa Salsa Dancing 2
*/

import React, { useEffect } from "react";
import { useGraph } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export default function Santa(props) {
  const group = React.useRef();
  const { scene, animations } = useGLTF(
    "/santa_salsa_dancing_2/santa_dance.gltf"
  );
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    actions[names[0]].reset().fadeIn(0.5).play();
  }, []);

  return (
    <>
      <group scale={1.5} ref={group} {...props} dispose={null}>
        <group name="Sketchfab_Scene">
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
            <group
              name="d348695b691e427d97c476326011b1dffbx"
              rotation={[Math.PI / 2, 0, 0]}
            >
              <group name="Object_2">
                <group name="RootNode">
                  <group name="Object_4">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_6" />
                    <group name="Object_13" />
                    <group name="Object_15" />
                    <group name="Object_17" />
                    <group name="Object_19" />
                    <group name="group_barbes" />
                    <group name="group_man" />
                    <group name="group_eyes_little" />
                    <group name="group_eyes" />
                    <group name="group_White" />
                    <group name="group_Default" />
                    <group name="group_ongles" />
                    <group name="group_main" />
                    <group name="group_boots" />
                    <group name="group_boots_semelle" />
                    <group name="group_pantalon" />
                    <group name="group_Ceinturon" />
                    <group name="group_ceinturon_boucle" />
                    <skinnedMesh
                      name="Object_7"
                      geometry={nodes.Object_7.geometry}
                      material={materials.barbesmat}
                      skeleton={nodes.Object_7.skeleton}
                    />
                    <skinnedMesh
                      name="Object_8"
                      geometry={nodes.Object_8.geometry}
                      material={materials.manmat}
                      skeleton={nodes.Object_8.skeleton}
                    />
                    <skinnedMesh
                      name="Object_9"
                      geometry={nodes.Object_9.geometry}
                      material={materials.eyes_littlemat}
                      skeleton={nodes.Object_9.skeleton}
                    />
                    <skinnedMesh
                      name="Object_10"
                      geometry={nodes.Object_10.geometry}
                      material={materials.eyesmat}
                      skeleton={nodes.Object_10.skeleton}
                    />
                    <skinnedMesh
                      name="Object_11"
                      geometry={nodes.Object_11.geometry}
                      material={materials.Whitemat}
                      skeleton={nodes.Object_11.skeleton}
                    />
                    <skinnedMesh
                      name="Object_12"
                      geometry={nodes.Object_12.geometry}
                      material={materials.Defaultmat}
                      skeleton={nodes.Object_12.skeleton}
                    />
                    <skinnedMesh
                      name="Object_14"
                      geometry={nodes.Object_14.geometry}
                      material={materials.onglesmat}
                      skeleton={nodes.Object_14.skeleton}
                    />
                    <skinnedMesh
                      name="Object_16"
                      geometry={nodes.Object_16.geometry}
                      material={materials.mainmat}
                      skeleton={nodes.Object_16.skeleton}
                    />
                    <skinnedMesh
                      name="Object_18"
                      geometry={nodes.Object_18.geometry}
                      material={materials.bootsmat}
                      skeleton={nodes.Object_18.skeleton}
                    />
                    <skinnedMesh
                      name="Object_20"
                      geometry={nodes.Object_20.geometry}
                      material={materials.boots_semellemat}
                      skeleton={nodes.Object_20.skeleton}
                    />
                    <skinnedMesh
                      name="Object_21"
                      geometry={nodes.Object_21.geometry}
                      material={materials.pantalonmat}
                      skeleton={nodes.Object_21.skeleton}
                    />
                    <skinnedMesh
                      name="Object_22"
                      geometry={nodes.Object_22.geometry}
                      material={materials.Ceinturonmat}
                      skeleton={nodes.Object_22.skeleton}
                    />
                    <skinnedMesh
                      name="Object_23"
                      geometry={nodes.Object_23.geometry}
                      material={materials.ceinturon_bouclemat}
                      skeleton={nodes.Object_23.skeleton}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
      <PerspectiveCamera position={[0, 0, 7]} target={[0, 0, 0]} makeDefault />
      <OrbitControls target={[0, 1.5, 0]} />
      <Environment preset="sunset" />
    </>
  );
}

useGLTF.preload("/santa_dance.gltf");
