import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  const url = new URL(req.url);
  
  // Return empty session for MVP (no auth required)
  if (url.pathname.includes('session')) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  
  // Return empty providers for MVP  
  if (url.pathname.includes('providers')) {
    return NextResponse.json([], { status: 200 });
  }
  
  // Handle CSRF token request
  if (url.pathname.includes('csrf')) {
    return NextResponse.json({ token: 'csrf-token' }, { status: 200 });
  }
  
  // Handle signout
  if (url.pathname.includes('signout')) {
    return NextResponse.json({ url: '/' }, { status: 200 });
  }
  
  return NextResponse.json({ error: 'Auth disabled for MVP' }, { status: 200 });
};

export { handler as GET, handler as POST };