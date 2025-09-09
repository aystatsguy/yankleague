import React, { useState } from 'react';
import { Users, Trophy, TrendingUp, Plus, Minus } from 'lucide-react';
import { FantasyTeam, Player } from '../types/fantasy';
import { PlayerCard } from './PlayerCard';

interface TeamCardProps {
  team: FantasyTeam;
  availablePlayers: Player[];
  onAddPlayer: (teamId: string, playerId: string) => void;
  onRemovePlayer: (teamId: string, playerId: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  availablePlayers, 
  onAddPlayer, 
  onRemovePlayer 
}) => {
  const [showPlayers, setShowPlayers] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const winPct = team.wins / (team.wins + team.losses || 1);
  const avgPoints = team.totalPoints / (team.weeklyPoints.length || 1);

  // Get NFL teams already represented on this fantasy team
  const usedNFLTeams = new Set(team.players.map(p => p.team));
  
  // Filter available players to exclude those from NFL teams already on roster
  const eligiblePlayers = availablePlayers.filter(player => !usedNFLTeams.has(player.team));

  const handleAddPlayer = (teamId: string, playerId: string) => {
    try {
      setError(null);
      onAddPlayer(teamId, playerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add player');
    }
  };

  const handleRemovePlayer = (teamId: string, playerId: string) => {
    try {
      setError(null);
      onRemovePlayer(teamId, playerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove player');
    }
  };

  // Get position counts for roster requirements display
  const getPositionCounts = () => {
    const counts = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DEF: 0, 'RB/WR': 0, 'WR/TE': 0, 'K/DEF': 0 };
    team.players.forEach(player => {
      counts[player.position as keyof typeof counts]++;
    });
    return counts;
  };

  const positionCounts = getPositionCounts();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
            <p className="text-gray-600">{team.owner}</p>
          </div>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{team.totalPoints.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Total Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {team.wins}-{team.losses}
            </p>
            <p className="text-xs text-gray-500">Record</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{avgPoints.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Avg/Week</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowPlayers(!showPlayers)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Users className="w-4 h-4" />
            {showPlayers ? 'Hide' : 'View'} Roster ({team.players.length})
          </button>
          <button
            onClick={() => setShowAvailable(!showAvailable)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Players
          </button>
        </div>

        {/* Roster Requirements Display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Roster Requirements</h5>
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div className={`text-center p-2 rounded ${positionCounts.QB === 4 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">QB</div>
              <div>{positionCounts.QB}/4</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts.RB <= 7 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">RB</div>
              <div>{positionCounts.RB}/7</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts.WR <= 10 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">WR</div>
              <div>{positionCounts.WR}/10</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div className={`text-center p-2 rounded ${positionCounts.TE <= 4 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">TE</div>
              <div>{positionCounts.TE}/4</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts.K <= 2 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">K</div>
              <div>{positionCounts.K}/2</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts.DEF <= 2 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">DEF</div>
              <div>{positionCounts.DEF}/2</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`text-center p-2 rounded ${positionCounts['RB/WR'] <= 1 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">RB/WR</div>
              <div>{positionCounts['RB/WR']}/1</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts['WR/TE'] <= 1 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">WR/TE</div>
              <div>{positionCounts['WR/TE']}/1</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts['K/DEF'] <= 1 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">K/DEF</div>
              <div>{positionCounts['K/DEF']}/1</div>
            </div>
          </div>
        </div>
      </div>
            <div className={`text-center p-2 rounded ${positionCounts.TE <= 4 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">TE</div>
              <div>{positionCounts.TE}/4</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts.K <= 2 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">K</div>
              <div>{positionCounts.K}/2</div>
            </div>
            <div className={`text-center p-2 rounded ${positionCounts.DEF <= 2 ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">DEF</div>
              <div>{positionCounts.DEF}/2</div>
            </div>
          </div>
        </div>
      </div>

      {showPlayers && (
        <div className="p-4 bg-gray-50">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Current Roster
          </h4>
          {team.players.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No players on roster</p>
          ) : (
            <div className="grid gap-3">
              {team.players.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onRemove={(playerId) => handleRemovePlayer(team.id, playerId)}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showAvailable && (
        <div className="p-4 bg-gray-50">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Available Players
          </h4>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Draft Rule:</strong> You can only have one player per NFL team.
              <br />
              <strong>Roster Rule:</strong> Must have exactly 4 QBs.
            </p>
            {usedNFLTeams.size > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Teams used: {Array.from(usedNFLTeams).sort().join(', ')}
              </p>
            )}
          </div>
          
          {eligiblePlayers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No players available</p>
          ) : (
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {eligiblePlayers.slice(0, 20).map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onAdd={(playerId) => handleAddPlayer(team.id, playerId)}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};