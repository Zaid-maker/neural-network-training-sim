'use client';

import React, { useState } from 'react';
import { NeuralNetwork, ActivationType } from '../lib/NeuralNetwork';

interface NetworkControlsProps {
  network: NeuralNetwork;
  onLoadNetwork: (network: NeuralNetwork) => void;
  onActivationChange: (activation: ActivationType) => void;
  onSpeedChange: (speed: number) => void;
}

export const NetworkControls: React.FC<NetworkControlsProps> = ({
  network,
  onLoadNetwork,
  onActivationChange,
  onSpeedChange,
}) => {
  const [trainingSpeed, setTrainingSpeed] = useState(1);

  const handleSaveNetwork = () => {
    const networkState = network.getNetworkState();
    const blob = new Blob([JSON.stringify(networkState)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'neural-network-state.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadNetwork = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const networkState = JSON.parse(event.target?.result as string);
        const newNetwork = new NeuralNetwork(networkState.layers, networkState.learningRate);
        newNetwork.loadNetworkState(networkState);
        onLoadNetwork(newNetwork);
      } catch (error) {
        console.error('Error loading network state:', error);
        alert('Invalid network state file');
      }
    };
    reader.readAsText(file);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    setTrainingSpeed(speed);
    onSpeedChange(speed);
  };

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <h2 className="mb-4 text-xl font-semibold">Network Controls</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Activation Function:</h3>
          <select
            onChange={(e) => onActivationChange(e.target.value as ActivationType)}
            className="w-full rounded bg-white/10 p-2"
          >
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
            <option value="relu">ReLU</option>
          </select>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Training Speed:</h3>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={trainingSpeed}
            onChange={handleSpeedChange}
            className="w-full"
          />
          <div className="mt-1 text-sm text-gray-400">{trainingSpeed}x</div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Save Network:</h3>
          <button
            onClick={handleSaveNetwork}
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Download State
          </button>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Load Network:</h3>
          <label className="inline-block w-full cursor-pointer rounded bg-green-500 px-4 py-2 text-center text-white hover:bg-green-600">
            Upload State
            <input type="file" accept=".json" onChange={handleLoadNetwork} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
