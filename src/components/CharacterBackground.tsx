"use client"

import React, { useEffect, useRef } from 'react';

const CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%&@#<>[]{}()";
const FONT_SIZE = 14;
const CELL_PADDING = 10;
const COLOR_PALETTE = ['#1a1a1a', '#222222', '#151515', '#0f0f0f'];

const CharacterBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const charsRef = useRef<string[][]>([]);
    const lastUpdateRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const initGrid = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const cols = Math.ceil(canvas.width / (FONT_SIZE + CELL_PADDING));
            const rows = Math.ceil(canvas.height / (FONT_SIZE + CELL_PADDING));

            const newGrid: string[][] = [];
            for (let r = 0; r < rows; r++) {
                const row: string[] = [];
                for (let c = 0; c < cols; c++) {
                    row.push(CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]);
                }
                newGrid.push(row);
            }
            charsRef.current = newGrid;
        };

        const updateGrid = () => {
            const rows = charsRef.current.length;
            if (rows === 0) return;
            const cols = charsRef.current[0].length;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    // 30% chance to change a character every update cycle for a more dynamic look
                    // or change all of them if the prompt specifically wants all to change every second
                    // Let's go with a high turnover for that "cipher" look
                    if (Math.random() > 0.4) {
                        charsRef.current[r][c] = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
                    }
                }
            }
        };

        const render = (time: number) => {
            // Logic for updating every 1000ms (1 second)
            if (time - lastUpdateRef.current >= 1000) {
                updateGrid();
                lastUpdateRef.current = time;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

            const rows = charsRef.current.length;
            if (rows > 0) {
                const cols = charsRef.current[0].length;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const char = charsRef.current[r][c];
                        const x = c * (FONT_SIZE + CELL_PADDING);
                        const y = r * (FONT_SIZE + CELL_PADDING) + FONT_SIZE;

                        // Subtle flickering/depth effect
                        ctx.fillStyle = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
                        // ctx.fillStyle = "#ffffff"
                        ctx.fillText(char, x, y);
                    }
                }
            }

            requestAnimationFrame(render);
        };

        initGrid();
        window.addEventListener('resize', initGrid);
        const animationFrame = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', initGrid);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-50"
        />
    );
};

export default CharacterBackground;
