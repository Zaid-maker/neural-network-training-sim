'use client';

import React, { useState } from 'react';

interface NetworkConfigProps {
  onConfigChange: (layers: number[], learningRate: number) => void;
  currentLayers: number[];
  currentLearningRate: number;
}

export const NetworkConfig: React.FC<NetworkConfigProps> = ({
  onConfigChange,
  currentLayers,
  currentLearningRate,
}) => {
  const [layers, setLayers] = useState<number[]>(currentLayers);
  const [learningRate, setLearningRate] = useState(currentLearningRate);
  const [isEditing, setIsEditing] = useState(false);

  const handleLayerChange = (index: number, value: number) => {
    const newLayers = [...layers];
    newLayers[index] = Math.max(1, Math.min(10, value));
    setLayers(newLayers);
  };

  const addLayer = () => {
    if (layers.length < 8) {
      setLayers([...layers, 2]);
    }
  };

  const removeLayer = (index: number) => {
    if (layers.length > 3) {
      // Keep at least input, hidden, and output layers
      const newLayers = layers.filter((_, i) => i !== index);
      setLayers(newLayers);
    }
  };

  const handleApply = () => {
    onConfigChange(layers, learningRate);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="mb-8 rounded-lg bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Network Configuration</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Edit Configuration
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2 font-semibold">Layer Architecture:</h3>
            <div className="flex items-center gap-2">
              {layers.map((size, i) => (
                <div key={i} className="rounded bg-white/10 px-3 py-1">
                  {size}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Learning Rate:</h3>
            <div className="inline-block rounded bg-white/10 px-3 py-1">{learningRate}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-lg bg-white/5 p-4">
      <h2 className="mb-4 text-xl font-semibold">Edit Network Configuration</h2>

      <div className="mb-6">
        <h3 className="mb-2 font-semibold">Layer Architecture:</h3>
        <div className="flex flex-wrap items-center gap-4">
          {layers.map((size, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={size}
                onChange={(e) => handleLayerChange(i, parseInt(e.target.value) || 1)}
                className="w-16 rounded bg-white/10 p-2"
              />
              {i > 0 && i < layers.length - 1 && (
                <button onClick={() => removeLayer(i)} className="text-red-500 hover:text-red-400">
                  ×
                </button>
              )}
            </div>
          ))}
          {layers.length < 8 && (
            <button
              onClick={addLayer}
              className="rounded bg-green-500/20 px-3 py-1 hover:bg-green-500/30"
            >
              + Add Layer
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-semibold">Learning Rate:</h3>
        <input
          type="number"
          min="0.001"
          max="1"
          step="0.001"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.1)}
          className="w-32 rounded bg-white/10 p-2"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApply}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Apply Changes
        </button>
        <button
          onClick={() => {
            setLayers(currentLayers);
            setLearningRate(currentLearningRate);
            setIsEditing(false);
          }}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
