import { GameState, Player } from '@/types/game';

const STORAGE_KEY = 'shadowquest_xp_data';
const BACKUP_KEY = 'shadowquest_xp_backup';
const VERSION = '2.0.0';

// Default game state
const createDefaultState = (): GameState => ({
  player: {
    nivel: 1,
    xp: 0,
    xpTotal: 0,
    xpParaProximoNivel: 100,
    moedas: 0,
    classe: 'guerreiro',
    atributos: {
      forca: 1,
      inteligencia: 1,
      agilidade: 1,
    },
    titulo: 'Iniciante',
  },
  missions: {
    ativas: [],
    completadas: [],
  },
  achievements: [
    {
      id: 'first_mission',
      titulo: 'Primeira Missão',
      descricao: 'Complete sua primeira missão',
      icon: '⚔️',
      unlocked: false,
    },
    {
      id: 'level_5',
      titulo: 'Aventureiro',
      descricao: 'Alcance o nível 5',
      icon: '🎖️',
      unlocked: false,
    },
    {
      id: 'level_10',
      titulo: 'Herói',
      descricao: 'Alcance o nível 10',
      icon: '👑',
      unlocked: false,
    },
    {
      id: 'streak_7',
      titulo: 'Dedicação',
      descricao: 'Complete missões por 7 dias seguidos',
      icon: '🔥',
      unlocked: false,
    },
  ],
  settings: {
    som: true,
    notificacoes: true,
    autoBackup: true,
  },
  metadata: {
    versao: VERSION,
    dataCriacao: new Date().toISOString(),
    ultimoSave: new Date().toISOString(),
  },
});

class StorageService {
  // Save data with triple redundancy
  async saveData(data: GameState): Promise<void> {
    try {
      const dataToSave = {
        ...data,
        metadata: {
          ...data.metadata,
          ultimoSave: new Date().toISOString(),
        },
      };

      const serialized = JSON.stringify(dataToSave);

      // Layer 1: LocalStorage (primary)
      localStorage.setItem(STORAGE_KEY, serialized);

      // Layer 2: LocalStorage backup
      localStorage.setItem(BACKUP_KEY, serialized);

      // Layer 3: SessionStorage (temporary cache)
      sessionStorage.setItem(STORAGE_KEY, serialized);

      console.log('✅ Data saved successfully');
    } catch (error) {
      console.error('❌ Error saving data:', error);
      throw error;
    }
  }

  // Load data with fallback chain
  async loadData(): Promise<GameState> {
    try {
      // Try primary storage
      let data = localStorage.getItem(STORAGE_KEY);
      
      // Fallback to backup
      if (!data) {
        console.warn('⚠️ Primary storage empty, trying backup...');
        data = localStorage.getItem(BACKUP_KEY);
      }

      // Fallback to session
      if (!data) {
        console.warn('⚠️ Backup empty, trying session storage...');
        data = sessionStorage.getItem(STORAGE_KEY);
      }

      if (data) {
        const parsed = JSON.parse(data);
        console.log('✅ Data loaded successfully');
        return parsed;
      }

      // No data found, create default
      console.log('📦 No saved data, creating new game');
      const defaultState = createDefaultState();
      await this.saveData(defaultState);
      return defaultState;
    } catch (error) {
      console.error('❌ Error loading data:', error);
      console.log('🔄 Creating fresh game state');
      const defaultState = createDefaultState();
      await this.saveData(defaultState);
      return defaultState;
    }
  }

  // Export data as JSON file
  exportData(data: GameState): void {
    try {
      const serialized = JSON.stringify(data, null, 2);
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shadowquest-backup-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      console.log('✅ Data exported successfully');
    } catch (error) {
      console.error('❌ Error exporting data:', error);
    }
  }

  // Import data from JSON file
  async importData(file: File): Promise<GameState> {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as GameState;
      await this.saveData(data);
      console.log('✅ Data imported successfully');
      return data;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      throw error;
    }
  }

  // Clear all data
  async clearData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ All data cleared');
  }
}

export const storageService = new StorageService();
