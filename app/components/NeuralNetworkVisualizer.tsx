'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NeuralNetwork } from '../lib/NeuralNetwork';

interface NeuralNetworkVisualizerProps {
    network: NeuralNetwork;
}

export const NeuralNetworkVisualizer: React.FC<NeuralNetworkVisualizerProps> = ({ network }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [networkState, setNetworkState] = useState(network.getNetworkState());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        setNetworkState(network.getNetworkState());
    }, [network, mounted]);

    useEffect(() => {
        if (!mounted) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawNetwork = () => {
            const { layers, weights } = networkState;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate dimensions
            const layerSpacing = canvas.width / (layers.length + 1);
            const maxNeurons = Math.max(...layers);
            const neuronSpacing = canvas.height / (maxNeurons + 1);
            const neuronRadius = 15;

            // Draw connections
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;

            for (let i = 0; i < weights.length; i++) {
                const leftLayer = layers[i];
                const rightLayer = layers[i + 1];
                
                for (let j = 0; j < rightLayer; j++) {
                    for (let k = 0; k < leftLayer; k++) {
                        const weight = weights[i][j][k];
                        const startX = (i + 1) * layerSpacing;
                        const startY = (k + 1) * (canvas.height / (leftLayer + 1));
                        const endX = (i + 2) * layerSpacing;
                        const endY = (j + 1) * (canvas.height / (rightLayer + 1));

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        
                        // Weight visualization
                        const alpha = Math.abs(weight);
                        ctx.strokeStyle = weight > 0 ? `rgba(0, 255, 0, ${alpha})` : `rgba(255, 0, 0, ${alpha})`;
                        ctx.stroke();
                    }
                }
            }

            // Draw neurons
            layers.forEach((layerSize, layerIndex) => {
                const x = (layerIndex + 1) * layerSpacing;
                
                for (let i = 0; i < layerSize; i++) {
                    const y = (i + 1) * (canvas.height / (layerSize + 1));
                    
                    ctx.beginPath();
                    ctx.arc(x, y, neuronRadius, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    ctx.strokeStyle = '#000';
                    ctx.stroke();
                }
            });
        };

        // Set canvas size
        canvas.width = 800;
        canvas.height = 400;
        
        drawNetwork();
    }, [networkState, mounted]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <canvas
                ref={canvasRef}
                className="w-full border border-gray-300 rounded-lg bg-gray-900"
            />
        </div>
    );
};
