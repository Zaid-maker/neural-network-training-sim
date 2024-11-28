'use client';

import React from 'react';

export interface TrainingExample {
  name: string;
  description: string;
  examples: {
    inputs: number[];
    target: number;
  }[];
}

export const trainingExamples: TrainingExample[] = [
  {
    name: 'XOR Gate',
    description: 'Learn the XOR logic function: output 1 when inputs are different, 0 when same',
    examples: [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 1 },
      { inputs: [1, 0], target: 1 },
      { inputs: [1, 1], target: 0 },
    ],
  },
  {
    name: 'AND Gate',
    description: 'Learn the AND logic function: output 1 only when both inputs are 1',
    examples: [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 0 },
      { inputs: [1, 0], target: 0 },
      { inputs: [1, 1], target: 1 },
    ],
  },
  {
    name: 'OR Gate',
    description: 'Learn the OR logic function: output 1 when at least one input is 1',
    examples: [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 1 },
      { inputs: [1, 0], target: 1 },
      { inputs: [1, 1], target: 1 },
    ],
  },
];

interface TrainingExamplesProps {
  onSelectExample: (example: TrainingExample['examples'][0]) => void;
}

export const TrainingExamples: React.FC<TrainingExamplesProps> = ({ onSelectExample }) => {
  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-semibold">Training Examples</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {trainingExamples.map((example) => (
          <div key={example.name} className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 text-lg font-semibold">{example.name}</h3>
            <p className="mb-4 text-sm text-gray-300">{example.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {example.examples.map((training, index) => (
                <button
                  key={index}
                  onClick={() => onSelectExample(training)}
                  className="rounded bg-blue-500/20 px-3 py-2 text-sm hover:bg-blue-500/30"
                >
                  [{training.inputs.join(', ')}] → {training.target}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
