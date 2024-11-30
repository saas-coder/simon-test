import type { AnalysisResult } from '../types';

interface ScrapedData {
  links: string[];
  metadata?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  error?: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const encodedUrl = encodeURIComponent(url);
  
  try {
    // Validate URL format
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol. Please use http:// or https://');
    }

    const response = await fetch(
      `https://${import.meta.env.VITE_RAPIDAPI_HOST}/links?url=${encodedUrl}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST,
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch website data');
    }

    const data = await response.json();
    
    if (!data.links || !Array.isArray(data.links)) {
      // Fallback to analyzing just the main URL if API doesn't return links
      return {
        links: [url],
        metadata: {
          title: data.metadata?.title || urlObj.hostname,
          description: data.metadata?.description || '',
          ogImage: data.metadata?.ogImage
        }
      };
    }

    // Enhanced content detection patterns
    const contentPatterns = [
      // Product patterns
      '/product',
      '/products',
      '/item',
      '/p/',
      '/shop',
      '/collection',
      'buy',
      'store',
      // Category patterns
      '/category',
      '/categories',
      '/catalog',
      // Content patterns
      '/about',
      '/features',
      '/benefits',
      '/services',
      '/solutions',
      // Additional patterns
      '/brand',
      '/our-',
      '/what-we',
      '/why-'
    ];

    // Filter for content links with improved pattern matching
    const contentLinks = data.links.filter((link: string) => {
      const normalizedLink = link.toLowerCase();
      // First try exact hostname match
      const isFromSameDomain = link.includes(urlObj.hostname);
      // Then try domain without subdomain
      const mainDomain = urlObj.hostname.split('.').slice(-2).join('.');
      const isFromMainDomain = link.includes(mainDomain);
      
      return (
        // Must be from same domain/subdomain or start with /
        (isFromSameDomain || isFromMainDomain || link.startsWith('/')) &&
        // Must match content patterns or be a short path (likely important)
        (contentPatterns.some(pattern => normalizedLink.includes(pattern)) ||
         link.split('/').length <= 4) &&
        // Exclude common non-content paths
        !normalizedLink.includes('login') &&
        !normalizedLink.includes('cart') &&
        !normalizedLink.includes('account') &&
        !normalizedLink.includes('checkout') &&
        !normalizedLink.includes('wishlist') &&
        !normalizedLink.includes('signin') &&
        !normalizedLink.includes('signup') &&
        !normalizedLink.includes('.js') &&
        !normalizedLink.includes('.css') &&
        !normalizedLink.includes('.png') &&
        !normalizedLink.includes('.jpg') &&
        !normalizedLink.includes('.gif')
      );
    }).map((link: string) => 
      link.startsWith('/') ? `${urlObj.origin}${link}` : link
    );

    // If no content links found, try the main URL
    if (contentLinks.length === 0) {
      return {
        links: [url],
        metadata: {
          title: data.metadata?.title || urlObj.hostname,
          description: data.metadata?.description || '',
          ogImage: data.metadata?.ogImage
        }
      };
    }

    return {
      links: Array.from(new Set(contentLinks)), // Remove duplicates
      metadata: data.metadata
    };

  } catch (error) {
    // If scraping fails, fallback to analyzing just the main URL
    const urlObj = new URL(url);
    return {
      links: [url],
      metadata: {
        title: urlObj.hostname,
        description: ''
      }
    };
  }
}

export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  try {
    const { links, metadata } = await scrapeWebsite(url);
    
    // Extract product information from links with improved detection
    const products = links.slice(0, 10).map((link, index) => {
      const urlObj = new URL(link);
      const urlParts = urlObj.pathname.split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1] || urlObj.hostname;
      
      // Clean up the product name
      const name = lastPart
        .replace(/-|_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\..*$/, '') // Remove file extensions
        .trim();

      // Determine category from URL structure
      const categoryPart = urlParts.find(part => 
        ['category', 'collection', 'department', 'shop'].some(cat => 
          part.toLowerCase().includes(cat)
        )
      );
      
      const category = categoryPart
        ? categoryPart.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : 'General';

      return {
        id: `product-${index + 1}`,
        name: name || `Product ${index + 1}`,
        category,
        url: link,
        image: metadata?.ogImage || `https://source.unsplash.com/800x600/?${encodeURIComponent(category.toLowerCase())}`
      };
    });

    // Extract categories with improved detection
    const categories = Array.from(new Set([
      ...products.map(p => p.category),
      ...links
        .map(link => {
          const match = link.match(/\/(category|collection|department|shop)\/([^/]+)/);
          return match ? match[2].replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : null;
        })
        .filter(Boolean)
    ]));

    // Enhanced keyword extraction
    const keywords = new Set<string>();
    if (metadata?.description) {
      metadata.description
        .toLowerCase()
        .split(/[\s,.-]+/)
        .filter(word => word.length > 3)
        .forEach(word => keywords.add(word));
    }

    // Extract keywords from URLs and metadata
    links.forEach(link => {
      const urlObj = new URL(link);
      urlObj.pathname
        .split(/[/-]/)
        .filter(word => word.length > 3)
        .forEach(word => keywords.add(word.toLowerCase()));
    });

    // Clean up brand name extraction
    const cleanedUrl = new URL(url);
    let brandName = metadata?.title?.split(/[|-]/)[0].trim() || 
                   cleanedUrl.hostname.split('.')[0].replace(/\b\w/g, l => l.toUpperCase());

    // Remove common suffixes from brand name
    brandName = brandName
      .replace(/\s*[-|]\s*.+$/, '') // Remove everything after dash or pipe
      .replace(/\s*(®|™|©)/, '') // Remove registered trademark symbols
      .trim();

    return {
      products,
      categories: categories.length > 0 ? categories : ['General'],
      mainKeywords: Array.from(keywords)
        .filter(keyword => 
          !['http', 'https', 'www', 'com', 'net', 'org', 'html', 'php'].includes(keyword) &&
          !/^\d+$/.test(keyword)
        )
        .slice(0, 10),
      brandName,
      websiteUrl: url
    };

  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Unable to analyze website. Please try a different URL or contact support.');
  }
}