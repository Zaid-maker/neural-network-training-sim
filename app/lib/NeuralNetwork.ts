export type NetworkState = {
  layers: number[];
  weights: number[][][];
  biases: number[][];
  activation: ActivationType;
  learningRate: number;
};

export type ActivationType = 'sigmoid' | 'tanh' | 'relu';

type ActivationFunction = (x: number) => number;

export class NeuralNetwork {
  private weights: number[][][];
  private biases: number[][];
  private layers: number[];
  private learningRate: number;
  private activation: ActivationType;
  private activationFn: ActivationFunction;
  private activationDerivative: ActivationFunction;

  constructor(layers: number[], learningRate: number = 0.1) {
    this.layers = layers;
    this.learningRate = learningRate;
    this.activation = 'sigmoid';
    this.weights = [];
    this.biases = [];
    
    // Initialize activation functions with sigmoid as default
    this.activationFn = (x: number) => 1 / (1 + Math.exp(-x));
    this.activationDerivative = (x: number) => {
      const sigmoid = 1 / (1 + Math.exp(-x));
      return sigmoid * (1 - sigmoid);
    };

    this.initializeNetwork();
  }

  private initializeNetwork() {
    for (let i = 0; i < this.layers.length - 1; i++) {
      this.weights[i] = [];
      this.biases[i] = [];
      
      // Xavier/Glorot initialization
      const stdDev = Math.sqrt(2.0 / (this.layers[i] + this.layers[i + 1]));
      
      for (let j = 0; j < this.layers[i + 1]; j++) {
        this.weights[i][j] = [];
        for (let k = 0; k < this.layers[i]; k++) {
          this.weights[i][j][k] = this.gaussianRandom(0, stdDev);
        }
        this.biases[i][j] = 0;
      }
    }
  }

  private gaussianRandom(mean: number, stdDev: number): number {
    const u1 = 1 - Math.random();
    const u2 = 1 - Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + stdDev * randStdNormal;
  }

  setActivation(activation: ActivationType): void {
    this.activation = activation;
    switch (activation) {
      case 'relu':
        this.activationFn = (x: number) => Math.max(0, x);
        this.activationDerivative = (x: number) => x > 0 ? 1 : 0;
        break;
      case 'tanh':
        this.activationFn = Math.tanh;
        this.activationDerivative = (x: number) => 1 - Math.pow(Math.tanh(x), 2);
        break;
      case 'sigmoid':
        this.activationFn = (x: number) => 1 / (1 + Math.exp(-x));
        this.activationDerivative = (x: number) => {
          const sigmoid = 1 / (1 + Math.exp(-x));
          return sigmoid * (1 - sigmoid);
        };
        break;
      default:
        throw new Error(`Unsupported activation function: ${activation}`);
    }
  }

  forward(inputs: number[]): number[] {
    if (inputs.length !== this.layers[0]) {
      throw new Error(`Input size mismatch. Expected ${this.layers[0]}, got ${inputs.length}`);
    }

    let currentLayer = inputs;
    const activations: number[][] = [inputs];
    const zValues: number[][] = [];

    for (let i = 0; i < this.weights.length; i++) {
      const z: number[] = [];
      const activation: number[] = [];
      
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j];
        for (let k = 0; k < this.weights[i][j].length; k++) {
          sum += this.weights[i][j][k] * currentLayer[k];
        }
        z.push(sum);
        activation.push(this.activationFn(sum));
      }
      
