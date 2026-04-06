import { NextRequest, NextResponse } from 'next/server';

interface Report {
  id: string;
  content: string;
  category: string;
  description: string;
  status: 'pending' | 'reviewed';
  createdAt: string;
}

const STORAGE_KEY = 'safecheck_reports';

function getReports(): Report[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReport(report: Report): void {
  const reports = getReports();
  reports.unshift(report);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(0, 100)));
  } catch (e) {
    console.error('Failed to save report:', e);
  }
}

function generateId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, category, description } = body;
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }
    
    const validCategories = ['loan_scam', 'otp_fraud', 'phishing', 'other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    const report: Report = {
      id: generateId(),
      content: content.trim(),
      category,
      description: description?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      report
    });
    
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    reports: []
  });
}