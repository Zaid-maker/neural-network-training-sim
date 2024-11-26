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
    currentLearningRate
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
        if (layers.length > 3) { // Keep at least input, hidden, and output layers
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
            <div className="bg-white/5 p-4 rounded-lg mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Network Configuration</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Edit Configuration
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2">Layer Architecture:</h3>
                        <div className="flex items-center gap-2">
                            {layers.map((size, i) => (
                                <div key={i} className="bg-white/10 px-3 py-1 rounded">
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Learning Rate:</h3>
                        <div className="bg-white/10 px-3 py-1 rounded inline-block">
                            {learningRate}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Edit Network Configuration</h2>
            
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Layer Architecture:</h3>
                <div className="flex flex-wrap gap-4 items-center">
                    {layers.map((size, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={size}
                                onChange={(e) => handleLayerChange(i, parseInt(e.target.value) || 1)}
                                className="w-16 p-2 bg-white/10 rounded"
                            />
                            {i > 0 && i < layers.length - 1 && (
                                <button
                                    onClick={() => removeLayer(i)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    {layers.length < 8 && (
                        <button
                            onClick={addLayer}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 rounded"
                        >
                            + Add Layer
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold mb-2">Learning Rate:</h3>
                <input
                    type="number"
                    min="0.001"
                    max="1"
                    step="0.001"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.1)}
                    className="w-32 p-2 bg-white/10 rounded"
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleApply}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Apply Changes
                </button>
                <button
                    onClick={() => {
                        setLayers(currentLayers);
                        setLearningRate(currentLearningRate);
                        setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
