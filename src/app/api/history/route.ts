import { NextRequest, NextResponse } from 'next/server';

interface ScanHistoryItem {
  id: string;
  inputText: string;
  result: string;
  confidence: number;
  inputType: string;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    
    return NextResponse.json({
      scans: [],
      filter
    });
    
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}