"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

// Register plugins globally
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

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

    // 2. GSAP SETUP
    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1, // Smooth scrubbing effect
                },
            });

            tl.to(".box", {
                rotation: 360,
                x: 500,
                duration: 2,
                ease: "power2.inOut",
            });

            // You can even animate the Rive container with GSAP
            tl.to(".rive-container", {
                scale: 1.5,
                borderRadius: "50%",
            }, "<");
        },
        { scope: containerRef }
    );

    return (
        <main ref={containerRef} className="w-full">
            {/* Spacer Section */}
            <section className="h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold text-black">Scroll Down</h1>
            </section>

            {/* Animation Section */}
            <section ref={triggerRef} className="h-[200vh] bg-black relative">
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

                    <div className="box w-32 h-32 bg-blue-500 mb-10" />

                    {/* Rive Component */}
                    <div className="rive-container w-[500px] h-[300px] bg-white">
                        <RiveComponent />
                    </div>

                </div>
            </section>

            {/* Footer Section */}
            <section className="h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold text-black">End</h1>
            </section>
        </main>
    );
}