'use client';

import { useState, useEffect } from 'react';
import { NeuralNetwork, ActivationType } from './lib/NeuralNetwork';
import { NeuralNetworkVisualizer } from './components/NeuralNetworkVisualizer';
import { TrainingExamples, trainingExamples } from './components/TrainingExamples';
import { NetworkConfig } from './components/NetworkConfig';
import { NetworkControls } from './components/NetworkControls';
import { TrainingHistory } from './components/TrainingHistory';
import { DecisionBoundary } from './components/DecisionBoundary';

export default function Home() {
  const [network, setNetwork] = useState<NeuralNetwork | null>(null);
  const [inputValues, setInputValues] = useState<number[]>([0, 0]);
  const [targetValue, setTargetValue] = useState<number>(0);
  const [output, setOutput] = useState<number[]>([]);
  const [error, setError] = useState<number>(0);
  const [trainingIterations, setTrainingIterations] = useState<number>(1);
  const [errorHistory, setErrorHistory] = useState<number[]>([]);
  const [selectedExample, setSelectedExample] = useState<string>('XOR Gate');
  const [isBatchTraining, setIsBatchTraining] = useState(false);
  const [trainingSpeed, setTrainingSpeed] = useState(1);

  useEffect(() => {
    // Initialize network on client side only
    setNetwork(new NeuralNetwork([2, 4, 3, 1], 0.1));
  }, []);

  const handleForward = () => {
    if (!network) return;
    const result = network.forward(inputValues);
    setOutput(result);
  };

  const handleTrain = () => {
    if (!network) return;
    let totalError = 0;
    for (let i = 0; i < trainingIterations; i++) {
      totalError = network.train(inputValues, [targetValue]);
    }
    setError(totalError);
    setErrorHistory((prev) => [...prev, totalError]);
    handleForward();
  };

  const handleBatchTrain = async () => {
    if (!network || isBatchTraining) return;

    setIsBatchTraining(true);
    const example = trainingExamples.find((ex) => ex.name === selectedExample);
    if (!example) return;

    const batchSize = 100;
    const newErrorHistory = [...errorHistory];
    const delay = 50 / trainingSpeed;

    for (let batch = 0; batch < batchSize; batch++) {
      let batchError = 0;
      for (const training of example.examples) {
        batchError += network.train(training.inputs, [training.target]);
      }
      batchError /= example.examples.length;
      newErrorHistory.push(batchError);
      setErrorHistory(newErrorHistory);

      // Update visualization every few iterations
      if (batch % 10 === 0) {
        setError(batchError);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    setIsBatchTraining(false);
    handleExampleSelect(example.examples[0]);
  };

  const handleExampleSelect = (example: { inputs: number[]; target: number }) => {
    setInputValues(example.inputs);
    setTargetValue(example.target);
    if (network) {
      const result = network.forward(example.inputs);
      setOutput(result);
    }
  };

  const handleConfigChange = (newLayers: number[], learningRate: number) => {
    setNetwork(new NeuralNetwork(newLayers, learningRate));
    setErrorHistory([]);
    setOutput([]);
    setError(0);
  };

  const handleActivationChange = (activation: ActivationType) => {
    if (!network) return;
    network.setActivation(activation);
    setErrorHistory([]);
    setOutput([]);
    setError(0);
  };

  const handleLoadNetwork = (newNetwork: NeuralNetwork) => {
    setNetwork(newNetwork);
    setErrorHistory([]);
    setOutput([]);
    setError(0);
  };

  if (!network) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Initializing Neural Network...</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="z-10 w-full max-w-7xl">
        <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          Neural Network Training Simulator
        </h1>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 md:gap-8 lg:grid-cols-2">
          <NetworkConfig
            onConfigChange={handleConfigChange}
            currentLayers={network.getNetworkState().layers}
            currentLearningRate={0.1}
          />

          <NetworkControls
            network={network}
            onLoadNetwork={handleLoadNetwork}
            onActivationChange={handleActivationChange}
            onSpeedChange={setTrainingSpeed}
          />
        </div>

        <div className="mb-6 overflow-x-auto sm:mb-8">
          <NeuralNetworkVisualizer network={network} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <TrainingExamples onSelectExample={handleExampleSelect} />
            <div className="overflow-x-auto">
              <DecisionBoundary network={network} />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold sm:text-xl">Training Controls</h2>
                <select
                  value={selectedExample}
                  onChange={(e) => setSelectedExample(e.target.value)}
                  className="mb-4 w-full rounded bg-white/10 p-2"
                >
                  {trainingExamples.map((ex) => (
                    <option key={ex.name} value={ex.name}>
                      {ex.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleBatchTrain}
                  disabled={isBatchTraining}
                  className="w-full rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBatchTraining ? 'Training...' : 'Train on Full Dataset'}
                </button>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-semibold">Single Training:</h3>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={trainingIterations}
                      onChange={(e) =>
                        setTrainingIterations(
                          Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                        )
                      }
                      className="mb-2 w-full rounded bg-white/10 p-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleForward}
                        className="flex-1 rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 sm:px-4 sm:text-base"
                      >
                        Forward
                      </button>
                      <button
                        onClick={handleTrain}
                        className="flex-1 rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600 sm:px-4 sm:text-base"
                      >
                        Train
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Current Values:</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span>Inputs:</span>
                        <span className="font-mono">[{inputValues.join(', ')}]</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target:</span>
                        <span className="font-mono">{targetValue}</span>
                      </div>
                      {output.length > 0 && (
                        <div className="flex justify-between">
                          <span>Output:</span>
                          <span className="font-mono">{output[0].toFixed(4)}</span>
                        </div>
                      )}
                      {error > 0 && (
                        <div className="flex justify-between">
                          <span>Error:</span>
                          <span className="font-mono">{error.toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TrainingHistory errors={errorHistory} />
          </div>
        </div>
      </div>
    </main>
  );
}
