import React from 'react';
import { Lightbulb, ChevronDown } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ContentSuggestionsProps {
  keywords: AnalysisResult[];
  suggestions: Array<{ title: string; content: string }>;
  loading: boolean;
}

export default function ContentSuggestions({ keywords, suggestions, loading }: ContentSuggestionsProps) {
  if (!keywords.length) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900">Content Suggestions</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <details
                key={index}
                className="group bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors duration-200"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <h3 className="text-lg font-medium text-gray-900">{suggestion.title}</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-4 pb-4">
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {suggestion.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">
                        {line.startsWith('-') ? (
                          <span className="block pl-4">{line}</span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">
            No content suggestions available. Try analyzing more keywords.
          </p>
        )}
      </div>
    </div>
  );
}