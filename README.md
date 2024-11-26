# Neural Network Training Simulator

An interactive web application for visualizing and training neural networks in real-time. Built with Next.js, TypeScript, and HTML Canvas.

## Features

- Interactive neural network visualization
- Real-time weight and connection updates
- Support for forward propagation and backpropagation
- Visual feedback on network training progress
- Configurable network architecture (currently set to [2, 4, 3, 1])

## Getting Started

### Prerequisites

- Bun (latest version)

### Installation

1. Clone the repository

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. The simulator starts with a neural network containing:
   - 2 input neurons
   - 4 neurons in the first hidden layer
   - 3 neurons in the second hidden layer
   - 1 output neuron

2. Training the Network:
   - Enter input values (two numbers between 0 and 1)
   - Set the target output value
   - Click "Forward Pass" to see the network's prediction
   - Click "Train" to perform one training iteration

3. Visual Feedback:
   - Green connections represent positive weights
   - Red connections represent negative weights
   - The opacity of connections indicates the weight magnitude
   - The error value shows the network's current performance

## Example Training Tasks

1. XOR Function:
   - Input: [0, 0] → Target: 0
   - Input: [0, 1] → Target: 1
   - Input: [1, 0] → Target: 1
   - Input: [1, 1] → Target: 0

2. AND Function:
   - Input: [0, 0] → Target: 0
   - Input: [0, 1] → Target: 0
   - Input: [1, 0] → Target: 0
   - Input: [1, 1] → Target: 1

## Technical Details

The neural network implementation includes:
- Sigmoid activation function
- Gradient descent optimization
- Mean squared error loss function
- Configurable learning rate (default: 0.1)

## Contributing

Feel free to open issues and pull requests for:
- Additional training examples
- UI improvements
- Network architecture configurations
- Performance optimizations

## Performance

This project uses Bun for enhanced performance:
- Faster dependency installation
- Quick development server startup
- Improved TypeScript compilation speed

## License

MIT License - feel free to use this project for learning and experimentation.
