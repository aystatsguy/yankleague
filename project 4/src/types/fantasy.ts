export interface Player {
  id: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team: string;
  points: number;
  projectedPoints: number;
  stats: PlayerStats;
  isAvailable: boolean;
  flexPosition?: 'RB/WR' | 'WR/TE' | 'K/DEF'; // Track if this player is in a flex spot
}

export interface PlayerStats {
  passingYards?: number;
  passingTDs?: number;
  completions?: number;
  interceptions?: number;
  sacks?: number;
  rushingYards?: number;
  rushingTDs?: number;
  rushingAttempts?: number;
  receivingYards?: number;
  receivingTDs?: number;
  receptions?: number;
  fumblesLost?: number;
  twoPointConversions?: number;
  // Kicker stats
  extraPointsMade?: number;
  extraPointsMissed?: number;
  fieldGoalsMade0to39?: number;
  fieldGoalsMissed0to39?: number;
  fieldGoalsMade40to49?: number;
  fieldGoalsMissed40to49?: number;
  fieldGoalsMade50Plus?: number;
  fieldGoalsMissed50Plus?: number;
  // Defense stats
  defensiveSacks?: number;
  defensiveTurnovers?: number;
  defensiveSafeties?: number;
  defensiveTDs?: number;
  defensiveYardsAllowed?: number;
  defensivePointsAllowed?: number;
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
  completions: number;
  interceptions: number;
  sacks: number;
  rushingYards: number;
  rushingTDs: number;
  rushingAttempts: number;
  receivingYards: number;
  receivingTDs: number;
  receptions: number;
  fumbles: number;
  twoPointConversions: number;
  // Kicker scoring
  extraPointsMade: number;
  extraPointsMissed: number;
  fieldGoalsMade0to39: number;
  fieldGoalsMissed0to39: number;
  fieldGoalsMade40to49: number;
  fieldGoalsMissed40to49: number;
  fieldGoalsMade50Plus: number;
  fieldGoalsMissed50Plus: number;
  // Defense scoring
  defensiveSacks: number;
  defensiveTurnovers: number;
  defensiveSafeties: number;
  defensiveTDs: number;
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