import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, password } = await request.json();

    if (action === 'login') {
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        return NextResponse.json(
          { success: false, error: 'Admin password not configured' },
          { status: 500 }
        );
      }

      if (password === adminPassword) {
        // Set cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set({
          name: 'admin_session',
          value: process.env.ADMIN_SECRET_TOKEN!,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        return response;
      }

      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    } else if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('admin_session');
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
