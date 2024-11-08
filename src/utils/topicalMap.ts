import { TopicalNode } from '../types';

function generateSubtopics(topic: string): TopicalNode[] {
  return [
    {
      topic: 'Core Knowledge',
      description: `Essential information about ${topic}`,
      keywords: [
        `what is ${topic}`,
        `${topic} definition`,
        `${topic} meaning`,
        `${topic} explained`,
        `${topic} basics`
      ],
      subtopics: []
    },
    {
      topic: 'Guides & Tutorials',
      description: `Learn how to work with ${topic}`,
      keywords: [
        `how to use ${topic}`,
        `${topic} tutorial`,
        `${topic} guide`,
        `${topic} tips`,
        `${topic} best practices`
      ],
      subtopics: []
    },
    {
      topic: 'Examples & Applications',
      description: `Real-world applications and examples of ${topic}`,
      keywords: [
        `${topic} examples`,
        `${topic} use cases`,
        `${topic} applications`,
        `${topic} implementations`,
        `${topic} in practice`
      ],
      subtopics: []
    }
  ];
}

export async function analyzeTopicalMap(topic: string): Promise<TopicalNode> {
  try {
    // Generate a static map structure based on common patterns
    const mainNode: TopicalNode = {
      topic,
      description: `Comprehensive guide about ${topic}`,
      keywords: [
        topic,
        `about ${topic}`,
        `${topic} overview`,
        `${topic} introduction`,
        `${topic} guide`
      ],
      subtopics: generateSubtopics(topic)
    };

    // Add common questions section
    mainNode.subtopics.push({
      topic: 'Common Questions',
      description: `Frequently asked questions about ${topic}`,
      keywords: [
        `what is ${topic}`,
        `why use ${topic}`,
        `how does ${topic} work`,
        `when to use ${topic}`,
        `${topic} benefits`
      ],
      subtopics: []
    });

    // Add comparisons section
    mainNode.subtopics.push({
      topic: 'Comparisons',
      description: `Compare ${topic} with alternatives and related concepts`,
      keywords: [
        `${topic} vs`,
        `${topic} alternatives`,
        `${topic} comparison`,
        `different types of ${topic}`,
        `${topic} options`
      ],
      subtopics: []
    });

    return mainNode;
  } catch (error) {
    console.error('Topical map analysis error:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze topic');
  }
}