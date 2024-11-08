import React from 'react';
import { TopicalNode } from '../types';

interface TopicalMapVisualizerProps {
  data: TopicalNode;
}

function TopicalMapVisualizer({ data }: TopicalMapVisualizerProps) {
  const renderNode = (node: TopicalNode, level: number = 0) => {
    const size = Math.max(200 - level * 40, 120);
    const fontSize = Math.max(1.2 - level * 0.2, 0.8);

    return (
      <div key={node.topic} className="flex flex-col items-center mb-8">
        <div
          className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center text-center transition-transform hover:scale-105"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            fontSize: `${fontSize}rem`
          }}
        >
          <div>
            <h3 className="font-semibold text-gray-800">{node.topic}</h3>
            {level === 0 && (
              <p className="text-sm text-gray-600 mt-2">{node.description}</p>
            )}
          </div>
        </div>

        {node.keywords.length > 0 && level < 2 && (
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {node.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {node.subtopics.length > 0 && (
          <div className={`mt-8 grid gap-6 ${level === 0 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {node.subtopics.map(subtopic => renderNode(subtopic, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-8">
        {renderNode(data)}
      </div>
    </div>
  );
}

export default TopicalMapVisualizer;