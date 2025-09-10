import { useState } from 'react';
import { Player } from '../types/fantasy';
import { NFLDataService, NFLPlayerData } from '../services/nflApi';

export const useNFLData = () => {
  const [nflData, setNflData] = useState<NFLPlayerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nflService = new NFLDataService();

  const fetchWeek1Data = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await nflService.fetchWeek1Stats();
      setNflData(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFL data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const convertToFantasyPlayers = (nflData: NFLPlayerData[]): Player[] => {
    return nflData.map((nflPlayer, index) => {
      const fantasyPoints = nflService.calculateFantasyPoints(nflPlayer.week1Stats);
      
      return {
        id: nflPlayer.playerId || `nfl-${index}`,
        name: nflPlayer.name,
        position: nflPlayer.position as any,
        team: nflPlayer.team,
        points: fantasyPoints,
        projectedPoints: fantasyPoints * (0.9 + Math.random() * 0.2), // ±10% variance
        stats: {
          passingYards: nflPlayer.week1Stats.passingYards || 0,
          passingTDs: nflPlayer.week1Stats.passingTDs || 0,
          completions: nflPlayer.week1Stats.completions || 0,
          interceptions: nflPlayer.week1Stats.interceptions || 0,
          sacks: nflPlayer.week1Stats.sacks || 0,
          rushingYards: nflPlayer.week1Stats.rushingYards || 0,
          rushingTDs: nflPlayer.week1Stats.rushingTDs || 0,
          rushingAttempts: nflPlayer.week1Stats.rushingAttempts || 0,
          receivingYards: nflPlayer.week1Stats.receivingYards || 0,
          receivingTDs: nflPlayer.week1Stats.receivingTDs || 0,
          receptions: nflPlayer.week1Stats.receptions || 0,
          fumblesLost: nflPlayer.week1Stats.fumblesLost || 0,
          twoPointConversions: nflPlayer.week1Stats.twoPointConversions || 0,
          extraPointsMade: nflPlayer.week1Stats.extraPointsMade || 0,
          extraPointsMissed: nflPlayer.week1Stats.extraPointsMissed || 0,
          fieldGoalsMade0to39: nflPlayer.week1Stats.fieldGoalsMade0to39 || 0,
          fieldGoalsMissed0to39: nflPlayer.week1Stats.fieldGoalsMissed0to39 || 0,
          fieldGoalsMade40to49: nflPlayer.week1Stats.fieldGoalsMade40to49 || 0,
          fieldGoalsMissed40to49: nflPlayer.week1Stats.fieldGoalsMissed40to49 || 0,
          fieldGoalsMade50Plus: nflPlayer.week1Stats.fieldGoalsMade50Plus || 0,
          fieldGoalsMissed50Plus: nflPlayer.week1Stats.fieldGoalsMissed50Plus || 0,
          defensiveSacks: nflPlayer.week1Stats.defensiveSacks || 0,
          defensiveTurnovers: nflPlayer.week1Stats.defensiveTurnovers || 0,
          defensiveSafeties: nflPlayer.week1Stats.defensiveSafeties || 0,
          defensiveTDs: nflPlayer.week1Stats.defensiveTDs || 0,
          defensiveYardsAllowed: nflPlayer.week1Stats.defensiveYardsAllowed || 0,
          defensivePointsAllowed: nflPlayer.week1Stats.defensivePointsAllowed || 0,
        },
        isAvailable: true,
      };
    });
  };

  return {
    nflData,
    loading,
    error,
    fetchWeek1Data,
    convertToFantasyPlayers,
  };
};