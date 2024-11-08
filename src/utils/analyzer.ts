import { AnalysisResult } from '../types';
import * as cheerio from 'cheerio';

interface HeadingContent {
  type: string;
  text: string;
}

export async function analyzeUrl(url: string): Promise<{
  results: AnalysisResult[];
  headings: HeadingContent[];
}> {
  try {
    // Validate URL
    const validUrl = new URL(url);
    
    // Use a CORS proxy for cross-origin requests
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(validUrl.toString())}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL (Status: ${response.status})`);
    }
    
    const html = await response.text();
    
    // Extract text content
    const $ = cheerio.load(html);
    
    // Extract headings
    const headings: HeadingContent[] = [];
    
    // Get H1s
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        headings.push({ type: 'H1', text });
      }
    });

    // Get H2s
    $('h2').each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        headings.push({ type: 'H2', text });
      }
    });

    // Get H3s
    $('h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        headings.push({ type: 'H3', text });
      }
    });

    // Extract text content
    const title = $('title').text() || '';
    const bodyText = $('body').text().trim();
    
    // Combine all text and clean it
    const allText = `${title} ${bodyText}`
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Count words
    const words = allText.split(' ').filter(word => word.length > 2);
    const totalWords = words.length;
    
    if (totalWords === 0) {
      throw new Error('No content found to analyze');
    }
    
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    // Calculate metrics
    const results: AnalysisResult[] = Array.from(wordCount.entries())
      .map(([keyword, count]) => {
        const density = (count / totalWords) * 100;
        const prominence = calculateProminence(keyword, title, headings);
        
        return {
          keyword,
          location: getKeywordLocation(keyword, title, headings),
          occurrences: count,
          density: Number(density.toFixed(2)),
          prominence: Number(prominence.toFixed(2))
        };
      })
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 100);
    
    if (results.length === 0) {
      throw new Error('No keywords found to analyze');
    }
    
    return { results, headings };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('Failed to analyze URL');
  }
}

function calculateProminence(
  keyword: string,
  title: string,
  headings: HeadingContent[]
): number {
  let score = 0;
  const k = keyword.toLowerCase();
  
  // Weight factors
  if (title.toLowerCase().includes(k)) score += 40;
  
  headings.forEach(heading => {
    if (heading.text.toLowerCase().includes(k)) {
      switch (heading.type) {
        case 'H1': score += 30; break;
        case 'H2': score += 20; break;
        case 'H3': score += 10; break;
      }
    }
  });
  
  return Math.min(score, 100);
}

function getKeywordLocation(
  keyword: string,
  title: string,
  headings: HeadingContent[]
): string {
  const locations: string[] = [];
  const k = keyword.toLowerCase();
  
  if (title.toLowerCase().includes(k)) locations.push('T');
  
  headings.forEach(heading => {
    if (heading.text.toLowerCase().includes(k)) {
      locations.push(heading.type);
    }
  });
  
  if (locations.length === 0) locations.push('D');
  
  return [...new Set(locations)].join('');
}