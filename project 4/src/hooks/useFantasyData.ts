import { useState, useEffect } from 'react';
import { League, FantasyTeam, Player, RosterRequirements } from '../types/fantasy';
import { createMockLeague, mockPlayers, defaultScoringSettings } from '../data/mockData';
import { generateAutodraftTeams, updateAvailablePlayersAfterDraft } from '../data/autodraft';
import { useNFLData } from './useNFLData';

export const useFantasyData = () => {
  const { fetchWeek1Data, convertToFantasyPlayers } = useNFLData();
  const [league, setLeague] = useState<League>(() => {
    const baseLeague = createMockLeague();
    return {
      ...baseLeague,
      teams: [], // Start with empty teams for autodraft
    };
  });
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(mockPlayers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAutodraft = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching NFL data for autodraft...');
      
      // Fetch real NFL data
      const nflData = await fetchWeek1Data();
      const realPlayers = convertToFantasyPlayers(nflData);
      
      console.log(`Using ${realPlayers.length} real NFL players for autodraft`);
      
      // Generate 8 teams with autodraft using real NFL data
      const draftedTeams = generateAutodraftTeams(realPlayers);
      
      // Update league with drafted teams
      setLeague(prev => ({
        ...prev,
        teams: draftedTeams,
      }));
      
      // Update available players after draft using real data
      const updatedPlayers = updateAvailablePlayersAfterDraft(draftedTeams, realPlayers);
      setAvailablePlayers(updatedPlayers);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run autodraft';
      setError(errorMessage);
      console.error('Autodraft error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTeam = (teamName: string, ownerName: string) => {
    if (league.teams.length >= league.maxTeams) {
      throw new Error(`League is full (${league.maxTeams} teams maximum)`);
    }

    const newTeam: FantasyTeam = {
      id: `team-${Date.now()}`,
      name: teamName,
      owner: ownerName,
      players: [],
      totalPoints: 0,
      weeklyPoints: [],
      wins: 0,
      losses: 0,
      ties: 0,
    };

    setLeague(prev => ({
      ...prev,
      teams: [...prev.teams, newTeam],
    }));

    return newTeam;
  };

  const addPlayerToTeam = (teamId: string, playerId: string) => {
    const player = availablePlayers.find(p => p.id === playerId);
    if (!player || !player.isAvailable) {
      throw new Error('Player not available');
    }

    // Check if team already has a player from this NFL team
    const team = league.teams.find(t => t.id === teamId);
    if (team && team.players.some(p => p.team === player.team)) {
      throw new Error(`You already have a player from ${player.team}. Each fantasy team can only have one player per NFL team.`);
    }

    // Check roster requirements
    if (team) {
      const positionCount = team.players.filter(p => p.position === player.position).length;
      const requirement = league.rosterRequirements[player.position as keyof RosterRequirements];
      
      if (positionCount >= requirement.max) {
        throw new Error(`Cannot add ${player.position}. Maximum ${requirement.max} ${player.position}s allowed.`);
      }
    }

    setLeague(prev => ({
      ...prev,
      teams: prev.teams.map(team => 
        team.id === teamId 
          ? { ...team, players: [...team.players, player] }
          : team
      ),
    }));

    setAvailablePlayers(prev => 
      prev.map(p => p.id === playerId ? { ...p, isAvailable: false } : p)
    );
  };

  const removePlayerFromTeam = (teamId: string, playerId: string) => {
    const team = league.teams.find(t => t.id === teamId);
    const player = team?.players.find(p => p.id === playerId);
    
    if (!player) return;

    // Check if removing this player would violate minimum requirements
    if (team) {
      const positionCount = team.players.filter(p => p.position === player.position).length;
      const requirement = league.rosterRequirements[player.position as keyof RosterRequirements];
      
      if (positionCount <= requirement.min) {
        throw new Error(`Cannot remove ${player.position}. Minimum ${requirement.min} ${player.position}s required.`);
      }
    }

    setLeague(prev => ({
      ...prev,
      teams: prev.teams.map(t => 
        t.id === teamId 
          ? { ...t, players: t.players.filter(p => p.id !== playerId) }
          : t
      ),
    }));

    setAvailablePlayers(prev => 
      prev.map(p => p.id === playerId ? { ...p, isAvailable: true } : p)
    );
  };

  const refreshPlayerStats = () => {
    // For now, just refresh the display
    setLeague(prev => ({ ...prev }));
  };

  return {
    league,
    availablePlayers: availablePlayers.filter(p => p.isAvailable),
    loading,
    error,
    runAutodraft,
    addTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    refreshPlayerStats,
  };
};