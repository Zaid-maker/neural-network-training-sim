'use client';

import React, { useEffect, useRef } from 'react';

interface TrainingHistoryProps {
    errors: number[];
}

export const TrainingHistory: React.FC<TrainingHistoryProps> = ({ errors }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 600;
        canvas.height = 200;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const y = (i / 4) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        if (errors.length < 2) return;

        // Find max error for scaling
        const maxError = Math.max(...errors);
        const scale = canvas.height / (maxError * 1.1); // Leave 10% margin

        // Draw error line
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.beginPath();

        errors.forEach((error, index) => {
            const x = (index / (errors.length - 1)) * canvas.width;
            const y = canvas.height - (error * scale);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        errors.forEach((error, index) => {
            const x = (index / (errors.length - 1)) * canvas.width;
            const y = canvas.height - (error * scale);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#4ade80';
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';

        // Y-axis labels
        for (let i = 0; i <= 4; i++) {
            const value = (maxError * (1 - i / 4)).toFixed(4);
            const y = (i / 4) * canvas.height;
            ctx.fillText(value, 40, y + 4);
        }

        // X-axis labels
        ctx.textAlign = 'center';
        for (let i = 0; i <= 10; i++) {
            const value = Math.floor((errors.length - 1) * (i / 10));
            const x = (i / 10) * canvas.width;
            ctx.fillText(value.toString(), x, canvas.height - 10);
        }

    }, [errors]);

    return (
        <div className="bg-white/5 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Training History</h2>
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    className="w-full border border-gray-300/20 rounded-lg bg-gray-900"
                />
                <div className="mt-2 text-sm text-gray-400">
                    Training Iterations →
                </div>
                <div 
                    className="absolute -left-6 top-1/2 -rotate-90 text-sm text-gray-400"
                    style={{ transformOrigin: '50% 0' }}
                >
                    Error
                </div>
            </div>
        </div>
    );
};
