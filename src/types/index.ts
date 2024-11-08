export interface AnalysisResult {
  keyword: string;
  location: string;
  occurrences: number;
  density: number;
  prominence: number;
}

export interface SEOMetrics {
  hasTitle: boolean;
  title: string;
  titleLength: number;
  hasMetaDescription: boolean;
  description: string;
  descriptionLength: number;
  hasCanonical: boolean;
  canonicalUrl: string;
  hasSchema: boolean;
  schemaTypes: string[];
  isMobileFriendly: boolean;
  mobileIssues: string[];
  isSecure: boolean;
  protocol: string;
  securityIssues: string | null;
  hasProperHeadingStructure: boolean;
  headings: Array<{ type: string; text: string }>;
  imagesWithAlt: number;
  imagesWithAltRatio: number;
  missingAltImages: number;
  contentLength: number;
  contentQuality: string;
  internalLinks: number;
  externalLinks: number;
  loadTime: number;
  pageSizeKB: number;
  pageSize: string;
}

export interface TopPageResult {
  url: string;
  title: string;
  seoMetrics: SEOMetrics;
}