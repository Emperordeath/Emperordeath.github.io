import { GameState, Mission, Player } from '@/types/game';

export class GameService {
  // Calculate XP needed for next level
  static calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // Add XP to player and handle level ups
  static addXP(player: Player, xpGained: number): Player {
    let newPlayer = { ...player };
    newPlayer.xp += xpGained;
    newPlayer.xpTotal += xpGained;

    // Check for level up
    while (newPlayer.xp >= newPlayer.xpParaProximoNivel) {
      newPlayer.xp -= newPlayer.xpParaProximoNivel;
      newPlayer.nivel += 1;
      newPlayer.xpParaProximoNivel = this.calculateXPForLevel(newPlayer.nivel);
      
      // Add attribute points on level up
      newPlayer = this.addAttributePoints(newPlayer);
    }

    return newPlayer;
  }

  // Add attribute points based on class
  static addAttributePoints(player: Player): Player {
    const newPlayer = { ...player };
    
    switch (player.classe) {
      case 'guerreiro':
        newPlayer.atributos.forca += 2;
        newPlayer.atributos.agilidade += 1;
        break;
      case 'mago':
        newPlayer.atributos.inteligencia += 2;
        newPlayer.atributos.forca += 1;
        break;
      case 'arqueiro':
        newPlayer.atributos.agilidade += 2;
        newPlayer.atributos.inteligencia += 1;
        break;
    }

    return newPlayer;
  }

  // Calculate XP reward based on difficulty
  static calculateMissionXP(mission: Mission): number {
    const baseXP = {
      diaria: 50,
      semanal: 150,
      mensal: 500,
      epica: 1000,
    };

    const difficultyMultiplier = {
      facil: 1,
      medio: 1.5,
      dificil: 2,
    };

    return Math.floor(baseXP[mission.tipo] * difficultyMultiplier[mission.dificuldade]);
  }

  // Calculate coin reward
  static calculateCoinReward(mission: Mission): number {
    return Math.floor(this.calculateMissionXP(mission) / 10);
  }

  // Complete a mission
  static completeMission(gameState: GameState, missionId: string): GameState {
    const newState = { ...gameState };
    const missionIndex = newState.missions.ativas.findIndex(m => m.id === missionId);
    
    if (missionIndex === -1) return gameState;

    const mission = newState.missions.ativas[missionIndex];
    const xpGained = this.calculateMissionXP(mission);
    const coinsGained = this.calculateCoinReward(mission);

    // Update player
    newState.player = this.addXP(newState.player, xpGained);
    newState.player.moedas += coinsGained;

    // Move mission to completed
    const completedMission = {
      ...mission,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    newState.missions.completadas.push(completedMission);
    newState.missions.ativas.splice(missionIndex, 1);

    // Check achievements
    newState.achievements = this.checkAchievements(newState);

    return newState;
  }

  // Check and unlock achievements
  static checkAchievements(gameState: GameState): typeof gameState.achievements {
    const achievements = [...gameState.achievements];

    achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      switch (achievement.id) {
        case 'first_mission':
          if (gameState.missions.completadas.length >= 1) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
          }
          break;
        case 'level_5':
          if (gameState.player.nivel >= 5) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
          }
          break;
        case 'level_10':
          if (gameState.player.nivel >= 10) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
          }
          break;
      }
    });

    return achievements;
  }

  // Get class info
  static getClassInfo(classe: Player['classe']) {
    const classInfo = {
      guerreiro: {
        name: 'Guerreiro',
        icon: '⚔️',
        description: 'Forte e resistente, domina o combate corpo a corpo',
        primaryStat: 'Força',
        color: 'from-red-500 to-orange-500',
      },
      mago: {
        name: 'Mago',
        icon: '🔮',
        description: 'Sábio e místico, mestre das artes arcanas',
        primaryStat: 'Inteligência',
        color: 'from-purple-500 to-blue-500',
      },
      arqueiro: {
        name: 'Arqueiro',
        icon: '🏹',
        description: 'Ágil e preciso, ataca à distância com maestria',
        primaryStat: 'Agilidade',
        color: 'from-green-500 to-teal-500',
      },
    };

    return classInfo[classe];
  }
}
