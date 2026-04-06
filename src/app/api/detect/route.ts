import { NextRequest, NextResponse } from 'next/server';

const SUSPICIOUS_KEYWORDS = [
  'urgent', 'immediate action', 'legal action', 'pay now', 'last chance',
  'verify your account', 'suspended', 'blocked', 'otp', 'one time password',
  'win lottery', 'congratulations', 'prize money', 'claim now', 'free gift',
  'limited time', 'act now', 'don\'t miss', 'exclusive offer', 'loan approved',
  'credit score', 'instant cash', 'no collateral', 'low interest', 'barely legal',
  'c bic', 'bhai', 'dost', 'paisa', 'rupees', 'lakhs', 'crore',
  'kredit', 'loan', 'lend', 'money', 'cash', 'rupeey',
  'bank details', 'update kyc', 'kyc expired', 'aadhaar', 'pan card',
  'link clicked', 'login now', 'password expired', 'security alert',
  'unusual activity', 'suspicious login', 'account compromised',
  'bit.ly', 'tinyurl', 'goo.gl', 't.co', 'ow.ly', 'is.gd'
];

const SCAM_PATTERNS = [
  /₹[\d,]+(\s*lakh|\s*crore)?/i,
  /win(?:ner)?[\s]*₹/i,
  /loan[\s]*approved/i,
  /urgent[\s]*action/i,
  /verify[\s]*(account|kyc)/i,
  /otp[\s]*(sent|shared|verify)/i,
  /suspended[\s]*(account|number)/i,
  /legal[\s]*(notice|action)/i,
  /\b10min\b.*\b(rupees|lakhs|crore)\b/i,
  /instant[\s]*(cash|loan|money)/i,
  /no[\s]*(collateral|documents?|credit)/i
];

interface DetectionResult {
  status: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  confidence: number;
  reasons: string[];
  riskyWords: string[];
  inputType: 'SMS' | 'URL';
}

function detectInputType(input: string): 'SMS' | 'URL' {
  const urlPattern = /^https?:\/\/[^\s]+$/i;
  const shortUrlPattern = /^(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|is\.gd)[^\s]*$/i;
  
  if (urlPattern.test(input) || shortUrlPattern.test(input)) {
    return 'URL';
  }
  
  try {
    const url = new URL(input);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return 'URL';
    }
  } catch {
    return 'SMS';
  }
  
  return 'SMS';
}

function findRiskyWords(input: string): string[] {
  const words = input.toLowerCase().split(/\s+/);
  const found: string[] = [];
  
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (input.toLowerCase().includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  }
  
  return [...new Set(found)];
}

function checkScamPatterns(input: string): string[] {
  const matches: string[] = [];
  
  for (const pattern of SCAM_PATTERNS) {
    if (pattern.test(input)) {
      matches.push(pattern.source);
    }
  }
  
  return matches;
}

function ruleBasedDetection(input: string): Partial<DetectionResult> {
  const riskyWords = findRiskyWords(input);
  const patternMatches = checkScamPatterns(input);
  
  let score = 0;
  const reasons: string[] = [];
  
  if (riskyWords.length > 0) {
    score += riskyWords.length * 10;
    reasons.push(`Contains ${riskyWords.length} suspicious keyword(s)`);
  }
  
  if (patternMatches.length > 0) {
    score += patternMatches.length * 25;
    reasons.push('Matches known scam patterns');
  }
  
  if (detectInputType(input) === 'URL') {
    const url = input.toLowerCase();
    if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('goo.gl')) {
      score += 20;
      reasons.push('Shortened URL detected');
    }
    if (!url.startsWith('https://')) {
      score += 15;
      reasons.push('URL is not secure (no HTTPS)');
    }
  }
  
  let status: 'SAFE' | 'SUSPICIOUS' | 'SCAM' = 'SAFE';
  if (score >= 60) status = 'SCAM';
  else if (score >= 30) status = 'SUSPICIOUS';
  
  const confidence = Math.min(score + 20, 100);
  
  return {
    status,
    confidence,
    reasons: reasons.length > 0 ? reasons : ['No suspicious elements detected'],
    riskyWords: riskyWords.slice(0, 10)
  };
}

async function callOpenRouter(input: string): Promise<{status: string, confidence: number, reasoning: string} | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.log('OpenRouter API key not configured, using rule-based only');
    return null;
  }
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        'X-Title': 'SafeCheck AI'
      },
      body: JSON.stringify({
        model: 'google/gemma-3n-e4',
        messages: [
          {
            role: 'system',
            content: `You are a scam detection AI. Analyze the following message and classify it as SAFE, SUSPICIOUS, or SCAM. 
            
Respond ONLY with a JSON object in this exact format:
{"status": "SAFE|SUSPICIOUS|SCAM", "confidence": 0-100, "reasoning": "brief explanation"}

Do not include any other text in your response.`
          },
          {
            role: 'user',
            content: input
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log('OpenRouter error:', error);
      return null;
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      const parsed = JSON.parse(content);
      return {
        status: parsed.status,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning
      };
    }
    
    return null;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;
    
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }
    
    if (input.length > 10000) {
      return NextResponse.json(
        { error: 'Input too long. Maximum 10,000 characters allowed.' },
        { status: 400 }
      );
    }
    
    const inputType = detectInputType(input);
    const ruleResult = ruleBasedDetection(input);
    
    let finalStatus = ruleResult.status || 'SAFE';
    let finalConfidence = ruleResult.confidence || 0;
    let finalReasons = ruleResult.reasons || [];
    const finalRiskyWords = ruleResult.riskyWords || [];
    
    if (inputType === 'SMS') {
      const aiResult = await callOpenRouter(input);
      
      if (aiResult) {
        const aiStatus = aiResult.status as 'SAFE' | 'SUSPICIOUS' | 'SCAM';
        
        const aiWeight = 0.6;
        const ruleWeight = 0.4;
        
        const statusScores: Record<string, number> = { 'SCAM': 100, 'SUSPICIOUS': 50, 'SAFE': 0 };
        
        const ruleScore = statusScores[finalStatus] || 0;
        const aiScore = statusScores[aiStatus] || 0;
        
        const combinedScore = (aiScore * aiWeight) + (ruleScore * ruleWeight);
        
        if (combinedScore >= 75) finalStatus = 'SCAM';
        else if (combinedScore >= 40) finalStatus = 'SUSPICIOUS';
        else finalStatus = 'SAFE';
        
        finalConfidence = Math.round(aiResult.confidence * aiWeight + finalConfidence * ruleWeight);
        
        if (aiResult.reasoning) {
          finalReasons = [aiResult.reasoning, ...finalReasons].slice(0, 5);
        }
      }
    }
    
    if (inputType === 'URL') {
      finalReasons.push(`Input detected as ${inputType} - use URL Checker for detailed analysis`);
    }
    
    const result: DetectionResult = {
      status: finalStatus,
      confidence: Math.max(finalConfidence, 20),
      reasons: finalReasons,
      riskyWords: finalRiskyWords,
      inputType
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Detection error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze input' },
      { status: 500 }
    );
  }
}