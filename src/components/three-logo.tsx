"use client";

import React, { useMemo, useRef, useState, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Environment, ContactShadows, AsciiRenderer } from "@react-three/drei";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

function RotatingEnvironment() {
    const { scene } = useThree();
    const rotation = useRef(0);

    useFrame((_, delta) => {
        if (scene.environment) {
            rotation.current += delta * 1; // speed
            // Enable matrix transform
            scene.environment.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment.matrixAutoUpdate = false;
            if (!scene.environment.userData.rotationMatrix) {
                scene.environment.userData.rotationMatrix = new THREE.Matrix4();
            }
            scene.environment.userData.rotationMatrix.makeRotationY(rotation.current);
            scene.environment.matrix.copy(scene.environment.userData.rotationMatrix);
        }
    });

    return <Environment preset="dawn" background={false} />;
}
// function CameraResetController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
//     const { camera } = useThree();
//     const defaultPos = useMemo(() => new THREE.Vector3(0, 0, 500), []);
//     const resetInProgress = useRef(false);

//     useFrame(() => {
//         if (resetInProgress.current) {
//             camera.position.lerp(defaultPos, 0.05);
//             camera.lookAt(0, 0, 0);
//             if (camera.position.distanceTo(defaultPos) < 0.1) {
//                 camera.position.copy(defaultPos);
//                 resetInProgress.current = false;
//             }
//         }
//     });

//     // Hook OrbitControls end event inside Canvas
//     useEffect(() => {
//         const controls = controlsRef.current;
//         if (!controls) return;
//         const handleEnd = () => { resetInProgress.current = true; };
//         controls.addEventListener("end", handleEnd);
//         return () => controls.removeEventListener("end", handleEnd);
//     }, [controlsRef]);

//     return null;
// }

function CameraResetController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
    const { camera } = useThree();
    const radius = 500; // distance from origin
    const defaultAngle = 0; // angle in radians
    const resetInProgress = useRef(false);
    const isDragging = useRef(false);
    const currentAngle = useRef(defaultAngle);

    useFrame(() => {
        if (controlsRef.current) {
            // update current angle based on camera position
            const pos = camera.position;
            currentAngle.current = Math.atan2(pos.x, pos.z);
        }

        if (resetInProgress.current && !isDragging.current) {
            // interpolate angle back to default
            const angleDiff = defaultAngle - currentAngle.current;
            const step = angleDiff * 0.05; // speed factor
            currentAngle.current += step;

            // update camera position, always at fixed radius and y=0
            camera.position.x = Math.sin(currentAngle.current) * radius;
            camera.position.z = Math.cos(currentAngle.current) * radius;
            camera.position.y = 0;
            camera.lookAt(0, 0, 0);

            if (Math.abs(angleDiff) < 0.001) {
                currentAngle.current = defaultAngle;
                camera.position.x = 0;
                camera.position.z = radius;
                resetInProgress.current = false;
            }
        }
    });

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        const handleStart = () => { isDragging.current = true; };
        const handleEnd = () => {
            isDragging.current = false;
            resetInProgress.current = true;
        };

        controls.addEventListener("start", handleStart);
        controls.addEventListener("end", handleEnd);

        return () => {
            controls.removeEventListener("start", handleStart);
            controls.removeEventListener("end", handleEnd);
        };
    }, [controlsRef]);

    return null;
}


// Interactive 3D Logo mesh with physics body
function LogoBody({ svgUrl }: { svgUrl: string }) {
    // ---- MOVE useLoader inside Canvas scope ----
    const data = useLoader(SVGLoader as any, svgUrl) as any;
    const geom = useMemo(() => {
        const paths = data.paths as THREE.ShapePath[];
        const mat = new THREE.Matrix4();

        const SCALE = 0.15;
        mat.multiply(new THREE.Matrix4().makeScale(SCALE, -SCALE, -SCALE));

        const defaultOpts: THREE.ExtrudeGeometryOptions = {
            depth: 75,
            bevelEnabled: true,
            bevelThickness: 3,
            bevelSize: 12,
            bevelSegments: 10,
            curveSegments: 24,
            steps: 1,
        };

        const parts: THREE.BufferGeometry[] = [];
        for (const p of paths) {
            const shapes = SVGLoader.createShapes(p);
            for (const s of shapes) {
                const g = new THREE.ExtrudeGeometry(s, defaultOpts);
                g.applyMatrix4(mat);
                parts.push(g);
            }
        }

        const merged = mergeGeometries(parts, false);
        merged.computeVertexNormals();
        merged.center();
        return merged;
    }, [data]);

    const [hovered, setHovered] = useState(false);

    return (
        <mesh
            geometry={geom}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => setHovered(false)}
            receiveShadow
        >
            <meshStandardMaterial metalness={1} roughness={0.075} />
        </mesh>
    );
}

function Loader() {
    return (
        <Html center>
            <div className="px-4 py-2 rounded-2xl bg-white/80 text-gray-900 shadow">Loading SVG…</div>
        </Html>
    );
}

export default function ThreeLogo({
    svgUrl = "/logo-white.svg",
    ascii = false,
    className = "w-full h-full",
}: {
    svgUrl?: string;
    ascii?: boolean;
    className?: string;
}) {
    const [wireframe, setWireframe] = useState(false);
    const [asciiMode, setAsciiMode] = useState(ascii);

    const controlsRef = useRef<any>(null);

    return (
        <div className={`relative ${className}`}>
            <Canvas shadows camera={{ position: [0, 0, 500], fov: 50, zoom: 5, far: 2000 }}>
                <Suspense fallback={<Loader />}>
                    <CameraResetController controlsRef={controlsRef} />
                    {/* <RotatingEnvironment /> */}
                    <Environment preset="dawn" background={false} />
                    <LogoBody svgUrl={svgUrl} />
                    <ContactShadows position={[0, 0, 0]} scale={10} blur={2.5} opacity={0.5} />

                    <OrbitControls
                        ref={controlsRef}
                        enableDamping
                        dampingFactor={0.08}
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 2} // lock vertical rotation
                        maxPolarAngle={Math.PI / 2} // lock vertical rotation
                    />
                    {/* <CameraResetController controlsRef={controlsRef} /> */}

                    {asciiMode && (
                        <AsciiRenderer invert={false} resolution={0.15} bgColor="transparent" />
                    )}
                </Suspense>
            </Canvas>

            {/* UI Overlay */}
            <div className="pointer-events-auto absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-2 rounded-2xl shadow text-white">
                <button
                    className="text-sm px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20"
                    onClick={() => setAsciiMode((v) => !v)}
                >
                    {asciiMode ? "Disable ASCII" : "Enable ASCII"}
                </button>
                <button
                    className="text-sm px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20"
                    onClick={() => setWireframe((v) => !v)}
                >
                    {wireframe ? "Solid" : "Wireframe"}
                </button>
            </div>

            {wireframe && (
                <style>{`canvas { image-rendering: auto; }`}</style>
            )}
        </div>
    );
}