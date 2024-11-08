import { AnalysisResult } from '../types';

interface HeadingContent {
  type: string;
  text: string;
}

interface ContentSuggestion {
  title: string;
  content: string;
}

export function generateContentSuggestions(
  keywords: AnalysisResult[],
  headings: HeadingContent[]
): ContentSuggestion[] {
  const suggestions: ContentSuggestion[] = [];

  // Group headings by type
  const headingsByType = headings.reduce((acc, heading) => {
    if (!acc[heading.type]) {
      acc[heading.type] = [];
    }
    acc[heading.type].push(heading.text);
    return acc;
  }, {} as Record<string, string[]>);

  // Main topic structure from H1s
  if (headingsByType.H1?.length) {
    suggestions.push({
      title: 'Main Topics Structure',
      content: headingsByType.H1
        .map(text => `- ${text}`)
        .join('\n')
    });
  }

  // Subtopics from H2s
  if (headingsByType.H2?.length) {
    suggestions.push({
      title: 'Subtopics & Sections',
      content: headingsByType.H2
        .map(text => `- ${text}`)
        .join('\n')
    });
  }

  // Detailed points from H3s
  if (headingsByType.H3?.length) {
    suggestions.push({
      title: 'Detailed Points',
      content: headingsByType.H3
        .map(text => `- ${text}`)
        .join('\n')
    });
  }

  // Top keywords by prominence
  const topKeywords = keywords
    .sort((a, b) => b.prominence - a.prominence)
    .slice(0, 10);

  if (topKeywords.length) {
    suggestions.push({
      title: 'Important Keywords',
      content: topKeywords
        .map(k => `- ${k.keyword} (${k.prominence}% prominence)`)
        .join('\n')
    });
  }

  // Content gaps analysis
  const missingStructure = [];
  if (!headingsByType.H1?.length) missingStructure.push('- Missing main topic (H1 heading)');
  if (!headingsByType.H2?.length) missingStructure.push('- Missing subtopics (H2 headings)');
  if (!headingsByType.H3?.length) missingStructure.push('- Missing detailed sections (H3 headings)');

  if (missingStructure.length) {
    suggestions.push({
      title: 'Content Structure Gaps',
      content: missingStructure.join('\n')
    });
  }

  return suggestions;
}