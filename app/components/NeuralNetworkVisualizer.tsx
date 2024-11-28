'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { NeuralNetwork } from '../lib/NeuralNetwork';

interface NeuralNetworkVisualizerProps {
  network: NeuralNetwork;
}

interface HoverState {
  type: 'neuron' | 'connection';
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

interface TooltipPosition {
  x: number;
  y: number;
  boundingRect: DOMRect;
}

export const NeuralNetworkVisualizer: React.FC<NeuralNetworkVisualizerProps> = ({ network }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [networkState, setNetworkState] = useState(network.getNetworkState());
  const [mounted, setMounted] = useState(false);
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const hoverDebounceRef = useRef<number>();
  const renderRequestRef = useRef<number>();
  const [detailLevel, setDetailLevel] = useState<'high' | 'medium' | 'low'>('high');

  // Memoize network dimensions
  const networkDimensions = useMemo(() => {
    const maxNeuronsPerLayer = Math.max(...networkState.layers);
    return {
      isLargeNetwork: maxNeuronsPerLayer > 50 || networkState.layers.length > 10,
      maxNeuronsPerLayer,
      totalNeurons: networkState.layers.reduce((sum, count) => sum + count, 0),
      totalConnections: networkState.weights.reduce((sum, layer) => 
        sum + layer.reduce((layerSum, neuron) => layerSum + neuron.length, 0), 0)
    };
  }, [networkState.layers, networkState.weights]);

  // Adaptive rendering settings based on network size
  const renderSettings = useMemo(() => {
    const { isLargeNetwork, maxNeuronsPerLayer, totalConnections } = networkDimensions;
    
    return {
      neuronRadius: isLargeNetwork ? 6 : 15,
      connectionOpacityMultiplier: Math.min(1, 5000 / totalConnections),
      connectionWidth: isLargeNetwork ? 0.5 : 1,
      drawLabels: !isLargeNetwork,
      batchSize: maxNeuronsPerLayer > 100 ? 50 : maxNeuronsPerLayer > 50 ? 25 : 10,
      cullingThreshold: 0.01
    };
  }, [networkDimensions]);

  // Initialize offscreen canvas
  useEffect(() => {
    if (typeof window !== 'undefined' && !offscreenCanvasRef.current) {
      const canvas = document.createElement('canvas');
      offscreenCanvasRef.current = canvas;
    }
    return () => {
      if (renderRequestRef.current) {
        cancelAnimationFrame(renderRequestRef.current);
      }
    };
  }, []);

  // Update detail level based on network size and performance
  useEffect(() => {
    const { isLargeNetwork, totalNeurons, totalConnections } = networkDimensions;
    
    if (totalConnections > 10000 || totalNeurons > 1000) {
      setDetailLevel('low');
    } else if (isLargeNetwork) {
      setDetailLevel('medium');
    } else {
      setDetailLevel('high');
    }
  }, [networkDimensions]);

  const getActivationValue = useCallback(
    (layerIndex: number, neuronIndex: number): number => {
      if (typeof networkState.activation === 'string') return 0;
      // Input layer (index 0) has no activation, it's the input values
      if (layerIndex === 0) {
        if (!Array.isArray(networkState.inputValues)) return 0;
        return networkState.inputValues[neuronIndex] ?? 0;
      }
      // For hidden and output layers, use activation values
      return networkState.activationValues?.[layerIndex - 1]?.[neuronIndex] ?? 0;
    },
    [networkState]
  );

  const getNeuronColor = useCallback(
    (layerIndex: number, neuronIndex: number): string => {
      const value = getActivationValue(layerIndex, neuronIndex);
      const intensity = Math.floor((Math.tanh(value) + 1) * 127.5); // Scale to 0-255

      // Use different color schemes for different layer types
      if (layerIndex === 0) {
        // Input layer: Blue gradient
        return `rgb(0, ${intensity}, ${intensity})`;
      } else if (layerIndex === networkState.layers.length - 1) {
        // Output layer: Green gradient
        return `rgb(0, ${intensity}, 0)`;
      } else {
        // Hidden layers: Purple gradient
        return `rgb(${intensity}, 0, ${intensity})`;
      }
    },
    [networkState, getActivationValue]
  );

  const updateHoverState = useCallback((newState: HoverState | null, event: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoverDebounceRef.current) {
      window.clearTimeout(hoverDebounceRef.current);
    }

    hoverDebounceRef.current = window.setTimeout(() => {
      setHoverState(newState);
      if (newState && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = Math.min(
          Math.max(event.clientX + 10, containerRect.left + 10),
          containerRect.right - 200
        );
        const y = Math.min(
          Math.max(event.clientY + 10, containerRect.top + 10),
          containerRect.bottom - 100
        );
        setTooltipPosition({ x, y, boundingRect: containerRect });
      } else {
        setTooltipPosition(null);
      }
    }, 50); // 50ms debounce
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate the scale factor between canvas internal size and displayed size
    const scaleX = canvas.width / (rect.width * dpr);
    const scaleY = canvas.height / (rect.height * dpr);

    // Get mouse position in canvas coordinates
    const x = (event.clientX - rect.left) * scaleX * dpr;
    const y = (event.clientY - rect.top) * scaleY * dpr;

    const { layers, weights } = networkState;
    const layerSpacing = canvas.width / (layers.length + 1);
    const neuronRadius = 15;

    // Check if hovering over neurons
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      const layerSize = layers[layerIndex];
      const layerX = (layerIndex + 1) * layerSpacing;

      for (let neuronIndex = 0; neuronIndex < layerSize; neuronIndex++) {
        const neuronY = (neuronIndex + 1) * (canvas.height / (layerSize + 1));
        const distance = Math.sqrt(Math.pow(x - layerX, 2) + Math.pow(y - neuronY, 2));

        if (distance <= neuronRadius * 1.5) { // Increased hit area
          const value = getActivationValue(layerIndex, neuronIndex);
          updateHoverState({
            type: 'neuron',
            layer: layerIndex,
            neuron: neuronIndex,
            value,
            isInput: layerIndex === 0,
            isOutput: layerIndex === layers.length - 1,
          }, event);
          return;
        }
      }
    }

    // Check if hovering over connections
    const connectionHitArea = 8 * Math.max(scaleX, scaleY) * dpr;
    
    for (let i = 0; i < weights.length; i++) {
      const leftLayer = layers[i];
      const rightLayer = layers[i + 1];

      for (let j = 0; j < rightLayer; j++) {
        for (let k = 0; k < leftLayer; k++) {
          const startX = (i + 1) * layerSpacing;
          const startY = (k + 1) * (canvas.height / (leftLayer + 1));
          const endX = (i + 2) * layerSpacing;
          const endY = (j + 1) * (canvas.height / (rightLayer + 1));

          const distance = distanceToLine(x, y, startX, startY, endX, endY);
          if (distance < connectionHitArea) {
            updateHoverState({
              type: 'connection',
              fromLayer: i,
              fromNeuron: k,
              toLayer: i + 1,
              toNeuron: j,
              weight: weights[i][j][k],
            }, event);
            return;
          }
        }
      }
    }

    updateHoverState(null, event);
  }, [networkState, getActivationValue, updateHoverState]);

  const handleMouseLeave = useCallback(() => {
    if (hoverDebounceRef.current) {
      window.clearTimeout(hoverDebounceRef.current);
    }
    setHoverState(null);
    setTooltipPosition(null);
  }, []);

  const distanceToLine = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
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

  const drawNetworkBatch = useCallback((
    ctx: CanvasRenderingContext2D,
    startLayer: number,
    endLayer: number,
    settings: typeof renderSettings
  ) => {
    const { layers, weights } = networkState;
    const { neuronRadius, connectionOpacityMultiplier, connectionWidth, drawLabels, cullingThreshold } = settings;
    const layerSpacing = ctx.canvas.width / (layers.length + 1);

    // Draw connections for this batch
    for (let i = startLayer; i < endLayer && i < weights.length; i++) {
      const leftLayer = layers[i];
      const rightLayer = layers[i + 1];
      const startX = (i + 1) * layerSpacing;
      const endX = (i + 2) * layerSpacing;

      // Batch process connections
      for (let j = 0; j < rightLayer; j++) {
        const endY = (j + 1) * (ctx.canvas.height / (rightLayer + 1));
        
        for (let k = 0; k < leftLayer; k++) {
          const weight = weights[i][j][k];
          
          // Skip rendering weak connections in low detail mode
          if (detailLevel === 'low' && Math.abs(weight) < cullingThreshold) {
            continue;
          }

          const startY = (k + 1) * (ctx.canvas.height / (leftLayer + 1));
          const alpha = Math.min(Math.abs(weight) * connectionOpacityMultiplier, 1);

          if (alpha > cullingThreshold) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.lineWidth = connectionWidth;
            ctx.strokeStyle = weight > 0
              ? `rgba(0, 255, 0, ${alpha})`
              : `rgba(255, 0, 0, ${alpha})`;
            ctx.stroke();
          }
        }
      }
    }

    // Draw neurons for this batch
    for (let layerIndex = startLayer; layerIndex <= endLayer && layerIndex < layers.length; layerIndex++) {
      const layerSize = layers[layerIndex];
      const x = (layerIndex + 1) * layerSpacing;

      for (let i = 0; i < layerSize; i++) {
        const y = (i + 1) * (ctx.canvas.height / (layerSize + 1));

        ctx.beginPath();
        ctx.arc(x, y, neuronRadius, 0, Math.PI * 2);

        if (hoverState?.type === 'neuron' && 
            hoverState.layer === layerIndex && 
            hoverState.neuron === i) {
          ctx.fillStyle = '#00ff00';
        } else {
          ctx.fillStyle = getNeuronColor(layerIndex, i);
        }

        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add layer labels only in high detail mode
        if (drawLabels && i === 0) {
          ctx.fillStyle = '#fff';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            layerIndex === 0
              ? 'Input'
              : layerIndex === layers.length - 1
                ? 'Output'
                : `Hidden ${layerIndex}`,
            x,
            ctx.canvas.height - 10
          );
        }
      }
    }
  }, [networkState, hoverState, detailLevel, getNeuronColor]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    if (!canvas || !offscreenCanvas) return;

    const ctx = canvas.getContext('2d');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (!ctx || !offscreenCtx) return;

    // Set canvas sizes
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      
      ctx.scale(dpr, dpr);
      offscreenCtx.scale(dpr, dpr);
    };

    updateCanvasSize();

    // Batch rendering function
    const renderNetwork = () => {
      const { layers } = networkState;
      const { batchSize } = renderSettings;
      let currentBatch = 0;

      const processBatch = () => {
        const startLayer = currentBatch * batchSize;
        const endLayer = Math.min(startLayer + batchSize, layers.length - 1);

        if (currentBatch === 0) {
          offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        }

        drawNetworkBatch(offscreenCtx, startLayer, endLayer, renderSettings);
        
        // Copy to main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0);

        currentBatch++;

        if (startLayer < layers.length - 1) {
          renderRequestRef.current = requestAnimationFrame(processBatch);
        }
      };

      processBatch();
    };

    renderNetwork();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      if (renderRequestRef.current) {
        cancelAnimationFrame(renderRequestRef.current);
      }
    };
  }, [networkState, mounted, renderSettings, drawNetworkBatch]);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (hoverDebounceRef.current) {
        window.clearTimeout(hoverDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setNetworkState(network.getNetworkState());
  }, [network, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-4xl p-4">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-gray-300 bg-gray-900"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltipPosition && hoverState && (
        <div
          className="pointer-events-none absolute z-10 rounded bg-black/80 p-2 text-sm text-white shadow-lg"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            maxWidth: '200px',
          }}
        >
          {hoverState.type === 'neuron' ? (
            <>
              <div className="font-semibold">
                {hoverState.isInput
                  ? 'Input'
                  : hoverState.isOutput
                  ? 'Output'
                  : 'Hidden'} Layer {hoverState.layer}
              </div>
              <div>Neuron: {hoverState.neuron}</div>
              <div>
                {hoverState.isInput ? 'Input' : 'Activation'}:{' '}
                {hoverState.value?.toFixed(4) ?? 'N/A'}
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold">Connection</div>
              <div>
                From: Layer {hoverState.fromLayer}, Neuron {hoverState.fromNeuron}
              </div>
              <div>
                To: Layer {hoverState.toLayer}, Neuron {hoverState.toNeuron}
              </div>
              <div>Weight: {hoverState.weight?.toFixed(4) ?? 'N/A'}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
