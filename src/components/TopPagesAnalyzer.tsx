import React, { useState } from 'react';
import { Search, Globe, FileText, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { analyzeTopPages } from '../utils/topPages';
import { TopPageResult } from '../types';

function TopPagesAnalyzer() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<TopPageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResults([]);
      const analysisResults = await analyzeTopPages(domain);
      setResults(analysisResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to analyze domain');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSEOStatus = (condition: boolean, info?: string) => (
    <div className="flex items-center gap-2">
      {condition ? 
        <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
        <AlertCircle className="w-5 h-5 text-red-500" />
      }
      {info && (
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
            {info}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g., example.com)"
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-4 py-3"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200 whitespace-nowrap"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                <>
                  <Search className="h-5 h-5 mr-2" />
                  Analyze Pages
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Page Analysis Results</h2>
            <div className="space-y-8">
              {results.map((page, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {page.title}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{page.url}</span>
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Meta Information</h4>
                          <ul className="space-y-4">
                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Title Tag</span>
                                {renderSEOStatus(
                                  page.seoMetrics.hasTitle && 
                                  page.seoMetrics.titleLength >= 30 && 
                                  page.seoMetrics.titleLength <= 60,
                                  "Title should be between 30-60 characters"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">{page.seoMetrics.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Length: {page.seoMetrics.titleLength} characters
                                </p>
                              </div>
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Meta Description</span>
                                {renderSEOStatus(
                                  page.seoMetrics.hasMetaDescription && 
                                  page.seoMetrics.descriptionLength >= 120 && 
                                  page.seoMetrics.descriptionLength <= 155,
                                  "Description should be between 120-155 characters"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">{page.seoMetrics.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Length: {page.seoMetrics.descriptionLength} characters
                                </p>
                              </div>
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Canonical URL</span>
                                {renderSEOStatus(
                                  page.seoMetrics.hasCanonical,
                                  "Prevents duplicate content issues"
                                )}
                              </div>
                              {page.seoMetrics.canonicalUrl && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-600 break-all">
                                    {page.seoMetrics.canonicalUrl}
                                  </p>
                                </div>
                              )}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Technical SEO</h4>
                          <ul className="space-y-4">
                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Schema Markup</span>
                                {renderSEOStatus(
                                  page.seoMetrics.hasSchema,
                                  "Helps search engines understand your content"
                                )}
                              </div>
                              {page.seoMetrics.schemaTypes && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-600">
                                    Types: {page.seoMetrics.schemaTypes.join(', ')}
                                  </p>
                                </div>
                              )}
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Mobile Friendly</span>
                                {renderSEOStatus(
                                  page.seoMetrics.isMobileFriendly,
                                  "Page is optimized for mobile devices"
                                )}
                              </div>
                              {page.seoMetrics.mobileIssues && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {page.seoMetrics.mobileIssues.map((issue, i) => (
                                      <li key={i}>{issue}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Page Security</span>
                                {renderSEOStatus(
                                  page.seoMetrics.isSecure,
                                  "Page is served over secure HTTPS"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  Protocol: {page.seoMetrics.protocol}
                                  {page.seoMetrics.securityIssues && (
                                    <span className="text-red-500 ml-2">
                                      ({page.seoMetrics.securityIssues})
                                    </span>
                                  )}
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Content Analysis</h4>
                          <ul className="space-y-4">
                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Heading Structure</span>
                                {renderSEOStatus(
                                  page.seoMetrics.hasProperHeadingStructure,
                                  "Page should have a logical heading hierarchy"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                {page.seoMetrics.headings.map((heading, i) => (
                                  <div key={i} className="text-sm">
                                    <span className="font-medium text-gray-700">{heading.type}:</span>
                                    <span className="text-gray-600 ml-2">{heading.text}</span>
                                  </div>
                                ))}
                              </div>
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Images</span>
                                {renderSEOStatus(
                                  page.seoMetrics.imagesWithAltRatio >= 0.8,
                                  "At least 80% of images should have alt text"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  {page.seoMetrics.imagesWithAlt} images with alt text
                                  <span className="text-gray-500 ml-2">
                                    ({Math.round(page.seoMetrics.imagesWithAltRatio * 100)}%)
                                  </span>
                                </p>
                                {page.seoMetrics.missingAltImages > 0 && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {page.seoMetrics.missingAltImages} images missing alt text
                                  </p>
                                )}
                              </div>
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Content Length</span>
                                {renderSEOStatus(
                                  page.seoMetrics.contentLength >= 300,
                                  "Minimum recommended length is 300 words"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  {page.seoMetrics.contentLength.toLocaleString()} words
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {page.seoMetrics.contentQuality}
                                </p>
                              </div>
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Internal Links</span>
                                {renderSEOStatus(
                                  page.seoMetrics.internalLinks > 0,
                                  "Page should have internal links for good site structure"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  {page.seoMetrics.internalLinks} internal links
                                </p>
                                <p className="text-sm text-gray-600">
                                  {page.seoMetrics.externalLinks} external links
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Performance</h4>
                          <ul className="space-y-4">
                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Load Time</span>
                                {renderSEOStatus(
                                  page.seoMetrics.loadTime < 3,
                                  "Page should load in under 3 seconds"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  {page.seoMetrics.loadTime}s
                                </p>
                              </div>
                            </li>

                            <li>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Page Size</span>
                                {renderSEOStatus(
                                  page.seoMetrics.pageSizeKB < 5000,
                                  "Page should be under 5MB for optimal performance"
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  {page.seoMetrics.pageSize}
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopPagesAnalyzer;