"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { NeuralNetwork } from "../lib/NeuralNetwork";

interface NeuralNetworkVisualizerProps {
  network: NeuralNetwork;
}

interface HoverState {
  type: "neuron" | "connection";
  layer?: number;
  neuron?: number;
  fromLayer?: number;
  fromNeuron?: number;
  toLayer?: number;
  toNeuron?: number;
  value?: number;
  weight?: number;
  isInput?: boolean;
  isOutput?: boolean;
}

export const NeuralNetworkVisualizer: React.FC<
  NeuralNetworkVisualizerProps
> = ({ network }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [networkState, setNetworkState] = useState(network.getNetworkState());
  const [mounted, setMounted] = useState(false);
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setNetworkState(network.getNetworkState());
  }, [network, mounted]);

  const getActivationValue = useCallback(
    (layerIndex: number, neuronIndex: number): number => {
      if (typeof networkState.activation === "string") return 0;
      // Input layer (index 0) has no activation, it's the input values
      if (layerIndex === 0) {
        return 0;
      }
      // For hidden and output layers, use activation values
      return networkState.activation?.[layerIndex]?.[neuronIndex] ?? 0;
    },
    [networkState]
  );

  const getNeuronColor = useCallback(
    (layerIndex: number, neuronIndex: number): string => {
      const value = getActivationValue(layerIndex, neuronIndex);

      // Use different color schemes for different layer types
      if (layerIndex === 0) {
        // Input layer: Blue gradient
        const intensity = Math.floor(value * 255);
        return `rgb(0, ${intensity}, ${intensity})`;
      } else if (layerIndex === networkState.layers.length - 1) {
        // Output layer: Green gradient
        const intensity = Math.floor(value * 255);
        return `rgb(0, ${intensity}, 0)`;
      } else {
        // Hidden layers: Purple gradient
        const intensity = Math.floor(value * 255);
        return `rgb(${intensity}, 0, ${intensity})`;
      }
    },
    [networkState, getActivationValue]
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Calculate the scale factor between canvas internal size and displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Get mouse position in canvas coordinates
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const { layers, weights } = networkState;
    const layerSpacing = canvas.width / (layers.length + 1);
    const neuronRadius = 15;

    // Check if hovering over neurons
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      const layerSize = layers[layerIndex];
      const layerX = (layerIndex + 1) * layerSpacing;

      for (let neuronIndex = 0; neuronIndex < layerSize; neuronIndex++) {
        const neuronY = (neuronIndex + 1) * (canvas.height / (layerSize + 1));
        const distance = Math.sqrt(
          Math.pow(x - layerX, 2) + Math.pow(y - neuronY, 2)
        );

        if (distance <= neuronRadius) {
          const value = getActivationValue(layerIndex, neuronIndex);
          setHoverState({
            type: "neuron",
            layer: layerIndex,
            neuron: neuronIndex,
            value,
            isInput: layerIndex === 0,
            isOutput: layerIndex === layers.length - 1,
          });
          setTooltipPosition({ x: event.clientX, y: event.clientY });
          return;
        }
      }
    }

    // Check if hovering over connections
    for (let i = 0; i < weights.length; i++) {
      const leftLayer = layers[i];
      const rightLayer = layers[i + 1];

      for (let j = 0; j < rightLayer; j++) {
        for (let k = 0; k < leftLayer; k++) {
          const startX = (i + 1) * layerSpacing;
          const startY = (k + 1) * (canvas.height / (leftLayer + 1));
          const endX = (i + 2) * layerSpacing;
          const endY = (j + 1) * (canvas.height / (rightLayer + 1));

          // Check if point is near the line
          const distance = distanceToLine(x, y, startX, startY, endX, endY);
          if (distance < 5 * Math.max(scaleX, scaleY)) {
            // Adjust hit area based on scale
            setHoverState({
              type: "connection",
              fromLayer: i,
              fromNeuron: k,
              toLayer: i + 1,
              toNeuron: j,
              weight: weights[i][j][k],
            });
            setTooltipPosition({ x: event.clientX, y: event.clientY });
            return;
          }
        }
      }
    }

    setHoverState(null);
    setTooltipPosition(null);
  };

  const handleMouseLeave = () => {
    setHoverState(null);
    setTooltipPosition(null);
  };

  const distanceToLine = (
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
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
      const neuronDiameter = neuronRadius * 2;

      // Ensure neurons don't overlap
      if (neuronSpacing < neuronDiameter) {
        console.warn("Neurons may overlap due to insufficient vertical space");
      }

      // Draw connections
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

            // Highlight hovered connection
            if (
              hoverState?.type === "connection" &&
              hoverState.fromLayer === i &&
              hoverState.fromNeuron === k &&
              hoverState.toLayer === i + 1 &&
              hoverState.toNeuron === j
            ) {
              ctx.lineWidth = 3;
              ctx.strokeStyle = "#00ff00";
            } else {
              ctx.lineWidth = 1;
              const alpha = Math.abs(weight);
              // Use different colors for positive and negative weights
              ctx.strokeStyle =
                weight > 0
                  ? `rgba(0, 255, 0, ${alpha})` // Green for positive
                  : `rgba(255, 0, 0, ${alpha})`; // Red for negative
            }
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

          // Highlight hovered neuron or use color based on layer type and activation
          if (
            hoverState?.type === "neuron" &&
            hoverState.layer === layerIndex &&
            hoverState.neuron === i
          ) {
            ctx.fillStyle = "#00ff00";
          } else {
            ctx.fillStyle = getNeuronColor(layerIndex, i);
          }

          ctx.fill();
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Add layer labels
          if (i === 0) {
            ctx.fillStyle = "#fff";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(
              layerIndex === 0
                ? "Input"
                : layerIndex === layers.length - 1
                ? "Output"
                : `Hidden ${layerIndex}`,
              x,
              canvas.height - 10
            );
          }
        }
      });
    };

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    drawNetwork();
  }, [networkState, mounted, hoverState, getNeuronColor]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative">
      <canvas
        ref={canvasRef}
        className="w-full border border-gray-300 rounded-lg bg-gray-900"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltipPosition && hoverState && (
        <div
          className="absolute bg-black/80 text-white p-2 rounded text-sm pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          {hoverState.type === "neuron" ? (
            <>
              <div>
                Layer: {hoverState.layer} (
                {hoverState.isInput
                  ? "Input"
                  : hoverState.isOutput
                  ? "Output"
                  : "Hidden"}
                )
              </div>
              <div>Neuron: {hoverState.neuron}</div>
              <div>
                {hoverState.isInput ? "Input" : "Activation"}:
                {hoverState.value === undefined
                  ? "N/A"
                  : hoverState.value.toFixed(4)}
                {hoverState.isOutput
                  ? ""
                  : ` (${networkState.activation || "N/A"})`}
              </div>
            </>
          ) : (
            <>
              <div>
                From: Layer {hoverState.fromLayer}, Neuron{" "}
                {hoverState.fromNeuron}
              </div>
              <div>
                To: Layer {hoverState.toLayer}, Neuron {hoverState.toNeuron}
              </div>
              <div>Weight: {hoverState.weight?.toFixed(4)}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
