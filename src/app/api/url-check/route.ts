import { NextRequest, NextResponse } from 'next/server';

interface UrlCheckResult {
  url: string;
  domain: string;
  isSecure: boolean;
  hasSsl: boolean;
  isShortened: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string[];
}

const SHORTENED_DOMAINS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd',
  'bitly.co', 'buff.ly', 'adf.ly', 'tiny.cc', 'cutt.ly'
];

function analyzeUrl(urlString: string): UrlCheckResult | { error: string } {
  let url: URL;
  
  try {
    url = new URL(urlString);
  } catch {
    return { error: 'Invalid URL format' };
  }
  
  const domain = url.hostname.toLowerCase();
  const isSecure = url.protocol === 'https:';
  const hasSsl = isSecure;
  const isShortened = SHORTENED_DOMAINS.some(d => domain.includes(d));
  
  const details: string[] = [];
  let riskScore = 0;
  
  if (!isSecure) {
    riskScore += 30;
    details.push('Connection is not secure (HTTP instead of HTTPS)');
  }
  
  if (isShortened) {
    riskScore += 25;
    details.push('URL uses a shortened domain - original destination hidden');
  }
  
  if (domain.includes('-') || domain.includes('0') || domain.includes('1')) {
    const suspiciousPatterns = [
      /\d{5,}/,
      /(login|signin|secure|verify|update|confirm|account)/
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(domain)) {
        riskScore += 15;
        details.push('Domain contains suspicious patterns');
        break;
      }
    }
  }
  
  const suspiciousTlds = ['.xyz', '.top', '.click', '.loan', '.gq', '.ml', '.cf', '.tk'];
  for (const tld of suspiciousTlds) {
    if (domain.endsWith(tld)) {
      riskScore += 20;
      details.push(`Suspicious TLD: ${tld}`);
      break;
    }
  }
  
  if (domain.length > 50) {
    riskScore += 10;
    details.push('Unusually long domain');
  }
  
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (riskScore >= 50) riskLevel = 'HIGH';
  else if (riskScore >= 25) riskLevel = 'MEDIUM';
  
  if (details.length === 0) {
    details.push('No obvious risk factors detected');
  }
  
  return {
    url: urlString,
    domain,
    isSecure,
    hasSsl,
    isShortened,
    riskLevel,
    details
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    const result = analyzeUrl(url);
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('URL check error:', error);
    return NextResponse.json(
      { error: 'Failed to check URL' },
      { status: 500 }
    );
  }
}