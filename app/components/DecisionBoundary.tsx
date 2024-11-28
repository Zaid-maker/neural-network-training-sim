'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NeuralNetwork } from '../lib/NeuralNetwork';

interface DecisionBoundaryProps {
  network: NeuralNetwork;
  resolution?: number;
  showGradients?: boolean;
}

export const DecisionBoundary: React.FC<DecisionBoundaryProps> = ({
  network,
  resolution = 50,
  showGradients = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; value: number } | null>(
    null
  );

  const drawGradients = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const gradients = network.getGradientField(0, 1, 0, 1, 10);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;

      gradients.forEach(({ x, y, dx, dy }) => {
        const canvasX = x * canvas.width;
        const canvasY = (1 - y) * canvas.height;

        // Normalize gradient vector
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        const scale = 15; // Arrow length

        if (magnitude > 0) {
          const normalizedDx = (dx / magnitude) * scale;
          const normalizedDy = (dy / magnitude) * scale;

          // Draw arrow
          ctx.beginPath();
          ctx.moveTo(canvasX, canvasY);
          ctx.lineTo(canvasX + normalizedDx, canvasY - normalizedDy);

          // Arrow head
          const headLength = 5;
          const angle = Math.atan2(-normalizedDy, normalizedDx);
          ctx.lineTo(
            canvasX + normalizedDx - headLength * Math.cos(angle - Math.PI / 6),
            canvasY - normalizedDy + headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(canvasX + normalizedDx, canvasY - normalizedDy);
          ctx.lineTo(
            canvasX + normalizedDx - headLength * Math.cos(angle + Math.PI / 6),
            canvasY - normalizedDy + headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      });
    },
    [network]
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / canvas.width;
    const y = 1 - (event.clientY - rect.top) / canvas.height;

    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      const value = network.predictPoint(x, y);
      setHoverPoint({ x, y, value });
    } else {
      setHoverPoint(null);
    }
  };

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
    const points = network.getDecisionBoundary(0, 1, 0, 1, resolution);
    const imageData = ctx.createImageData(resolution, resolution);

    points.forEach((point) => {
      const x = Math.floor(point.x * (resolution - 1));
      const y = Math.floor((1 - point.y) * (resolution - 1));
      const index = (y * resolution + x) * 4;
      const intensity = Math.floor(point.value * 255);

      // Blue for output close to 0, Red for output close to 1
      imageData.data[index] = intensity; // R
      imageData.data[index + 1] = 0; // G
      imageData.data[index + 2] = 255 - intensity; // B
      imageData.data[index + 3] = 255; // A
    });

    // Scale up the image data to fit canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = resolution;
    tempCanvas.height = resolution;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.putImageData(imageData, 0, 0);
    ctx.imageSmoothingEnabled = true;
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

    // Draw decision boundary contour
    const contourPoints = points.filter((p) => Math.abs(p.value - 0.5) < 0.1);
    if (contourPoints.length > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      contourPoints.forEach((point, i) => {
        const x = point.x * canvas.width;
        const y = (1 - point.y) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw gradients if enabled
    if (showGradients) {
      drawGradients(ctx, canvas);
    }
  }, [network, resolution, showGradients, drawGradients]);

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <h2 className="mb-4 text-xl font-semibold">Decision Boundary</h2>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-gray-300/20 bg-gray-900"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoverPoint(null);
          }}
          onMouseMove={handleMouseMove}
        />
        <div className="mt-2 text-center text-sm text-gray-400">Input X →</div>
        <div
          className="absolute -left-6 top-1/2 -rotate-90 text-sm text-gray-400"
          style={{ transformOrigin: '50% 0' }}
        >
          Input Y
        </div>
        {isHovering && hoverPoint && (
          <div className="absolute right-2 top-2 rounded bg-black/80 p-2 text-sm">
            <div>X: {hoverPoint.x.toFixed(3)}</div>
            <div>Y: {hoverPoint.y.toFixed(3)}</div>
            <div>Output: {hoverPoint.value.toFixed(3)}</div>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <span>Output ≈ 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span>Output ≈ 0</span>
        </div>
        {showGradients && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-0.5 w-4 bg-white/40"></div>
            <span>Gradient direction</span>
          </div>
        )}
      </div>
    </div>
  );
};
