# Neural Network Training Simulator

An interactive web application for visualizing and training neural networks in real-time. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Interactive neural network visualization
- Real-time weight and connection updates
- Multiple activation functions (Sigmoid, ReLU, Tanh)
- Decision boundary visualization
- Gradient field visualization
- Network state save/load functionality
- Batch training support
- Configurable network architecture
- Dark mode support
- PWA ready

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

1. Network Configuration:
   - Customize the number of layers and neurons
   - Choose activation function (Sigmoid, ReLU, or Tanh)
   - Adjust learning rate
   - Save and load network states

2. Training Options:
   - Single-step training with custom inputs
   - Batch training on predefined examples
   - Adjustable training speed
   - Real-time error visualization

3. Visualizations:
   - Interactive decision boundary plot
   - Gradient field visualization
   - Network architecture diagram
   - Training error history

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

### Neural Network Implementation
- Multiple activation functions:
  - Sigmoid: for smooth, bounded outputs
  - ReLU: for faster training and sparsity
  - Tanh: for zero-centered outputs
- Xavier/Glorot weight initialization
- Gradient descent optimization
- Enhanced type safety with TypeScript
- Efficient matrix operations

### Visualization Features
- Canvas-based decision boundary rendering
- Dynamic gradient field updates
- Interactive network architecture display
- Real-time training metrics

### Modern Web Technologies
- Next.js 14 for server-side rendering
- TypeScript for type safety
- Tailwind CSS for styling
- PWA support for offline access
- Responsive design for all devices

## Performance Optimizations

- Efficient matrix operations
- Optimized weight initialization
- Canvas-based visualizations
- Bun runtime benefits:
  - Fast dependency installation
  - Quick development server
  - Enhanced TypeScript compilation

## Contributing

Feel free to open issues and pull requests for:
- Additional activation functions
- New training examples
- UI/UX improvements
- Performance optimizations
- Documentation enhancements

## License

MIT License - feel free to use this project for learning and experimentation.
