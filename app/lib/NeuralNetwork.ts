export class NeuralNetwork {
    private weights: number[][][];
    private biases: number[][];
    private layers: number[];
    private learningRate: number;
    private activation: string;
    private trainingPoints: { inputs: number[], target: number }[];

    constructor(layers: number[], learningRate: number = 0.1, activation: string = 'sigmoid') {
        this.layers = layers;
        this.learningRate = learningRate;
        this.activation = activation;
        this.trainingPoints = [];

        // Initialize weights and biases
        this.weights = [];
        this.biases = [];

        for (let i = 0; i < layers.length - 1; i++) {
            const layerWeights: number[][] = [];
            const layerBiases: number[] = [];

            for (let j = 0; j < layers[i + 1]; j++) {
                const neuronWeights: number[] = [];
                for (let k = 0; k < layers[i]; k++) {
                    neuronWeights.push(Math.random() * 2 - 1);
                }
                layerWeights.push(neuronWeights);
                layerBiases.push(Math.random() * 2 - 1);
            }

            this.weights.push(layerWeights);
            this.biases.push(layerBiases);
        }
    }

    private activationFunction(x: number): number {
        switch (this.activation) {
            case 'tanh':
                return Math.tanh(x);
            case 'relu':
                return Math.max(0, x);
            case 'sigmoid':
            default:
                return 1 / (1 + Math.exp(-x));
        }
    }

    private activationDerivative(x: number): number {
        switch (this.activation) {
            case 'tanh':
                const tanh = Math.tanh(x);
                return 1 - tanh * tanh;
            case 'relu':
                return x > 0 ? 1 : 0;
            case 'sigmoid':
            default:
                const sigmoid = this.activationFunction(x);
                return sigmoid * (1 - sigmoid);
        }
    }

    forward(inputs: number[]): number[] {
        let currentLayer = inputs;

        for (let i = 0; i < this.weights.length; i++) {
            const nextLayer: number[] = [];

            for (let j = 0; j < this.weights[i].length; j++) {
                let sum = this.biases[i][j];
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    sum += this.weights[i][j][k] * currentLayer[k];
                }
                nextLayer.push(this.activationFunction(sum));
            }

            currentLayer = nextLayer;
        }

        return currentLayer;
    }

    train(inputs: number[], targets: number[]): number {
        // Store training point
        this.trainingPoints.push({ inputs: [...inputs], target: targets[0] });
        if (this.trainingPoints.length > 100) {
            this.trainingPoints.shift();
        }

        // Forward pass
        const layerOutputs: number[][] = [inputs];
        const layerInputs: number[][] = [];

        let currentLayer = inputs;
        for (let i = 0; i < this.weights.length; i++) {
            const nextLayerInput: number[] = [];
            const nextLayerOutput: number[] = [];

            for (let j = 0; j < this.weights[i].length; j++) {
                let sum = this.biases[i][j];
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    sum += this.weights[i][j][k] * currentLayer[k];
                }
                nextLayerInput.push(sum);
                nextLayerOutput.push(this.activationFunction(sum));
            }

            layerInputs.push(nextLayerInput);
            layerOutputs.push(nextLayerOutput);
            currentLayer = nextLayerOutput;
        }

        // Backward pass
        const deltas: number[][] = new Array(this.weights.length);
        
        // Output layer error
        const outputDelta: number[] = [];
        const outputLayer = layerOutputs[layerOutputs.length - 1];
        const outputInput = layerInputs[layerInputs.length - 1];
        
        for (let i = 0; i < outputLayer.length; i++) {
            const error = outputLayer[i] - targets[i];
            outputDelta.push(error * this.activationDerivative(outputInput[i]));
        }
        deltas[deltas.length - 1] = outputDelta;

        // Hidden layers error
        for (let i = this.weights.length - 2; i >= 0; i--) {
            const layerDelta: number[] = [];
            const layerInput = layerInputs[i];

            for (let j = 0; j < this.weights[i].length; j++) {
                let error = 0;
                for (let k = 0; k < this.weights[i + 1].length; k++) {
                    error += this.weights[i + 1][k][j] * deltas[i + 1][k];
                }
                layerDelta.push(error * this.activationDerivative(layerInput[j]));
            }
            deltas[i] = layerDelta;
        }

        // Update weights and biases
        for (let i = 0; i < this.weights.length; i++) {
            const layerOutput = layerOutputs[i];
            const layerDelta = deltas[i];

            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    this.weights[i][j][k] -= this.learningRate * layerDelta[j] * layerOutput[k];
                }
                this.biases[i][j] -= this.learningRate * layerDelta[j];
            }
        }

        // Calculate total error
        let totalError = 0;
        for (let i = 0; i < targets.length; i++) {
            const error = outputLayer[i] - targets[i];
            totalError += error * error;
        }
        return totalError / targets.length;
    }

    setActivation(activation: string) {
        this.activation = activation;
    }

    getNetworkState() {
        return {
            layers: this.layers,
            weights: this.weights,
            biases: this.biases,
            learningRate: this.learningRate,
            activation: this.activation
        };
    }

    loadState(state: any) {
        this.weights = state.weights;
        this.biases = state.biases;
        this.learningRate = state.learningRate;
        this.activation = state.activation;
    }

    getTrainingPoints() {
        return this.trainingPoints;
    }
}
