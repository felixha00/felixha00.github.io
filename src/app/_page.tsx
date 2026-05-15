"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export default function Home() {
    const triggerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: triggerRef,
        offset: ["start start", "end end"],
    });
    const boxX = useTransform(scrollYProgress, [0, 1], [0, 500]);
    const boxRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const riveScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
    const riveRadius = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    // 1. RIVE SETUP
    const { RiveComponent } = useRive({
        src: "https://cdn.rive.app/animations/vehicles.riv", // Replace with your local public/file.riv
        stateMachines: "bumpy", // Name of the state machine in your Rive file
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    return (
        <main className="w-full">
            {/* Spacer Section */}
            <section className="h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold text-black">Scroll Down</h1>
            </section>

            {/* Animation Section */}
            <section ref={triggerRef} className="h-[200vh] bg-black relative">
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

                    <motion.div
                        className="box w-32 h-32 bg-blue-500 mb-10"
                        style={{ x: boxX, rotate: boxRotate }}
                    />

                    {/* Rive Component */}
                    <motion.div
                        className="rive-container w-[500px] h-[300px] bg-white"
                        style={{ scale: riveScale, borderRadius: riveRadius }}
                    >
                        <RiveComponent />
                    </motion.div>

                </div>
            </section>

            {/* Footer Section */}
            <section className="h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold text-black">End</h1>
            </section>
        </main>
    );
}
