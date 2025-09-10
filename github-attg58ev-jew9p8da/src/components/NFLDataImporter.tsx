import React from 'react';
import { Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useNFLData } from '../hooks/useNFLData';
import { Player } from '../types/fantasy';

interface NFLDataImporterProps {
  onDataImported: (players: Player[]) => void;
}

export const NFLDataImporter: React.FC<NFLDataImporterProps> = ({ onDataImported }) => {
  const { nflData, loading, error, fetchWeek1Data, convertToFantasyPlayers } = useNFLData();

  const handleImport = async () => {
    try {
      const data = await fetchWeek1Data();
      const fantasyPlayers = convertToFantasyPlayers(data);
      onDataImported(fantasyPlayers);
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Download className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Import NFL Week 1 Data</h3>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          Import real NFL player rosters and generate realistic Week 1 statistics for your fantasy league.
        </p>
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md mb-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {nflData.length > 0 && !loading && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md mb-3">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-600">
              Successfully loaded {nflData.length} players with realistic Week 1 stats
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md mb-3">
            <Loader className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
            <p className="text-sm text-blue-600">
              Fetching NFL rosters and generating Week 1 statistics...
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Fetches real NFL player rosters from ESPN API</li>
              <li>Generates realistic Week 1 statistics based on player positions</li>
              <li>Calculates fantasy points using your league's scoring system</li>
              <li>Includes all scoring categories: completions, rushing attempts, sacks, etc.</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleImport}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Importing NFL Data...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Import Week 1 Data
          </>
        )}
      </button>
    </div>
  );
};