import { NetworkState } from '../lib/NeuralNetwork';

const STORAGE_KEYS = {
  NETWORKS: 'nn-simulator-networks',
  CURRENT_NETWORK: 'nn-simulator-current-network',
  TRAINING_DATA: 'nn-simulator-training-data',
  APP_SETTINGS: 'nn-simulator-settings'
} as const;

interface StoredNetwork {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  state: NetworkState;
}

interface TrainingData {
  networkId: string;
  inputs: number[][];
  outputs: number[][];
}

interface AppSettings {
  theme: 'light' | 'dark';
  autoSave: boolean;
  offlineMode: boolean;
  lastInstallPrompt?: number;
  installDismissCount?: number;
}

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private isStorageAvailable(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  // Networks
  saveNetwork(network: StoredNetwork): void {
    if (!this.isStorageAvailable()) return;

    const networks = this.getNetworks();
    networks[network.id] = network;
    localStorage.setItem(STORAGE_KEYS.NETWORKS, JSON.stringify(networks));
  }

  getNetworks(): Record<string, StoredNetwork> {
    if (!this.isStorageAvailable()) return {};

    const networksJson = localStorage.getItem(STORAGE_KEYS.NETWORKS);
    return networksJson ? JSON.parse(networksJson) : {};
  }

  deleteNetwork(id: string): void {
    if (!this.isStorageAvailable()) return;

    const networks = this.getNetworks();
    delete networks[id];
    localStorage.setItem(STORAGE_KEYS.NETWORKS, JSON.stringify(networks));
  }

  // Current Network
  saveCurrentNetwork(networkId: string): void {
    if (!this.isStorageAvailable()) return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_NETWORK, networkId);
  }

  getCurrentNetwork(): string | null {
    if (!this.isStorageAvailable()) return null;
    return localStorage.getItem(STORAGE_KEYS.CURRENT_NETWORK);
  }

  // Training Data
  saveTrainingData(data: TrainingData): void {
    if (!this.isStorageAvailable()) return;

    const trainingDataMap = this.getTrainingData();
    trainingDataMap[data.networkId] = data;
    localStorage.setItem(STORAGE_KEYS.TRAINING_DATA, JSON.stringify(trainingDataMap));
  }

  getTrainingData(): Record<string, TrainingData> {
    if (!this.isStorageAvailable()) return {};

    const dataJson = localStorage.getItem(STORAGE_KEYS.TRAINING_DATA);
    return dataJson ? JSON.parse(dataJson) : {};
  }

  // App Settings
  saveSettings(settings: AppSettings): void {
    if (!this.isStorageAvailable()) return;
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  }

  getSettings(): AppSettings {
    if (!this.isStorageAvailable()) {
      return {
        theme: 'dark',
        autoSave: true,
        offlineMode: false
      };
    }

    const settingsJson = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : {
      theme: 'dark',
      autoSave: true,
      offlineMode: false
    };
  }

  // Storage Management
  clearStorage(): void {
    if (!this.isStorageAvailable()) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  getStorageUsage(): number {
    if (!this.isStorageAvailable()) return 0;

    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += new Blob([item]).size;
      }
    });

    return totalSize;
  }
}

export const storage = StorageManager.getInstance();
