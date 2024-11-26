'use client';

import { useState } from 'react';
import { NeuralNetwork } from './lib/NeuralNetwork';
import { NeuralNetworkVisualizer } from './components/NeuralNetworkVisualizer';

export default function Home() {
  const [network] = useState(() => new NeuralNetwork([2, 4, 3, 1]));
  const [inputValues, setInputValues] = useState<number[]>([0, 0]);
  const [targetValue, setTargetValue] = useState<number>(0);
  const [output, setOutput] = useState<number[]>([]);
  const [error, setError] = useState<number>(0);

  const handleForward = () => {
    const result = network.forward(inputValues);
    setOutput(result);
  };

  const handleTrain = () => {
    const trainError = network.train(inputValues, [targetValue]);
    setError(trainError);
    handleForward();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Neural Network Training Simulator</h1>
        
        <div className="mb-8">
          <NeuralNetworkVisualizer network={network} />
        </div>

        <div className="bg-white/10 p-6 rounded-lg">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Input Values</h2>
            <div className="flex gap-4">
              {inputValues.map((value, index) => (
                <input
                  key={index}
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const newInputs = [...inputValues];
                    newInputs[index] = parseFloat(e.target.value) || 0;
                    setInputValues(newInputs);
                  }}
                  className="w-20 p-2 border rounded bg-white/5"
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Target Value</h2>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
              className="w-20 p-2 border rounded bg-white/5"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleForward}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Forward Pass
            </button>
            <button
              onClick={handleTrain}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Train
            </button>
          </div>

          {output.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Output</h2>
              <div className="bg-white/5 p-4 rounded">
                {output.map((value, index) => (
                  <div key={index}>
                    Output {index}: {value.toFixed(4)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Training Error</h2>
              <div className="bg-white/5 p-4 rounded">
                {error.toFixed(4)}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
