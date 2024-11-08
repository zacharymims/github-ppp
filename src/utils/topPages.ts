import { TopPageResult, SEOMetrics } from '../types';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function analyzeTopPages(domain: string): Promise<TopPageResult[]> {
  try {
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    if (!cleanDomain) {
      throw new Error('Please enter a valid domain');
    }

    const baseUrl = `https://${cleanDomain}`;
    const corsProxy = 'https://api.allorigins.win/get?url=';
    
    const homepageUrl = `${corsProxy}${encodeURIComponent(baseUrl)}`;
    const homepageResponse = await axios.get(homepageUrl);
    
    if (!homepageResponse.data.contents) {
      throw new Error('Could not access the website');
    }

    const $ = cheerio.load(homepageResponse.data.contents);
    const pages = new Set<string>();
    pages.add(baseUrl);

    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          const url = new URL(href, baseUrl);
          if (url.hostname === cleanDomain || url.hostname === `www.${cleanDomain}`) {
            pages.add(url.href);
          }
        } catch {
          if (href.startsWith('/')) {
            pages.add(`${baseUrl}${href}`);
          }
        }
      }
    });

    const uniquePages = Array.from(pages).slice(0, 10);
    const results = await Promise.all(
      uniquePages.map(async (url) => {
        try {
          const pageUrl = `${corsProxy}${encodeURIComponent(url)}`;
          const response = await axios.get(pageUrl);
          
          if (!response.data.contents) {
            return null;
          }

          const pageMetrics = analyzePageContent(response.data.contents, url);
          return pageMetrics;
        } catch (error) {
          console.error(`Error analyzing ${url}:`, error);
          return null;
        }
      })
    );

    const validResults = results.filter((result): result is TopPageResult => result !== null);

    if (validResults.length === 0) {
      throw new Error('No pages could be analyzed');
    }

    return validResults;
  } catch (error) {
    console.error('Top pages analysis error:', error);
    throw error instanceof Error ? error : new Error('Analysis failed');
  }
}

function analyzePageContent(html: string, url: string): TopPageResult {
  const $ = cheerio.load(html);
  
  const title = $('title').first().text() || url;
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';
  
  const headings: Array<{ type: string; text: string }> = [];
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
    $(tag).each((_, el) => {
      headings.push({
        type: tag.toUpperCase(),
        text: $(el).text().trim()
      });
    });
  });

  const images = $('img');
  const imagesWithAlt = images.filter((_, el) => $(el).attr('alt')?.trim()).length;
  
  const seoMetrics: SEOMetrics = {
    hasTitle: title.length > 0,
    title,
    titleLength: title.length,
    hasMetaDescription: metaDescription.length > 0,
    description: metaDescription,
    descriptionLength: metaDescription.length,
    hasCanonical: canonicalUrl.length > 0,
    canonicalUrl,
    hasSchema: $('script[type="application/ld+json"]').length > 0,
    schemaTypes: getSchemaTypes($),
    isMobileFriendly: true, // Would need actual mobile testing
    mobileIssues: [],
    isSecure: url.startsWith('https'),
    protocol: url.startsWith('https') ? 'HTTPS' : 'HTTP',
    securityIssues: null,
    hasProperHeadingStructure: headings.length > 0,
    headings,
    imagesWithAlt,
    imagesWithAltRatio: images.length ? imagesWithAlt / images.length : 1,
    missingAltImages: images.length - imagesWithAlt,
    contentLength: $('body').text().trim().split(/\s+/).length,
    contentQuality: 'Average', // Would need more sophisticated analysis
    internalLinks: $('a[href^="/"], a[href^="' + url + '"]').length,
    externalLinks: $('a[href^="http"]').not('a[href^="' + url + '"]').length,
    loadTime: 1.5, // Would need actual performance testing
    pageSizeKB: 500, // Would need actual size calculation
    pageSize: '500KB'
  };

  return {
    url,
    title,
    seoMetrics
  };
}

function getSchemaTypes($: cheerio.CheerioAPI): string[] {
  const schemas: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const schema = JSON.parse($(el).html() || '{}');
      if (schema['@type']) {
        schemas.push(schema['@type']);
      }
    } catch {
      // Invalid JSON schema
    }
  });
  return schemas;
}