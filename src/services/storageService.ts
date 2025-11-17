import type { GameState } from '../types/game.types';
import type { CompletedCase, CustomizationItem } from '../types/storage.types';

class StorageService {
  private dbName = 'court-justice-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('gameState')) {
          db.createObjectStore('gameState', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('caseHistory')) {
          const caseStore = db.createObjectStore('caseHistory', {
            keyPath: 'caseId',
            autoIncrement: true
          });
          caseStore.createIndex('completedAt', 'completedAt', { unique: false });
        }
        if (!db.objectStoreNames.contains('customization')) {
          db.createObjectStore('customization', { keyPath: 'id' });
        }
      };
    });
  }

  async saveGameState(state: GameState): Promise<void> {
    await this.put('gameState', { id: 'current', ...state });

    localStorage.setItem('gameState_backup', JSON.stringify({
      coins: state.coins,
      completedCases: state.completedCases,
      customization: state.customization
    }));
  }

  async loadGameState(): Promise<GameState | null> {
    try {
      const state = await this.get('gameState', 'current');
      return state || this.loadBackupState();
    } catch {
      return this.loadBackupState();
    }
  }

  private loadBackupState(): GameState | null {
    const backup = localStorage.getItem('gameState_backup');
    return backup ? JSON.parse(backup) : null;
  }

  async saveCaseHistory(caseResult: CompletedCase): Promise<void> {
    await this.put('caseHistory', caseResult);
  }

  async getCaseHistory(): Promise<CompletedCase[]> {
    return await this.getAll('caseHistory');
  }

  async saveCustomizationInventory(items: CustomizationItem[]): Promise<void> {
    for (const item of items) {
      await this.put('customization', item);
    }
  }

  async getCustomizationInventory(): Promise<CustomizationItem[]> {
    return await this.getAll('customization');
  }

  private async get(storeName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async put(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getAll(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    const storeNames = ['gameState', 'caseHistory', 'customization'];
    for (const storeName of storeNames) {
      await this.clearStore(storeName);
    }
    localStorage.removeItem('gameState_backup');
  }

  private async clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const storageService = new StorageService();
