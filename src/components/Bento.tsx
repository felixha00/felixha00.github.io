"use client";

import { useContainerWidth, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function Bento() {
    const { width, containerRef, mounted } = useContainerWidth();

    const layouts = {
        lg: [{ i: "1", x: 0, y: 0, w: 2, h: 2 }],
        md: [{ i: "1", x: 0, y: 0, w: 2, h: 2 }]
    };

    return (
        <div ref={containerRef}>
            {mounted && (
                <Responsive
                    // className="[&>div]:rounded-4xl"
                    layouts={layouts}
                    breakpoints={{ '2xl': 1536, xl: 1280, lg: 1024, md: 768, sm: 640, xs: 475 }}
                    cols={{ "2xl": 16, xl: 14, lg: 12, md: 9, sm: 6, xs: 3 }}
                    // positionStrategy={{ 
                    //     type: "absolute",
                    // }}
                    // compactor={{
                    //     allowOverlap: false,
                    //     // allowOverlap: true,
                    //     compact(layout, cols) {
                    //         return layout;
                    //     },
                    //     type: "wrap"
                    // }}
                    // dragConfig={{
                    //     bounded: true,

                    // }}
                    width={width}
                    resizeConfig={{
                        handles: ["se", "ne", "sw", "nw"],
                    }}
                >
                    <div key="1" className="bg-white">1</div>
                    <div key="2" className="bg-white">2</div>
                    <div key="3" className="bg-white">3</div>
                </Responsive>
            )}
        </div>
    );
}
