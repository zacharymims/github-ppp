import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { analyzeUrl } from '../utils/analyzer';
import { AnalysisTable } from './AnalysisTable';
import HeadingStructure from './HeadingStructure';
import ContentSuggestions from './ContentSuggestions';
import { useTrialStore } from '../store/trialStore';
import { useAuthStore } from '../store/authStore';
import { generateContentSuggestions } from '../utils/aiSuggestions';

interface HeadingContent {
  type: string;
  text: string;
}

function KeywordAnalyzer() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [headings, setHeadings] = useState<HeadingContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ title: string; content: string }>>([]);

  const { user } = useAuthStore();
  const { incrementTrial, hasTrialsLeft } = useTrialStore();

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!user && !hasTrialsLeft()) {
      setError('No free trials left. Please sign in to continue.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResults([]);
      setHeadings([]);
      setSuggestions([]);

      // Increment trial count for non-authenticated users
      if (!user) {
        const canProceed = incrementTrial();
        if (!canProceed) {
          setError('No free trials left. Please sign in to continue.');
          return;
        }
      }

      const { results: analysisResults, headings: pageHeadings } = await analyzeUrl(url);
      setResults(analysisResults);
      setHeadings(pageHeadings);

      // Generate content suggestions based on the analysis
      const contentSuggestions = generateContentSuggestions(analysisResults, pageHeadings);
      setSuggestions(contentSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze (e.g., https://example.com/page)"
              className="flex-1 min-w-0 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-4 py-3"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200 whitespace-nowrap"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Analyzing...
                </div>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze Keywords
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

      {results.length > 0 && (
        <>
          <ContentSuggestions 
            keywords={results}
            suggestions={suggestions}
            loading={false}
          />

          <HeadingStructure headings={headings} />

          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Keyword Analysis Results</h2>
              <AnalysisTable results={results} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default KeywordAnalyzer;