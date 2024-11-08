import React from 'react';
import { FileText } from 'lucide-react';

interface HeadingContent {
  type: string;
  text: string;
}

interface HeadingStructureProps {
  headings: HeadingContent[];
}

export default function HeadingStructure({ headings }: HeadingStructureProps) {
  if (!headings.length) return null;

  const groupedHeadings = headings.reduce((acc, heading) => {
    if (!acc[heading.type]) {
      acc[heading.type] = [];
    }
    acc[heading.type].push(heading.text);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-indigo-500" />
          <h2 className="text-2xl font-bold text-gray-900">Page Structure</h2>
        </div>

        <div className="space-y-6">
          {['H1', 'H2', 'H3'].map(type => {
            const headings = groupedHeadings[type];
            if (!headings?.length) return null;

            return (
              <div key={type} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{type} Headings</h3>
                <div className="space-y-2">
                  {headings.map((text, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg text-gray-700"
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}