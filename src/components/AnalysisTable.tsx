import React, { useState } from 'react';
import { HelpCircle, Search, ArrowUpDown } from 'lucide-react';
import { AnalysisResult } from '../types';

interface Props {
  results: AnalysisResult[];
}

export function AnalysisTable({ results }: Props) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof AnalysisResult>('prominence');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [locationFilter, setLocationFilter] = useState<string[]>([]);

  const locations = ['T', 'H1', 'H2', 'H3', 'D'];

  const filteredResults = results.filter(result => {
    const matchesSearch = result.keyword.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter.length === 0 || 
      locationFilter.some(loc => result.location.includes(loc));
    return matchesSearch && matchesLocation;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return ((aValue < bValue ? -1 : 1) * multiplier);
  });

  const toggleSort = (field: keyof AnalysisResult) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleLocationFilter = (location: string) => {
    setLocationFilter(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const getLocationLabel = (loc: string) => {
    switch (loc) {
      case 'T': return 'Title';
      case 'H1': return 'H1';
      case 'H2': return 'H2';
      case 'H3': return 'H3';
      case 'D': return 'Body';
      default: return loc;
    }
  };

  const getLocationLabels = (location: string): string[] => {
    return location.match(/[A-Z]\d|[TD]/g) || [];
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-500" />
            <span className="text-lg font-medium text-gray-900">Filters</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keywords..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by location:</span>
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => toggleLocationFilter(loc)}
                className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-medium transition-colors
                  ${locationFilter.includes(loc)
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {getLocationLabel(loc)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-4">
                <button
                  onClick={() => toggleSort('keyword')}
                  className="flex items-center text-left text-sm font-semibold text-gray-900 hover:text-indigo-600"
                >
                  Keyword
                  <ArrowUpDown className={`ml-2 w-4 h-4 ${sortField === 'keyword' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </button>
              </th>
              <th scope="col" className="px-6 py-4">
                <button
                  onClick={() => toggleSort('location')}
                  className="flex items-center text-left text-sm font-semibold text-gray-900 hover:text-indigo-600"
                >
                  Found in
                  <ArrowUpDown className={`ml-2 w-4 h-4 ${sortField === 'location' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </button>
              </th>
              <th scope="col" className="px-6 py-4">
                <button
                  onClick={() => toggleSort('occurrences')}
                  className="flex items-center text-left text-sm font-semibold text-gray-900 hover:text-indigo-600"
                >
                  Repeats
                  <ArrowUpDown className={`ml-2 w-4 h-4 ${sortField === 'occurrences' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </button>
              </th>
              <th scope="col" className="px-6 py-4">
                <button
                  onClick={() => toggleSort('density')}
                  className="flex items-center text-left text-sm font-semibold text-gray-900 hover:text-indigo-600"
                >
                  Density
                  <ArrowUpDown className={`ml-2 w-4 h-4 ${sortField === 'density' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </button>
              </th>
              <th scope="col" className="px-6 py-4">
                <button
                  onClick={() => toggleSort('prominence')}
                  className="flex items-center text-left text-sm font-semibold text-gray-900 hover:text-indigo-600"
                >
                  Prominence
                  <ArrowUpDown className={`ml-2 w-4 h-4 ${sortField === 'prominence' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.keyword}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    {getLocationLabels(result.location).map((loc, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-medium transition-colors duration-150 hover:bg-gray-200"
                      >
                        {getLocationLabel(loc)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.occurrences}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(result.density * 2, 100)}%` }}
                      />
                    </div>
                    <span>{result.density}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${result.prominence}%` }}
                      />
                    </div>
                    <span>{result.prominence}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}