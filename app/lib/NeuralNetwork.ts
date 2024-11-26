export class NeuralNetwork {
    private layers: number[];
    private weights: number[][][];
    private biases: number[][];
    private learningRate: number;

    constructor(layers: number[], learningRate: number = 0.1) {
        this.layers = layers;
        this.learningRate = learningRate;
        this.weights = [];
        this.biases = [];
        
        // Initialize weights and biases
        for (let i = 0; i < layers.length - 1; i++) {
            const layerWeights: number[][] = [];
            const layerBiases: number[] = [];
            
            // Initialize weights between current layer and next layer
            for (let j = 0; j < layers[i + 1]; j++) {
                const neuronWeights: number[] = [];
                for (let k = 0; k < layers[i]; k++) {
                    neuronWeights.push(Math.random() * 2 - 1); // Random weights between -1 and 1
                }
                layerWeights.push(neuronWeights);
                layerBiases.push(Math.random() * 2 - 1); // Random bias between -1 and 1
            }
            
            this.weights.push(layerWeights);
            this.biases.push(layerBiases);
        }
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private sigmoidDerivative(x: number): number {
        const sigmoid = this.sigmoid(x);
        return sigmoid * (1 - sigmoid);
    }

    forward(input: number[]): number[] {
        if (input.length !== this.layers[0]) {
            throw new Error('Input size does not match network architecture');
        }

        let currentLayer = input;
        const activations: number[][] = [currentLayer];
        const weightedSums: number[][] = [];

        // Forward propagation
        for (let i = 0; i < this.weights.length; i++) {
            const layerWeights = this.weights[i];
            const layerBiases = this.biases[i];
            const weightedSum: number[] = [];
            const newLayer: number[] = [];

            for (let j = 0; j < layerWeights.length; j++) {
                let sum = layerBiases[j];
                for (let k = 0; k < layerWeights[j].length; k++) {
                    sum += layerWeights[j][k] * currentLayer[k];
                }
                weightedSum.push(sum);
                newLayer.push(this.sigmoid(sum));
            }

            weightedSums.push(weightedSum);
            activations.push(newLayer);
            currentLayer = newLayer;
        }

        return currentLayer;
    }

    train(input: number[], target: number[]): number {
        if (input.length !== this.layers[0]) {
            throw new Error('Input size does not match network architecture');
        }
        if (target.length !== this.layers[this.layers.length - 1]) {
            throw new Error('Target size does not match network architecture');
        }

        // Forward pass
        let currentLayer = input;
        const activations: number[][] = [currentLayer];
        const weightedSums: number[][] = [];

        for (let i = 0; i < this.weights.length; i++) {
            const layerWeights = this.weights[i];
            const layerBiases = this.biases[i];
            const weightedSum: number[] = [];
            const newLayer: number[] = [];

            for (let j = 0; j < layerWeights.length; j++) {
                let sum = layerBiases[j];
                for (let k = 0; k < layerWeights[j].length; k++) {
                    sum += layerWeights[j][k] * currentLayer[k];
                }
                weightedSum.push(sum);
                newLayer.push(this.sigmoid(sum));
            }

            weightedSums.push(weightedSum);
            activations.push(newLayer);
            currentLayer = newLayer;
        }

        // Backpropagation
        const deltas: number[][] = new Array(this.weights.length);
        
        // Calculate output layer error
        const outputDelta: number[] = [];
        const outputLayer = activations[activations.length - 1];
        const outputWeightedSum = weightedSums[weightedSums.length - 1];
        
        for (let i = 0; i < outputLayer.length; i++) {
            const error = outputLayer[i] - target[i];
            outputDelta.push(error * this.sigmoidDerivative(outputWeightedSum[i]));
        }
        deltas[deltas.length - 1] = outputDelta;

        // Calculate hidden layer errors
        for (let i = this.weights.length - 2; i >= 0; i--) {
            const layerDelta: number[] = [];
            const nextLayerDelta = deltas[i + 1];
            const layerWeightedSum = weightedSums[i];

            for (let j = 0; j < this.weights[i].length; j++) {
                let error = 0;
                for (let k = 0; k < nextLayerDelta.length; k++) {
                    error += nextLayerDelta[k] * this.weights[i + 1][k][j];
                }
                layerDelta.push(error * this.sigmoidDerivative(layerWeightedSum[j]));
            }
            deltas[i] = layerDelta;
        }

        // Update weights and biases
        let totalError = 0;
        for (let i = 0; i < this.weights.length; i++) {
            const layerActivations = activations[i];
            const layerDelta = deltas[i];

            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    this.weights[i][j][k] -= this.learningRate * layerDelta[j] * layerActivations[k];
                }
                this.biases[i][j] -= this.learningRate * layerDelta[j];
                totalError += Math.abs(layerDelta[j]);
            }
        }

        return totalError / target.length; // Return average error
    }

    getNetworkState() {
        return {
            layers: this.layers,
            weights: this.weights,
            biases: this.biases
        };
    }
}
