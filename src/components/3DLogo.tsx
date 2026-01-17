"use client";

import React, { useLayoutEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);

    useLayoutEffect(() => {

        // resizes model to 10 units
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxAxis = Math.max(size.x, size.y, size.z);
        const desiredSize = 10;
        const scaleFactor = desiredSize / maxAxis;

        scene.scale.setScalar(scaleFactor);

        // material 
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshStandardMaterial({
                    color: "#ffffff",
                    metalness: 1.0,
                    roughness: 0.15,
                    envMapIntensity: 1,
                });
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <primitive
            object={scene}
            // my glb file is modeled flat so i need to rotate it
            rotation={[Math.PI / 2, 0, 0]}
        />
    );
}

function MovingLight() {
    const lightRef = useRef<THREE.SpotLight>(null);

    useFrame((state) => {
        if (!lightRef.current) return;
        const mx = state.pointer.x;
        const my = state.pointer.y;
        const angle = mx * Math.PI;
        const radius = 15;

        lightRef.current.position.set(
            Math.sin(angle) * radius,
            my * 10,
            Math.cos(angle) * radius
        );
        lightRef.current.lookAt(0, 0, 0);
    });

    return (
        <spotLight
            ref={lightRef}
            position={[0, 0, 20]}
            angle={0.4}
            penumbra={1}
            intensity={500}
            color="white"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
        />
    );
}

export default function LogoScene() {
    return (
        <div className="">
            <Canvas
                shadows
                dpr={[1, 2]} // perf cap
                camera={{ position: [0, 0, 25], fov: 35 }}
                gl={{ antialias: true }}
            >
                <Environment preset="city" />
                <MovingLight />
                <Center>
                    <Model url="/logo.glb" />
                </Center>
            </Canvas>
        </div>
    );
}

useGLTF.preload("/logo.glb");