import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  const url = new URL(req.url);
  const path = url.pathname.split('/api/auth/').pop() || '';
  
  // Session endpoint - return empty session (user not logged in for MVP)
  if (path.includes('session')) {
    return NextResponse.json(
      { user: null, expires: null },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Providers endpoint
  if (path.includes('providers')) {
    return NextResponse.json(
      [],
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // CSRF token
  if (path.includes('csrf')) {
    return NextResponse.json(
      { csrfToken: 'mvp-csrf-token' },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Signout
  if (path.includes('signout')) {
    return NextResponse.json(
      { url: '/' },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Callback
  if (path.includes('callback')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Default - return empty session
  return NextResponse.json(
      { user: null },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export { handler as GET, handler as POST };