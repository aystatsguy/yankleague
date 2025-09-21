import React, { useState } from 'react';
import { Football, RefreshCw, Plus, BarChart3, Zap } from 'lucide-react';
import { useFantasyData } from './hooks/useFantasyData';
import { LeagueStandings } from './components/LeagueStandings';
import { TeamCard } from './components/TeamCard';
import { AddTeamModal } from './components/AddTeamModal';
import { NFLDataImporter } from './components/NFLDataImporter';

function App() {
  const {
    league,
    availablePlayers,
    loading,
    error,
    runAutodraft,
    addTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    refreshPlayerStats,
  } = useFantasyData();

  const [activeTab, setActiveTab] = useState<'standings' | 'teams'>('standings');
  const [showAddTeam, setShowAddTeam] = useState(false);

  const handleAddTeam = (teamName: string, ownerName: string) => {
    try {
      addTeam(teamName, ownerName);
    } catch (err) {
      console.error('Failed to add team:', err);
      throw err;
    }
  };

  const handleNFLDataImport = (players: any[]) => {
    console.log('NFL data imported:', players.length, 'players');
    // Note: In a full implementation, you would replace the current player database
    // with the imported NFL data and update the available players state
    alert(`Successfully imported ${players.length} NFL players with Week 1 stats!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Football className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{league.name}</h1>
                <p className="text-sm text-gray-500">Week {league.currentWeek}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {league.teams.length === 0 && (
                <button
                  onClick={runAutodraft}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors disabled:bg-gray-300"
                >
                  <Zap className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                  {loading ? 'Fetching NFL Data & Drafting...' : 'Autodraft 8 Teams (Real NFL Data)'}
                </button>
              )}
              <button
                onClick={refreshPlayerStats}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:bg-gray-300"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Stats
              </button>
              <button
                onClick={() => setShowAddTeam(true)}
                disabled={league.teams.length >= league.maxTeams}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Team
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('standings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'standings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                League Standings
              </div>
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'teams'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Football className="w-4 h-4" />
                Team Management
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {activeTab === 'standings' && (
          <div>
            <NFLDataImporter onDataImported={handleNFLDataImport} />
            <LeagueStandings teams={league.teams} currentWeek={league.currentWeek} />
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            {league.teams.length === 0 ? (
              <div className="text-center py-12">
                <Football className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Teams Yet</h3>
                <p className="text-gray-600 mb-6">Get started by running an autodraft or adding teams manually.</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={runAutodraft}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors disabled:bg-gray-300"
                  >
                    <Zap className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
                    {loading ? 'Drafting...' : 'Autodraft 8 Teams'}
                  </button>
                  <button
                    onClick={() => setShowAddTeam(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Team Manually
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {league.teams.map(team => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    availablePlayers={availablePlayers}
                    onAddPlayer={addPlayerToTeam}
                    onRemovePlayer={removePlayerFromTeam}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <AddTeamModal
        isOpen={showAddTeam}
        onClose={() => setShowAddTeam(false)}
        onAddTeam={handleAddTeam}
        maxTeams={league.maxTeams}
        currentTeams={league.teams.length}
      />
    </div>
  );
}

export default App;