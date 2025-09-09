import { FantasyTeam, Player } from '../types/fantasy';
import { nflPlayerDatabase } from './nflPlayers';

// Team names and owners for autodraft
const teamData = [
  { name: 'Gridiron Gladiators', owner: 'Alex Rodriguez' },
  { name: 'Sunday Warriors', owner: 'Sarah Johnson' },
  { name: 'End Zone Elites', owner: 'Mike Thompson' },
  { name: 'Touchdown Titans', owner: 'Jessica Chen' },
  { name: 'Fantasy Phenoms', owner: 'David Wilson' },
  { name: 'Championship Chasers', owner: 'Emily Davis' },
  { name: 'Pigskin Pros', owner: 'Chris Martinez' },
  { name: 'Victory Vanguard', owner: 'Amanda Taylor' },
];

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get players by position, sorted by projected points
function getPlayersByPosition(position: string, exclude: Set<string> = new Set()): Player[] {
  return nflPlayerDatabase
    .filter(p => p.position === position && !exclude.has(p.team))
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

// Draft a balanced roster for a team
function draftTeamRoster(teamId: string, usedNFLTeams: Set<string>): Player[] {
  const roster: Player[] = [];
  const teamNFLTeams = new Set<string>();

  // Helper function to draft players from a position
  const draftFromPosition = (position: string, count: number) => {
    const availablePlayers = getPlayersByPosition(position, teamNFLTeams);
    let drafted = 0;
    
    for (const player of availablePlayers) {
      if (drafted >= count) break;
      if (!usedNFLTeams.has(player.team) && !teamNFLTeams.has(player.team)) {
        roster.push({ ...player, isAvailable: false });
        usedNFLTeams.add(player.team);
        teamNFLTeams.add(player.team);
        drafted++;
      }
    }
  };

  // Draft exactly 4 QBs (required)
  draftFromPosition('QB', 4);
  
  // Draft RBs (up to 7)
  draftFromPosition('RB', 7);
  
  // Draft WRs (up to 10)
  draftFromPosition('WR', 10);
  
  // Draft TEs (up to 4)
  draftFromPosition('TE', 4);
  
  // Draft Ks (up to 2)
  draftFromPosition('K', 2);
  
  // Draft DEFs (up to 2)
  draftFromPosition('DEF', 2);

  // Calculate total points and weekly points
  const totalPoints = roster.reduce((sum, player) => sum + player.points, 0);
  const weeklyPoints = [
    totalPoints + (Math.random() - 0.5) * 20,
    totalPoints + (Math.random() - 0.5) * 25,
    totalPoints + (Math.random() - 0.5) * 18,
  ];

  return roster;
}

// Generate wins/losses based on total points
function generateRecord(totalPoints: number, maxPoints: number) {
  const performance = totalPoints / maxPoints;
  const baseWins = Math.floor(performance * 3);
  const wins = Math.max(0, Math.min(3, baseWins + (Math.random() > 0.5 ? 1 : 0)));
  const losses = 3 - wins;
  
  return { wins, losses, ties: 0 };
}

export function generateAutodraftTeams(): FantasyTeam[] {
  const teams: FantasyTeam[] = [];
  const usedNFLTeams = new Set<string>();
  
  // Shuffle team data for variety
  const shuffledTeamData = shuffleArray(teamData);
  
  for (let i = 0; i < 8; i++) {
    const teamInfo = shuffledTeamData[i];
    const roster = draftTeamRoster(`team-${i + 1}`, usedNFLTeams);
    const totalPoints = roster.reduce((sum, player) => sum + player.points, 0);
    
    // Generate realistic weekly points with some variance
    const weeklyPoints = [totalPoints * (0.95 + Math.random() * 0.1)]; // Only Week 1 played
    
    const actualTotal = weeklyPoints.reduce((sum, points) => sum + points, 0);
    const record = generateRecord(actualTotal, 200); // Only 1 week played
    
    const team: FantasyTeam = {
      id: `team-${i + 1}`,
      name: teamInfo.name,
      owner: teamInfo.owner,
      players: roster,
      totalPoints: actualTotal,
      weeklyPoints,
      ...record,
    };
    
    teams.push(team);
  }
  
  return teams;
}

// Update available players after autodraft
export function updateAvailablePlayersAfterDraft(teams: FantasyTeam[]): Player[] {
  const draftedPlayerIds = new Set<string>();
  const draftedNFLTeams = new Set<string>();
  
  teams.forEach(team => {
    team.players.forEach(player => {
      draftedPlayerIds.add(player.id);
      draftedNFLTeams.add(player.team);
    });
  });
  
  return nflPlayerDatabase.map(player => ({
    ...player,
    isAvailable: !draftedPlayerIds.has(player.id),
  }));
}