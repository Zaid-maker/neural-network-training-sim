'use client';

import React, { useEffect, useRef } from 'react';
import { NeuralNetwork } from '../lib/NeuralNetwork';

interface DecisionBoundaryProps {
    network: NeuralNetwork;
    resolution?: number;
}

export const DecisionBoundary: React.FC<DecisionBoundaryProps> = ({ 
    network,
    resolution = 50
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 300;
        canvas.height = 300;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw decision boundary
        const stepSize = 1 / resolution;
        const imageData = ctx.createImageData(resolution, resolution);

        for (let x = 0; x < resolution; x++) {
            for (let y = 0; y < resolution; y++) {
                const input = [x * stepSize, y * stepSize];
                const output = network.forward(input)[0];
                
                const index = (y * resolution + x) * 4;
                const intensity = Math.floor(output * 255);
                
                // Blue for output close to 0, Red for output close to 1
                imageData.data[index] = intensity; // R
                imageData.data[index + 1] = 0; // G
                imageData.data[index + 2] = 255 - intensity; // B
                imageData.data[index + 3] = 255; // A
            }
        }

        // Scale up the image data to fit canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = resolution;
        tempCanvas.height = resolution;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.putImageData(imageData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= 10; i++) {
            const y = (i / 10) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw axis labels
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';

        // X-axis labels
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * canvas.width;
            const value = (i / 10).toFixed(1);
            ctx.fillText(value, x, canvas.height - 5);
        }

        // Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 10; i++) {
            const y = (i / 10) * canvas.height;
            const value = (1 - i / 10).toFixed(1);
            ctx.fillText(value, 25, y + 4);
        }

        // Draw training points if available
        const trainingPoints = network.getTrainingPoints?.() || [];
        trainingPoints.forEach(point => {
            const [x, y] = point.inputs;
            const target = point.target;
            
            ctx.beginPath();
            ctx.arc(
                x * canvas.width,
                (1 - y) * canvas.height,
                5,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = target > 0.5 ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 255, 0.7)';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        });

    }, [network, resolution]);

    return (
        <div className="bg-white/5 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Decision Boundary</h2>
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    className="border border-gray-300/20 rounded-lg bg-gray-900"
                />
                <div className="mt-2 text-sm text-gray-400 text-center">
                    Input X →
                </div>
                <div 
                    className="absolute -left-6 top-1/2 -rotate-90 text-sm text-gray-400"
                    style={{ transformOrigin: '50% 0' }}
                >
                    Input Y
                </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Output ≈ 1</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Output ≈ 0</span>
                </div>
            </div>
        </div>
    );
};
