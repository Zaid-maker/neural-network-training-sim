# Neural Network Training Simulator

An interactive web application for visualizing and training neural networks in real-time. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🧠 Interactive Neural Network Visualization
  - Real-time weight and activation updates
  - Color-coded layers (Input, Hidden, Output)
  - Interactive tooltips showing weights and activations
  - Dynamic connection strength visualization
  - Gradient field display

- 🎯 Training Capabilities
  - Multiple activation functions (Sigmoid, ReLU, Tanh)
  - Xavier/Glorot weight initialization
  - Gradient descent optimization
  - Batch training support
  - Customizable learning rate

- 📊 Visualizations
  - Decision boundary visualization
  - Gradient field visualization
  - Network state analysis
  - Training progress tracking
  - Real-time error plotting

- 🛠️ Configuration Options
  - Customizable network architecture
  - Adjustable training parameters
  - Network state save/load
  - Dark mode support
  - Mobile-responsive design

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Modern web browser with JavaScript enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Zaid-maker/neural-network-training-sim.git
cd neural-network-training-sim
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 Usage Guide

### Network Configuration
- **Architecture**: Customize layers and neurons
- **Activation**: Choose between Sigmoid, ReLU, or Tanh
- **Parameters**: Adjust learning rate and batch size
- **State**: Save and load network configurations

### Training Options
- **Single Step**: Train with custom inputs
- **Batch Mode**: Train on predefined datasets
- **Speed**: Adjust training iteration speed
- **Visualization**: Monitor real-time progress

### Interactive Features
- **Hover**: View neuron activations and weights
- **Click**: Select and analyze network components
- **Drag**: Adjust viewport and zoom level
- **Touch**: Full mobile device support

## 🧪 Example Training Tasks

### XOR Function
```typescript
const examples = [
  { input: [0, 0], target: 0 },
  { input: [0, 1], target: 1 },
  { input: [1, 0], target: 1 },
  { input: [1, 1], target: 0 }
];
```

### AND Function
```typescript
const examples = [
  { input: [0, 0], target: 0 },
  { input: [0, 1], target: 0 },
  { input: [1, 0], target: 0 },
  { input: [1, 1], target: 1 }
];
```

## 🔧 Technical Implementation

### Neural Network Core
- Forward propagation with activation functions
- Backpropagation with gradient descent
- Efficient matrix operations
- Type-safe implementation
- Modular architecture

### Visualization Engine
- Canvas-based rendering
- WebGL acceleration
- Real-time updates
- Interactive elements
- Responsive design

### Modern Stack
- Next.js 14 for routing and SSR
- TypeScript for type safety
- Tailwind CSS for styling
- Bun for fast runtime
- PWA capabilities

## ⚡ Performance Features

- Optimized matrix operations
- Efficient memory management
- Canvas-based visualizations
- Bun runtime benefits:
  - Fast dependency resolution
  - Quick development cycles
  - Enhanced TypeScript support

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Areas for contribution:
- New activation functions
- Additional training examples
- UI/UX improvements
- Performance optimizations
- Documentation updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🔗 Links

- [Project Homepage](https://github.com/Zaid-maker/neural-network-training-sim)
- [Documentation](https://github.com/Zaid-maker/neural-network-training-sim/wiki)
- [Issue Tracker](https://github.com/Zaid-maker/neural-network-training-sim/issues)
- [Change Log](CHANGELOG.md)

## 🙏 Acknowledgments

- Neural network implementation inspired by modern deep learning frameworks
- UI/UX design influenced by educational visualization tools
- Community contributions and feedback
