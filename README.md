# Neural Network Training Simulator

## Overview

The app visualizes the training process of a neural network step by step, helping users understand concepts like forward propagation, backpropagation, loss calculation, and optimizer effects. It caters to beginners and enthusiasts interested in hands-on learning.

## Features

1. Dataset Selection:

- Preloaded simple datasets (e.g., XOR, spirals, MNIST samples, linear regressions).
- Visualize the dataset on a 2D/3D graph.
- Allow users to upload custom datasets.

2. Network Architecture Builder:

- Drag-and-drop interface to add layers (e.g., dense, convolutional, dropout).
- Customize parameters like the number of neurons, activation functions, and layer types.

3. Real-time Training Visualization:

- Display the loss curve as the network trains.
- Show how weights and biases evolve during each epoch.
- Visualize activation values as heatmaps or graphs for each layer.

4. Decision Boundary Visualization:

- Dynamically display how the decision boundary changes during training.
- Highlight how the network adjusts to correctly classify points in the dataset.

5. Optimizer and Hyperparameter Tweaks:

- Let users switch between optimizers (e.g., SGD, Adam, RMSprop) mid-training.
- Change learning rate, batch size, and regularization dynamically.
- Show comparisons of performance with different settings.

5. Backpropagation Visualizer:

- Step-by-step visualization of gradients flowing backward through the network.
- Highlight which neurons are contributing most to the weight updates.

6. Metrics Dashboard:

- Show metrics like accuracy, precision, recall, and F1-score.
- Allow toggling between training and validation sets for overfitting detection.

7. Pre-trained Models:

- Include simple pre-trained models for comparison.
- Allow users to experiment with fine-tuning.

8. Export and Share:

- Export results as images or CSV for offline analysis.
- Share training simulations via a unique link.

## Teck Stack

1. Frontend:

- Next.js
- TypeScript
- React
- Tailwind CSS

2. Backend:

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

3. Neural Network:

- TensorFlow.js

4. Data Visualization:

- Chart.js: for quick and simple visualizations
- Plotly.js: for plotting loss curves and metrics

## How It Works:

1. Setup Stage:

- Users select or upload a dataset.
- Configure network architecture through a simple drag-and-drop interface.

2. Training Stage:

- Initiate training and watch metrics update in real-time.
- Observe backpropagation animations to understand gradient descent.
- Experiment with hyperparameter changes and view their impact instantly.

3. Analysis Stage:

- View detailed metrics, activation heatmaps, and weight distributions.
- Compare the results of different configurations side by side.

5. Save & Share:

- Save configurations, metrics, and visualizations for further study or presentation.