      zValues.push(z);
      activations.push(activation);
      currentLayer = activation;
    }

    return currentLayer;
  }

  train(inputs: number[], targets: number[]): number {
    if (inputs.length !== this.layers[0]) {
      throw new Error(`Input size mismatch. Expected ${this.layers[0]}, got ${inputs.length}`);
    }
    if (targets.length !== this.layers[this.layers.length - 1]) {
      throw new Error(`Target size mismatch. Expected ${this.layers[this.layers.length - 1]}, got ${targets.length}`);
    }

    // Forward pass
    let currentLayer = inputs;
    const activations: number[][] = [inputs];
    const zValues: number[][] = [];

    for (let i = 0; i < this.weights.length; i++) {
      const z: number[] = [];
      const activation: number[] = [];
      
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j];
        for (let k = 0; k < this.weights[i][j].length; k++) {
          sum += this.weights[i][j][k] * currentLayer[k];
        }
        z.push(sum);
        activation.push(this.activationFn(sum));
      }
      
      zValues.push(z);
      activations.push(activation);
      currentLayer = activation;
    }

    // Backward pass
    const deltas: number[][] = new Array(this.weights.length);
    
    // Calculate output layer deltas
    const outputDeltas: number[] = [];
    const outputLayer = activations[activations.length - 1];
    const outputZ = zValues[zValues.length - 1];
    
    for (let i = 0; i < outputLayer.length; i++) {
      const error = outputLayer[i] - targets[i];
      outputDeltas.push(error * this.activationDerivative(outputZ[i]));
    }
    deltas[deltas.length - 1] = outputDeltas;

    // Calculate hidden layer deltas
    for (let i = this.weights.length - 2; i >= 0; i--) {
      const layerDeltas: number[] = [];
      const currentZ = zValues[i];
      
      for (let j = 0; j < this.weights[i].length; j++) {
        let error = 0;
        for (let k = 0; k < this.weights[i + 1].length; k++) {
          error += this.weights[i + 1][k][j] * deltas[i + 1][k];
        }
        layerDeltas.push(error * this.activationDerivative(currentZ[j]));
      }
      deltas[i] = layerDeltas;
    }

    // Update weights and biases
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] -= this.learningRate * deltas[i][j] * activations[i][k];
        }
        this.biases[i][j] -= this.learningRate * deltas[i][j];
      }
    }

    // Calculate and return total error
    return outputDeltas.reduce((sum, delta) => sum + Math.abs(delta), 0) / outputDeltas.length;
  }

  getNetworkState(): NetworkState {
    return {
      layers: [...this.layers],
      weights: JSON.parse(JSON.stringify(this.weights)),
      biases: JSON.parse(JSON.stringify(this.biases)),
      activation: this.activation,
      learningRate: this.learningRate
    };
  }

  loadNetworkState(state: NetworkState): void {
    if (!state.layers || !state.weights || !state.biases || !state.activation || state.learningRate === undefined) {
      throw new Error('Invalid network state');
    }

    this.layers = [...state.layers];
    this.weights = JSON.parse(JSON.stringify(state.weights));
    this.biases = JSON.parse(JSON.stringify(state.biases));
    this.learningRate = state.learningRate;
    this.setActivation(state.activation);
  }

  // Methods for decision boundary visualization
  predictPoint(x: number, y: number): number {
    return this.forward([x, y])[0];
  }

  getDecisionBoundary(
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    resolution: number = 50
  ): { x: number; y: number; value: number }[] {
    const points: { x: number; y: number; value: number }[] = [];
    const xStep = (xMax - xMin) / resolution;
    const yStep = (yMax - yMin) / resolution;

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = xMin + i * xStep;
        const y = yMin + j * yStep;
        const value = this.predictPoint(x, y);
        points.push({ x, y, value });
      }
    }

    return points;
  }

  // Gradient computation for visualization
  computeGradient(x: number, y: number): { dx: number; dy: number } {
    const epsilon = 1e-7;
    const baseOutput = this.predictPoint(x, y);
    
    // Compute partial derivatives
    const dx = (this.predictPoint(x + epsilon, y) - baseOutput) / epsilon;
    const dy = (this.predictPoint(x, y + epsilon) - baseOutput) / epsilon;
    
    return { dx, dy };
  }

  getGradientField(
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    resolution: number = 10
  ): { x: number; y: number; dx: number; dy: number }[] {
    const gradients: { x: number; y: number; dx: number; dy: number }[] = [];
    const xStep = (xMax - xMin) / resolution;
    const yStep = (yMax - yMin) / resolution;

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = xMin + i * xStep;
        const y = yMin + j * yStep;
        const { dx, dy } = this.computeGradient(x, y);
        gradients.push({ x, y, dx, dy });
      }
    }

    return gradients;
  }
}
