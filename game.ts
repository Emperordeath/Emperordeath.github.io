export type MissionType = 'diaria' | 'semanal' | 'mensal' | 'epica';
export type Difficulty = 'facil' | 'medio' | 'dificil';
export type Category = 'estudo' | 'saude' | 'trabalho' | 'pessoal';
export type ClassType = 'guerreiro' | 'mago' | 'arqueiro';

export interface SubTask {
  id: string;
  titulo: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  titulo: string;
  descricao: string;
  tipo: MissionType;
  xp: number;
  dificuldade: Difficulty;
  categoria: Category;
  subtasks?: SubTask[];
  deadline?: string;
  repetivel: boolean;
  completed: boolean;
  completedAt?: string;
}

export interface PlayerAttributes {
  forca: number;
  inteligencia: number;
  agilidade: number;
}

export interface Player {
  nivel: number;
  xp: number;
  xpTotal: number;
  xpParaProximoNivel: number;
  moedas: number;
  classe: ClassType;
  atributos: PlayerAttributes;
  titulo: string;
}

export interface Achievement {
  id: string;
  titulo: string;
  descricao: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameState {
  player: Player;
  missions: {
    ativas: Mission[];
    completadas: Mission[];
  };
  achievements: Achievement[];
  settings: {
    som: boolean;
    notificacoes: boolean;
    autoBackup: boolean;
  };
  metadata: {
    versao: string;
    dataCriacao: string;
    ultimoSave: string;
  };
}
