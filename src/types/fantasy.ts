export interface Player {
  id: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team: string;
  points: number;
  projectedPoints: number;
  stats: PlayerStats;
  isAvailable: boolean;
}

export interface PlayerStats {
  passingYards?: number;
  passingTDs?: number;
  interceptions?: number;
  rushingYards?: number;
  rushingTDs?: number;
  receivingYards?: number;
  receivingTDs?: number;
  receptions?: number;
  fumbles?: number;
}

export interface FantasyTeam {
  id: string;
  name: string;
  owner: string;
  players: Player[];
  totalPoints: number;
  weeklyPoints: number[];
  wins: number;
  losses: number;
  ties: number;
}

export interface RosterRequirements {
  QB: { min: number; max: number };
  RB: { min: number; max: number };
  WR: { min: number; max: number };
  TE: { min: number; max: number };
  K: { min: number; max: number };
  DEF: { min: number; max: number };
  'RB/WR': { min: number; max: number };
  'WR/TE': { min: number; max: number };
  'K/DEF': { min: number; max: number };
}

export interface League {
  id: string;
  name: string;
  teams: FantasyTeam[];
  currentWeek: number;
  maxTeams: number;
  scoringSettings: ScoringSettings;
  rosterRequirements: RosterRequirements;
}

export interface ScoringSettings {
  passingYards: number;
  passingTDs: number;
  interceptions: number;
  rushingYards: number;
  rushingTDs: number;
  receivingYards: number;
  receivingTDs: number;
  receptions: number;
  fumbles: number;
}

export interface Matchup {
  id: string;
  week: number;
  team1: FantasyTeam;
  team2: FantasyTeam;
  team1Score: number;
  team2Score: number;
  isComplete: boolean;
}