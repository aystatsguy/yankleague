import React from 'react';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { FantasyTeam } from '../types/fantasy';

interface LeagueStandingsProps {
  teams: FantasyTeam[];
  currentWeek: number;
}

export const LeagueStandings: React.FC<LeagueStandingsProps> = ({ teams, currentWeek }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    const aWinPct = a.wins / (a.wins + a.losses || 1);
    const bWinPct = b.wins / (b.wins + b.losses || 1);
    
    if (aWinPct !== bWinPct) return bWinPct - aWinPct;
    return b.totalPoints - a.totalPoints;
  });

  const getPositionIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{index + 1}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">League Standings</h2>
        <span className="text-sm text-gray-500">Week {currentWeek}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points For</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg/Week</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTeams.map((team, index) => {
              const winPct = team.wins / (team.wins + team.losses || 1);
              const avgPoints = team.totalPoints / (team.weeklyPoints.length || 1);
              
              return (
                <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPositionIcon(index)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-500">{team.owner}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {team.wins}-{team.losses}
                      {team.ties > 0 && `-${team.ties}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(winPct * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {team.totalPoints.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {avgPoints.toFixed(1)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {teams.length < 8 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              League has {teams.length}/8 teams. You can add {8 - teams.length} more teams.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};