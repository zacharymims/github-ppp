import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

function AnalysisForm({ onAnalyze, loading }: AnalysisFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Enter Website URL
        </label>
        <div className="flex gap-4">
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com"
            required
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Analyze URL
          </button>
        </div>
      </div>
    </form>
  );
}

export default AnalysisForm;