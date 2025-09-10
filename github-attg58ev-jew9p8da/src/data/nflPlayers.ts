// This file contains a comprehensive database of NFL players with realistic Week 1 statistics
// Generated to provide a robust foundation for the fantasy football application

import { Player } from '../types/fantasy';

// Helper function to calculate fantasy points based on stats
const calculateFantasyPoints = (stats: any): number => {
  const scoring = {
    passingYards: 0.033333333333333,
    passingTDs: 6,
    completions: 0.2,
    interceptions: -2,
    sacks: -1,
    rushingYards: 0.1,
    rushingTDs: 6,
    rushingAttempts: 0.2,
    receivingYards: 0.1,
    receivingTDs: 6,
    receptions: 0.33333333333333,
    fumbles: -2,
    twoPointConversions: 2,
    extraPointsMade: 1,
    extraPointsMissed: -1,
    fieldGoalsMade0to39: 3,
    fieldGoalsMissed0to39: -1,
    fieldGoalsMade40to49: 4,
    fieldGoalsMissed40to49: -0.5,
    fieldGoalsMade50Plus: 5,
    fieldGoalsMissed50Plus: 0,
    defensiveSacks: 1,
    defensiveTurnovers: 2,
    defensiveSafeties: 2,
    defensiveTDs: 6,
  };

  let points = 0;
  points += (stats.passingYards || 0) * scoring.passingYards;
  points += (stats.passingTDs || 0) * scoring.passingTDs;
  points += (stats.completions || 0) * scoring.completions;
  points += (stats.interceptions || 0) * scoring.interceptions;
  points += (stats.sacks || 0) * scoring.sacks;
  points += (stats.rushingYards || 0) * scoring.rushingYards;
  points += (stats.rushingTDs || 0) * scoring.rushingTDs;
  points += (stats.rushingAttempts || 0) * scoring.rushingAttempts;
  points += (stats.receivingYards || 0) * scoring.receivingYards;
  points += (stats.receivingTDs || 0) * scoring.receivingTDs;
  points += (stats.receptions || 0) * scoring.receptions;
  points += (stats.fumblesLost || 0) * scoring.fumblesLost;
  points += (stats.twoPointConversions || 0) * scoring.twoPointConversions;
  points += (stats.extraPointsMade || 0) * scoring.extraPointsMade;
  points += (stats.extraPointsMissed || 0) * scoring.extraPointsMissed;
  points += (stats.fieldGoalsMade0to39 || 0) * scoring.fieldGoalsMade0to39;
  points += (stats.fieldGoalsMissed0to39 || 0) * scoring.fieldGoalsMissed0to39;
  points += (stats.fieldGoalsMade40to49 || 0) * scoring.fieldGoalsMade40to49;
  points += (stats.fieldGoalsMissed40to49 || 0) * scoring.fieldGoalsMissed40to49;
  points += (stats.fieldGoalsMade50Plus || 0) * scoring.fieldGoalsMade50Plus;
  points += (stats.fieldGoalsMissed50Plus || 0) * scoring.fieldGoalsMissed50Plus;
  points += (stats.defensiveSacks || 0) * scoring.defensiveSacks;
  points += (stats.defensiveTurnovers || 0) * scoring.defensiveTurnovers;
  points += (stats.defensiveSafeties || 0) * scoring.defensiveSafeties;
  points += (stats.defensiveTDs || 0) * scoring.defensiveTDs;

  // Calculate yards allowed points using the formula: 10 - 0.026(yards allowed)
  if (stats.defensiveYardsAllowed) {
    const yardsAllowedPoints = 10 - (0.026 * stats.defensiveYardsAllowed);
    points += yardsAllowedPoints;
  }

  return Math.round(points * 10) / 10;
};

export const nflPlayerDatabase: Player[] = [
  // Quarterbacks
  {
    id: 'qb-josh-allen',
    name: 'Josh Allen',
    position: 'QB',
    team: 'BUF',
    points: 0,
    projectedPoints: 22.5,
    stats: {
      passingYards: 275,
      passingTDs: 2,
      completions: 18,
      interceptions: 0,
      sacks: 2,
      rushingYards: 45,
      rushingTDs: 1,
      rushingAttempts: 8,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },
  {
    id: 'qb-lamar-jackson',
    name: 'Lamar Jackson',
    position: 'QB',
    team: 'BAL',
    points: 0,
    projectedPoints: 24.1,
    stats: {
      passingYards: 289,
      passingTDs: 2,
      completions: 22,
      interceptions: 1,
      sacks: 1,
      rushingYards: 78,
      rushingTDs: 1,
      rushingAttempts: 12,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },
  {
    id: 'qb-patrick-mahomes',
    name: 'Patrick Mahomes',
    position: 'QB',
    team: 'KC',
    points: 0,
    projectedPoints: 26.4,
    stats: {
      passingYards: 342,
      passingTDs: 3,
      completions: 26,
      interceptions: 0,
      sacks: 1,
      rushingYards: 12,
      rushingTDs: 0,
      rushingAttempts: 3,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },
  {
    id: 'qb-joe-burrow',
    name: 'Joe Burrow',
    position: 'QB',
    team: 'CIN',
    points: 0,
    projectedPoints: 22.9,
    stats: {
      passingYards: 298,
      passingTDs: 2,
      completions: 21,
      interceptions: 1,
      sacks: 2,
      rushingYards: 8,
      rushingTDs: 0,
      rushingAttempts: 2,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },

  // Running Backs
  {
    id: 'rb-christian-mccaffrey',
    name: 'Christian McCaffrey',
    position: 'RB',
    team: 'SF',
    points: 0,
    projectedPoints: 19.8,
    stats: {
      rushingYards: 95,
      rushingTDs: 1,
      rushingAttempts: 18,
      receivingYards: 67,
      receivingTDs: 0,
      receptions: 6,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },
  {
    id: 'rb-derrick-henry',
    name: 'Derrick Henry',
    position: 'RB',
    team: 'BAL',
    points: 0,
    projectedPoints: 15.4,
    stats: {
      rushingYards: 108,
      rushingTDs: 1,
      rushingAttempts: 22,
      receivingYards: 20,
      receivingTDs: 0,
      receptions: 2,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },
  {
    id: 'rb-saquon-barkley',
    name: 'Saquon Barkley',
    position: 'RB',
    team: 'PHI',
    points: 0,
    projectedPoints: 18.2,
    stats: {
      rushingYards: 126,
      rushingTDs: 1,
      rushingAttempts: 24,
      receivingYards: 30,
      receivingTDs: 0,
      receptions: 3,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },

  // Wide Receivers
  {
    id: 'wr-tyreek-hill',
    name: 'Tyreek Hill',
    position: 'WR',
    team: 'MIA',
    points: 0,
    projectedPoints: 16.2,
    stats: {
      receivingYards: 104,
      receivingTDs: 1,
      receptions: 8,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },
  {
    id: 'wr-ceedee-lamb',
    name: 'CeeDee Lamb',
    position: 'WR',
    team: 'DAL',
    points: 0,
    projectedPoints: 18.5,
    stats: {
      receivingYards: 128,
      receivingTDs: 1,
      receptions: 9,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },
  {
    id: 'wr-aj-brown',
    name: 'A.J. Brown',
    position: 'WR',
    team: 'PHI',
    points: 0,
    projectedPoints: 17.1,
    stats: {
      receivingYards: 112,
      receivingTDs: 1,
      receptions: 7,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },

  // Tight Ends
  {
    id: 'te-travis-kelce',
    name: 'Travis Kelce',
    position: 'TE',
    team: 'KC',
    points: 0,
    projectedPoints: 14.1,
    stats: {
      receivingYards: 86,
      receivingTDs: 1,
      receptions: 7,
      twoPointConversions: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },

  // Kickers
  {
    id: 'k-justin-tucker',
    name: 'Justin Tucker',
    position: 'K',
    team: 'BAL',
    points: 0,
    projectedPoints: 8.5,
    stats: {
      extraPointsMade: 2,
      extraPointsMissed: 0,
      fieldGoalsMade0to39: 1,
      fieldGoalsMissed0to39: 0,
      fieldGoalsMade40to49: 1,
      fieldGoalsMissed40to49: 0,
      fieldGoalsMade50Plus: 0,
      fieldGoalsMissed50Plus: 0,
      defensiveYardsAllowed: 0,
    },
    isAvailable: true,
  },

  // Defenses
  {
    id: 'def-san-francisco',
    name: 'San Francisco',
    position: 'DEF',
    team: 'SF',
    points: 0,
    projectedPoints: 7.8,
    stats: {
      defensiveSacks: 3,
      defensiveTurnovers: 2,
      defensiveSafeties: 0,
      defensiveTDs: 1,
      defensiveYardsAllowed: 298,
      defensivePointsAllowed: 14,
    },
    isAvailable: true,
  },
  {
    id: 'def-baltimore',
    name: 'Baltimore',
    position: 'DEF',
    team: 'BAL',
    points: 0,
    projectedPoints: 6.5,
    stats: {
      defensiveSacks: 2,
      defensiveTurnovers: 1,
      defensiveSafeties: 0,
      defensiveTDs: 0,
      defensiveYardsAllowed: 345,
      defensivePointsAllowed: 21,
    },
    isAvailable: true,
  },
];

// Calculate actual points for all players
nflPlayerDatabase.forEach(player => {
  player.points = calculateFantasyPoints(player.stats);
});