import { FantasyTeam, Player } from '../types/fantasy';

// Value-based draft scoring - prioritize players by expected value
function calculateDraftValue(player: Player, position: string, round: number): number {
  // Base value is projected points (expected value)
  let value = player.projectedPoints || player.points;
  
  // Position scarcity multipliers (fewer good players = higher multiplier)
  const scarcityMultipliers = {
    QB: 1.0,   // Many good QBs available
    RB: 1.3,   // RBs are scarce and valuable
    WR: 1.1,   // Moderate scarcity
    TE: 1.4,   // Very scarce after top tier
    K: 0.8,    // Less valuable overall
    DEF: 0.9   // Less valuable overall
  };
  
  const positionMultiplier = scarcityMultipliers[player.position as keyof typeof scarcityMultipliers] || 1.0;
  value *= positionMultiplier;
  
  // Early round bonus (draft best players first)
  if (round <= 5) {
    value *= 1.2;
  } else if (round <= 10) {
    value *= 1.1;
  }
  
  // Add small random factor to prevent identical values
  value += Math.random() * 0.1;
  
  return value;
}

// Team names and owners for autodraft
const teamData = [
  { name: 'Gridiron Gladiators', owner: 'Dad' },
  { name: 'Sunday Warriors', owner: 'Mom' },
  { name: 'End Zone Elites', owner: 'Gabriella' },
  { name: 'Touchdown Titans', owner: 'Christopher' },
  { name: 'Fantasy Phenoms', owner: 'Dominic' },
  { name: 'Championship Chasers', owner: 'Thomas' },
  { name: 'Pigskin Pros', owner: 'Indy' },
  { name: 'Victory Vanguard', owner: 'Tristan' },
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

// Generate wins/losses based on total points
function generateRecord(totalPoints: number) {
  const performance = totalPoints / 150;
  const baseWins = Math.floor(performance * 1);
  const wins = Math.max(0, Math.min(1, baseWins));
  const losses = 1 - wins;
  
  return { wins, losses, ties: 0 };
}

// Define exact roster requirements per team
const ROSTER_REQUIREMENTS = {
  QB: 4,
  RB: 7,
  WR: 10,
  TE: 4,
  K: 2,
  DEF: 2,
  'RB/WR': 1,
  'WR/TE': 1,
  'K/DEF': 1
};

export function generateAutodraftTeams(playerDatabase: Player[]): FantasyTeam[] {
  if (!playerDatabase || playerDatabase.length === 0) {
    console.log('No real NFL data provided, using mock data');
    // Fallback to mock data if no real data provided
    const { mockPlayers } = require('./mockData');
    return generateAutodraftTeams(mockPlayers);
  }
  
  console.log('=== STARTING AUTODRAFT ===');
  console.log('Using real NFL players:', playerDatabase.length);
  
  // Sort players by projected points for better draft quality
  const sortedPlayers = [...playerDatabase].sort((a, b) => (b.projectedPoints || b.points) - (a.projectedPoints || a.points));
  console.log('Players sorted by projected value');
  
  // Initialize teams
  const teams: FantasyTeam[] = [];
  const shuffledTeamData = shuffleArray(teamData);
  
  for (let i = 0; i < 8; i++) {
    teams.push({
      id: `team-${i + 1}`,
      name: shuffledTeamData[i].name,
      owner: shuffledTeamData[i].owner,
      players: [],
      totalPoints: 0,
      weeklyPoints: [],
      wins: 0,
      losses: 0,
      ties: 0,
    });
  }
  
  // Track drafted players and NFL teams used by each fantasy team
  const draftedPlayerIds = new Set<string>();
  const teamNFLTeams = teams.map(() => new Set<string>());
  
  // Smart draft with lookahead and conflict avoidance
  smartDraft(teams, sortedPlayers, draftedPlayerIds, teamNFLTeams);
  
  // Calculate team stats
  teams.forEach(team => {
    const totalPoints = team.players.reduce((sum, player) => sum + player.points, 0);
    const weeklyPoints = [totalPoints];
    const record = generateRecord(totalPoints);
    
    team.totalPoints = totalPoints;
    team.weeklyPoints = weeklyPoints;
    team.wins = record.wins;
    team.losses = record.losses;
    team.ties = record.ties;
  });
  
  console.log('=== AUTODRAFT COMPLETE ===');
  teams.forEach(team => {
    console.log(`${team.name}: ${team.players.length} players, ${team.totalPoints.toFixed(1)} points`);
  });
  
  return teams;
}

function smartDraft(
  teams: FantasyTeam[],
  allPlayers: Player[],
  draftedPlayerIds: Set<string>,
  teamNFLTeams: Set<string>[]
) {
  // Create draft requirements for each team
  const teamRequirements = teams.map(() => ({ ...ROSTER_REQUIREMENTS }));
  
  // Continue drafting until all teams are complete
  let round = 0;
  while (teams.some(team => team.players.length < 32)) {
    round++;
    console.log(`\n=== DRAFT ROUND ${round} ===`);
    
    for (let teamIndex = 0; teamIndex < 8; teamIndex++) {
      const team = teams[teamIndex];
      const requirements = teamRequirements[teamIndex];
      
      if (team.players.length >= 32) continue; // Team is complete
      
      // Find the best position to draft based on smart logic
      const positionToDraft = findBestPositionToDraft(
        requirements,
        allPlayers,
        draftedPlayerIds,
        teamNFLTeams[teamIndex],
        teamNFLTeams
      );
      
      if (positionToDraft) {
        const draftedPlayer = draftPlayerForPosition(
          positionToDraft,
          allPlayers,
          draftedPlayerIds,
          teamNFLTeams[teamIndex],
          round
        );
        
        if (draftedPlayer) {
          team.players.push(draftedPlayer);
          draftedPlayerIds.add(draftedPlayer.id);
          teamNFLTeams[teamIndex].add(draftedPlayer.team);
          
          // Update requirements
          if (positionToDraft.includes('/')) {
            requirements[positionToDraft as keyof typeof requirements]--;
          } else {
            requirements[positionToDraft as keyof typeof requirements]--;
          }
          
        } else {
          console.log(`${team.name} could not draft ${positionToDraft}`);
        }
      }
    }
    
    // Safety check to prevent infinite loops
    if (round > 50) {
      console.log('Draft safety limit reached');
      break;
    }
  }
}

function findBestPositionToDraft(
  requirements: typeof ROSTER_REQUIREMENTS,
  allPlayers: Player[],
  draftedPlayerIds: Set<string>,
  usedNFLTeams: Set<string>,
  allTeamNFLTeams: Set<string>[]
): string | null {
  // Get positions still needed
  const neededPositions = Object.entries(requirements)
    .filter(([_, count]) => count > 0)
    .map(([position, _]) => position);
  
  if (neededPositions.length === 0) return null;
  
  // Priority 1: Must-draft positions (only one option left)
  for (const position of neededPositions) {
    const availableCount = countAvailablePlayersForPosition(
      position,
      allPlayers,
      draftedPlayerIds,
      usedNFLTeams
    );
    
    if (availableCount === 1) {
      console.log(`  MUST DRAFT ${position} - only 1 available`);
      return position;
    }
  }
  
  // Priority 2: Scarce positions (fewer available than teams that need them)
  const scarcityScores = neededPositions.map(position => {
    const available = countAvailablePlayersForPosition(
      position,
      allPlayers,
      draftedPlayerIds,
      usedNFLTeams
    );
    
    // Count how many other teams still need this position
    const teamsNeedingPosition = allTeamNFLTeams.filter((_, teamIndex) => {
      // This is a simplified check - in a real implementation you'd track each team's requirements
      return true; // Assume all teams might need this position
    }).length;
    
    return {
      position,
      available,
      scarcity: available / Math.max(teamsNeedingPosition, 1)
    };
  });
  
  // Sort by scarcity (lowest first)
  scarcityScores.sort((a, b) => a.scarcity - b.scarcity);
  
  // Priority 3: Avoid being the last team to use an NFL team
  for (const { position } of scarcityScores) {
    const eligiblePlayers = getEligiblePlayersForPosition(
      position,
      allPlayers,
      draftedPlayerIds,
      usedNFLTeams
    );
    
    // Check if any of these players are from NFL teams that other fantasy teams haven't used
    const safePlayer = eligiblePlayers.find(player => {
      const teamsUsingThisNFLTeam = allTeamNFLTeams.filter(teamNFLTeams => 
        teamNFLTeams.has(player.team)
      ).length;
      
      // Prefer players from NFL teams that fewer fantasy teams have used
      return teamsUsingThisNFLTeam < 7; // Less than 7 out of 8 teams
    });
    
    if (safePlayer) {
      console.log(`  SAFE PICK ${position} from ${safePlayer.team}`);
      return position;
    }
  }
  
  // Fallback: Just pick the first available position
  return neededPositions[0];
}

function countAvailablePlayersForPosition(
  position: string,
  allPlayers: Player[],
  draftedPlayerIds: Set<string>,
  usedNFLTeams: Set<string>
): number {
  return getEligiblePlayersForPosition(position, allPlayers, draftedPlayerIds, usedNFLTeams).length;
}

function getEligiblePlayersForPosition(
  position: string,
  allPlayers: Player[],
  draftedPlayerIds: Set<string>,
  usedNFLTeams: Set<string>
): Player[] {
  if (position.includes('/')) {
    // Flex position
    const [pos1, pos2] = position.split('/');
    return allPlayers.filter(player => 
      (player.position === pos1 || player.position === pos2) &&
      !draftedPlayerIds.has(player.id) &&
      !usedNFLTeams.has(player.team)
    );
  } else {
    // Regular position
    return allPlayers.filter(player => 
      player.position === position &&
      !draftedPlayerIds.has(player.id) &&
      !usedNFLTeams.has(player.team)
    );
  }
}

function draftPlayerForPosition(
  position: string,
  allPlayers: Player[],
  draftedPlayerIds: Set<string>,
  usedNFLTeams: Set<string>,
  round: number = 1
): Player | null {
  const eligiblePlayers = getEligiblePlayersForPosition(position, allPlayers, draftedPlayerIds, usedNFLTeams);
  
  if (eligiblePlayers.length > 0) {
    // Sort by draft value (highest first) for value-based drafting
    const sortedPlayers = eligiblePlayers.sort((a, b) => {
      const valueA = calculateDraftValue(a, position, round);
      const valueB = calculateDraftValue(b, position, round);
      return valueB - valueA;
    });
    
    const selectedPlayer = sortedPlayers[0];
    console.log(`  Selected: ${selectedPlayer.name} (${selectedPlayer.team}) - ${selectedPlayer.position} - Value: ${calculateDraftValue(selectedPlayer, position, round).toFixed(1)}`);
    
    if (position.includes('/')) {
      // Mark flex position
      return {
        ...selectedPlayer,
        flexPosition: position as any
      };
    } else {
      return selectedPlayer;
    }
  }
  
  return null;
}

function createUniquePlayerPool(originalPlayers: Player[]): Player[] {
  const allPlayers: Player[] = [];
  
  // We need 256 total players (8 teams × 32 players each)
  // But we need to respect the "one player per NFL team per fantasy team" rule
  // So we'll create variations of our base players with different NFL teams
  
  const nflTeams = [
    'BUF', 'MIA', 'NE', 'NYJ', 'BAL', 'CIN', 'CLE', 'PIT',
    'HOU', 'IND', 'JAX', 'TEN', 'DEN', 'KC', 'LV', 'LAC',
    'DAL', 'NYG', 'PHI', 'WAS', 'CHI', 'DET', 'GB', 'MIN',
    'ATL', 'CAR', 'NO', 'TB', 'ARI', 'LAR', 'SF', 'SEA'
  ];
  
  // Create unique player names to avoid duplicates
  const playerNamesByPosition: { [key: string]: string[] } = {
    QB: [
      'Josh Allen', 'Lamar Jackson', 'Patrick Mahomes', 'Joe Burrow', 'Dak Prescott', 
      'Jalen Hurts', 'Tua Tagovailoa', 'Aaron Rodgers', 'Russell Wilson', 'Kirk Cousins',
      'Geno Smith', 'Justin Herbert', 'Trevor Lawrence', 'Anthony Richardson', 'Caleb Williams',
      'Jayden Daniels', 'Drake Maye', 'Bo Nix', 'C.J. Stroud', 'Bryce Young',
      'Mac Jones', 'Daniel Jones', 'Sam Darnold', 'Gardner Minshew', 'Jacoby Brissett',
      'Andy Dalton', 'Ryan Tannehill', 'Jimmy Garoppolo', 'Tyler Huntley', 'Mason Rudolph',
      'Cooper Rush', 'Mitch Trubisky'
    ],
    RB: [
      'Christian McCaffrey', 'Derrick Henry', 'Saquon Barkley', 'Josh Jacobs', 'Alvin Kamara',
      'Nick Chubb', 'Austin Ekeler', 'Tony Pollard', 'Isiah Pacheco', 'Kenneth Walker III',
      'Joe Mixon', 'Aaron Jones', 'Najee Harris', 'Javonte Williams', 'Miles Sanders',
      'Dameon Pierce', 'Travis Etienne', 'Breece Hall', 'Jonathan Taylor', 'Dalvin Cook',
      'Leonard Fournette', 'Ezekiel Elliott', 'James Conner', 'David Montgomery', 'Rhamondre Stevenson',
      'Alexander Mattison', 'Rachaad White', 'Tyler Allgeier', 'Samaje Perine', 'Gus Edwards',
      'Kareem Hunt', 'Cam Akers', 'D\'Andre Swift', 'James Robinson', 'Clyde Edwards-Helaire',
      'Antonio Gibson', 'Elijah Mitchell', 'Chuba Hubbard', 'Khalil Herbert', 'AJ Dillon',
      'Damien Harris', 'Melvin Gordon', 'Sony Michel', 'Latavius Murray', 'Jerick McKinnon',
      'Rex Burkhead', 'Nyheim Hines', 'Deon Jackson', 'Jordan Mason', 'Ty Johnson',
      'Kenneth Gainwell', 'Boston Scott', 'Dare Ogunbowale', 'Ty Chandler', 'Justice Hill',
      'Craig Reynolds', 'Royce Freeman', 'Mike Boone', 'Zack Moss', 'Jamaal Williams',
      'Matt Breida', 'Jalen Richard', 'Phillip Lindsay', 'Giovani Bernard', 'Wayne Gallman'
    ],
    WR: [
      'Tyreek Hill', 'CeeDee Lamb', 'A.J. Brown', 'Stefon Diggs', 'Davante Adams',
      'DeAndre Hopkins', 'Mike Evans', 'Cooper Kupp', 'Ja\'Marr Chase', 'Justin Jefferson',
      'DK Metcalf', 'Terry McLaurin', 'Amari Cooper', 'Keenan Allen', 'Mike Williams',
      'Courtland Sutton', 'DJ Moore', 'Calvin Ridley', 'Chris Godwin', 'Tee Higgins',
      'Jaylen Waddle', 'Amon-Ra St. Brown', 'Garrett Wilson', 'Chris Olave', 'Drake London',
      'Jahan Dotson', 'George Pickens', 'Christian Watson', 'Skyy Moore', 'Treylon Burks',
      'Tyler Lockett', 'Brandon Aiyuk', 'Deebo Samuel', 'Michael Pittman Jr.', 'Hollywood Brown',
      'Allen Robinson', 'Robert Woods', 'Adam Thielen', 'Hunter Renfrow', 'Jarvis Landry',
      'Kenny Golladay', 'Corey Davis', 'Nelson Agholor', 'Mecole Hardman', 'Kendrick Bourne',
      'Jakobi Meyers', 'DeVante Parker', 'Tyler Boyd', 'Cole Beasley', 'Jamison Crowder',
      'Sterling Shepard', 'Darius Slayton', 'Parris Campbell', 'Van Jefferson', 'Tutu Atwell',
      'Rondale Moore', 'Andy Isabella', 'KJ Hamler', 'Jerry Jeudy', 'Tim Patrick',
      'Russell Gage', 'Olamide Zaccheaus', 'Bryan Edwards', 'Zay Jones', 'Marvin Jones Jr.',
      'DJ Chark', 'Laviska Shenault', 'Collin Johnson', 'Keelan Cole', 'Phillip Dorsett',
      'Isaiah McKenzie', 'Gabriel Davis', 'Stefon Diggs', 'Cole Beasley', 'Matt Breida',
      'Devin Singletary', 'Zack Moss', 'Taiwan Jones', 'Andre Roberts', 'Isaiah Hodgins',
      'Trent Sherfield', 'Nyheim Hines', 'Reggie Gilliam', 'Taiwan Jones', 'Matt Haack',
      'Jordan Phillips', 'Harrison Phillips', 'Ed Oliver', 'Boogie Basham', 'AJ Epenesa'
    ],
    TE: [
      'Travis Kelce', 'Mark Andrews', 'George Kittle', 'T.J. Hockenson', 'Darren Waller',
      'Kyle Pitts', 'Dallas Goedert', 'Pat Freiermuth', 'David Njoku', 'Evan Engram',
      'Tyler Higbee', 'Gerald Everett', 'Logan Thomas', 'Robert Tonyan', 'Noah Fant',
      'Albert Okwuegbunam', 'Mike Gesicki', 'Hunter Henry', 'Jonnu Smith', 'Tyler Kroft',
      'C.J. Uzomah', 'Zach Ertz', 'Cameron Brate', 'O.J. Howard', 'Cade Otton',
      'Irv Smith Jr.', 'Tyler Conklin', 'Jeremy Ruckert', 'Trevon Wesco', 'Ryan Griffin',
      'Austin Hooper', 'Pharaoh Brown', 'Jordan Akins', 'Brevin Jordan', 'Teagan Quitoriano',
      'Isaiah Likely', 'Charlie Kolar', 'Josh Oliver', 'Foster Moreau', 'Daniel Bellinger'
    ],
    K: [
      'Justin Tucker', 'Harrison Butker', 'Tyler Bass', 'Daniel Carlson', 'Younghoe Koo',
      'Jason Sanders', 'Evan McPherson', 'Nick Folk', 'Brandon McManus', 'Matt Gay',
      'Jake Elliott', 'Chris Boswell', 'Wil Lutz', 'Ryan Succop', 'Cairo Santos',
      'Mason Crosby', 'Greg Zuerlein', 'Robbie Gould', 'Matt Prater', 'Jason Myers',
      'Dustin Hopkins', 'Graham Gano', 'Ka\'imi Fairbairn', 'Rodrigo Blankenship'
    ],
    DEF: [
      'San Francisco', 'Pittsburgh', 'Buffalo', 'Baltimore', 'Philadelphia', 'Dallas',
      'New England', 'Denver', 'Miami', 'Cleveland', 'Green Bay', 'Tampa Bay',
      'Indianapolis', 'New Orleans', 'Kansas City', 'Los Angeles Rams', 'Minnesota',
      'Tennessee', 'Chicago', 'Seattle', 'Las Vegas', 'Los Angeles Chargers',
      'Cincinnati', 'Detroit', 'Jacksonville', 'Carolina', 'Arizona', 'Atlanta',
      'Houston', 'New York Giants', 'New York Jets', 'Washington'
    ]
  };

  // Group players by position
  const playersByPosition: { [key: string]: Player[] } = {};
  originalPlayers.forEach(player => {
    if (!playersByPosition[player.position]) {
      playersByPosition[player.position] = [];
    }
    playersByPosition[player.position].push(player);
  });
  
  // Create enough players for each position across all teams
  const positionsNeeded = {
    QB: 8 * 4,   // 32 total QBs needed
    RB: 8 * 8,   // 64 total RBs needed (7 base + 1 flex)
    WR: 8 * 11,  // 88 total WRs needed (10 base + 1 flex)
    TE: 8 * 5,   // 40 total TEs needed (4 base + 1 flex)
    K: 8 * 3,    // 24 total Ks needed (2 base + 1 flex)
    DEF: 8 * 3,  // 24 total DEFs needed (2 base + 1 flex)
  };
  
  let playerId = 1000;
  
  // Create players for each position
  Object.entries(positionsNeeded).forEach(([position, count]) => {
    const basePlayers = playersByPosition[position] || [];
    const availableNames = playerNamesByPosition[position] || [];
    if (basePlayers.length === 0) return;
    
    for (let i = 0; i < count; i++) {
      const basePlayerOfPosition = basePlayers[i % basePlayers.length];
      const nameIndex = i % availableNames.length;
      const playerName = availableNames[nameIndex];
      
      const uniquePlayer: Player = {
        ...basePlayerOfPosition,
        id: `${position}-${playerId++}`,
        name: playerName,
        team: nflTeams[i % nflTeams.length],
        points: basePlayerOfPosition.points * (0.8 + Math.random() * 0.4), // Vary points ±20%
        projectedPoints: basePlayerOfPosition.projectedPoints * (0.8 + Math.random() * 0.4),
        stats: {
          ...basePlayerOfPosition.stats,
          passingYards: basePlayerOfPosition.stats.passingYards ? Math.floor(basePlayerOfPosition.stats.passingYards * (0.8 + Math.random() * 0.4)) : undefined,
          rushingYards: basePlayerOfPosition.stats.rushingYards ? Math.floor(basePlayerOfPosition.stats.rushingYards * (0.8 + Math.random() * 0.4)) : undefined,
          receivingYards: basePlayerOfPosition.stats.receivingYards ? Math.floor(basePlayerOfPosition.stats.receivingYards * (0.8 + Math.random() * 0.4)) : undefined,
        },
        isAvailable: true,
      };
      
      allPlayers.push(uniquePlayer);
    }
  });
  
  // Shuffle the entire pool to randomize the draft
  return shuffleArray(allPlayers);
}

// Update available players after autodraft
export function updateAvailablePlayersAfterDraft(teams: FantasyTeam[], playerDatabase?: Player[]): Player[] {
  const playersToUse = playerDatabase || [];
  const draftedPlayerIds = new Set<string>();
  
  teams.forEach(team => {
    team.players.forEach(player => {
      draftedPlayerIds.add(player.id);
    });
  });
  
  return playersToUse.map(player => ({
    ...player,
    isAvailable: !draftedPlayerIds.has(player.id),
  }));
}