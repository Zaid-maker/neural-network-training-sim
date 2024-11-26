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
                const newNetwork = new NeuralNetwork(
                    networkState.layers,
                    networkState.learningRate
                );
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
        <div className="bg-white/5 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Network Controls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-2">Activation Function:</h3>
                    <select
                        onChange={(e) => onActivationChange(e.target.value as ActivationType)}
                        className="w-full p-2 bg-white/10 rounded"
                    >
                        <option value="sigmoid">Sigmoid</option>
                        <option value="tanh">Tanh</option>
                        <option value="relu">ReLU</option>
                    </select>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Training Speed:</h3>
                    <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={trainingSpeed}
                        onChange={handleSpeedChange}
                        className="w-full"
                    />
                    <div className="text-sm text-gray-400 mt-1">
                        {trainingSpeed}x
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Save Network:</h3>
                    <button
                        onClick={handleSaveNetwork}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Download State
                    </button>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Load Network:</h3>
                    <label className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer inline-block text-center">
                        Upload State
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleLoadNetwork}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};
