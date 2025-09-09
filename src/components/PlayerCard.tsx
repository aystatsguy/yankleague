import React from 'react';
import { Player } from '../types/fantasy';

interface PlayerCardProps {
  player: Player;
  onAdd?: (playerId: string) => void;
  onRemove?: (playerId: string) => void;
  showActions?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  onAdd, 
  onRemove, 
  showActions = true 
}) => {
  const getPositionColor = (position: string) => {
    const colors = {
      QB: 'bg-red-100 text-red-800',
      RB: 'bg-green-100 text-green-800',
      WR: 'bg-blue-100 text-blue-800',
      TE: 'bg-purple-100 text-purple-800',
      K: 'bg-yellow-100 text-yellow-800',
      DEF: 'bg-gray-100 text-gray-800',
    };
    return colors[position as keyof typeof colors] || colors.QB;
  };

  const formatStats = (stats: any) => {
    const statLines = [];
    if (stats.passingYards) statLines.push(`${stats.passingYards} pass yds`);
    if (stats.passingTDs) statLines.push(`${stats.passingTDs} pass TD`);
    if (stats.rushingYards) statLines.push(`${stats.rushingYards} rush yds`);
    if (stats.rushingTDs) statLines.push(`${stats.rushingTDs} rush TD`);
    if (stats.receivingYards) statLines.push(`${stats.receivingYards} rec yds`);
    if (stats.receivingTDs) statLines.push(`${stats.receivingTDs} rec TD`);
    if (stats.receptions) statLines.push(`${stats.receptions} rec`);
    
    return statLines.slice(0, 3).join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{player.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(player.position)}`}>
              {player.position}
            </span>
          </div>
          <p className="text-sm text-gray-600">{player.team}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">{player.points.toFixed(1)}</p>
          <p className="text-xs text-gray-500">pts</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Projected: {player.projectedPoints.toFixed(1)}</span>
        </div>
        <div className="text-xs text-gray-500">
          {formatStats(player.stats)}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {player.isAvailable && onAdd && (
            <button
              onClick={() => onAdd(player.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Player
            </button>
          )}
          {!player.isAvailable && onRemove && (
            <button
              onClick={() => onRemove(player.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Drop Player
            </button>
          )}
        </div>
      )}
    </div>
  );
};