"use client";

import React, { useLayoutEffect, useRef, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Center, useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    // Clone the scene so we don't mutate the cached version across re-renders
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    const { viewport } = useThree();
    const groupRef = useRef<THREE.Group>(null);

    useLayoutEffect(() => {
        if (!groupRef.current) return;

        // 1. Reset scale to default (1,1,1) before measuring. 
        // This prevents the "compounding scale" bug where it gets infinitely larger/smaller.
        groupRef.current.scale.set(1, 1, 1);

        // 2. Measure the bounding box of the group (which contains the centered model)
        const box = new THREE.Box3().setFromObject(groupRef.current);
        const size = new THREE.Vector3();
        box.getSize(size);

        // 3. Calculate scale to fill the viewport width
        // We use viewport.width (the full width of the 3D scene at Z=0)
        // '0.9' adds a small margin so it doesn't clip the edges immediately
        const targetWidth = viewport.width * 0.9;

        // Prevent divide by zero errors if model hasn't loaded
        if (size.x > 0) {
            const scaleFactor = targetWidth / size.x;
            groupRef.current.scale.setScalar(scaleFactor);
        }

        // 4. Apply materials (Doing this on the clone is safe)
        clonedScene.traverse((child) => {
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
    }, [clonedScene, viewport.width, viewport.height]);

    return (
        // We apply the scale to this wrapper group
        <group ref={groupRef}>
            <Center>
                <primitive
                    object={clonedScene}
                    rotation={[Math.PI / 2, 0, 0]}
                />
            </Center>
        </group>
    );
}

export default function LogoScene() {
    return (
        <div className="w-full h-screen bg-transparent">
            <Canvas
                shadows
                dpr={[1, 2]}
                // Position camera closer so "filling the screen" doesn't require massive scaling
                camera={{ position: [0, 0, 10], fov: 35 }}
                gl={{ antialias: true }}
            >
                <Environment preset="city" />

                {/* Fixed Lights */}
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={500}
                    castShadow
                />
                <ambientLight intensity={0.5} />

                <Model url="/logo.glb" />

                <OrbitControls
                    makeDefault
                    autoRotate
                    autoRotateSpeed={2}
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI}
                />
            </Canvas>
        </div>
    );
}

useGLTF.preload("/logo.glb");