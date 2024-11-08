import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { analyzeTopicalMap } from '../utils/topicalMap';
import TopicalMapVisualizer from './TopicalMapVisualizer';
import { TopicalNode } from '../types';

function TopicalMapAnalyzer() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapData, setMapData] = useState<TopicalNode | null>(null);

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await analyzeTopicalMap(topic.trim());
      setMapData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., SEO, Marketing, Technology)"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !topic.trim()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Generate Map
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>

      {mapData && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Topical Authority Map</h2>
            <TopicalMapVisualizer data={mapData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicalMapAnalyzer;