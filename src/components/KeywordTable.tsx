import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { KeywordData } from '../types';

interface KeywordTableProps {
  keywords: KeywordData[];
}

function KeywordTable({ keywords }: KeywordTableProps) {
  const [sortField, setSortField] = useState<keyof KeywordData>('density');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedKeywords = [...keywords].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortDirection === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (field: keyof KeywordData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field }: { field: keyof KeywordData }) => (
    <button
      onClick={() => handleSort(field)}
      className="inline-flex items-center gap-1 hover:text-indigo-600"
    >
      <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
      <ArrowUpDown className={`w-4 h-4 ${sortField === field ? 'text-indigo-600' : 'text-gray-400'}`} />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-600 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3"><SortButton field="keyword" /></th>
            <th className="px-4 py-3"><SortButton field="foundIn" /></th>
            <th className="px-4 py-3"><SortButton field="repeats" /></th>
            <th className="px-4 py-3"><SortButton field="density" /></th>
            <th className="px-4 py-3"><SortButton field="prominence" /></th>
          </tr>
        </thead>
        <tbody>
          {sortedKeywords.map((keyword, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{keyword.keyword}</td>
              <td className="px-4 py-3">{keyword.foundIn}</td>
              <td className="px-4 py-3">{keyword.repeats}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${Math.min(keyword.density * 5, 100)}%` }}
                    />
                  </div>
                  {keyword.density.toFixed(2)}%
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${keyword.prominence}%` }}
                    />
                  </div>
                  {keyword.prominence.toFixed(2)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KeywordTable;