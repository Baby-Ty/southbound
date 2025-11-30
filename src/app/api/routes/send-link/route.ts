import { NextRequest, NextResponse } from 'next/server';
import { getRoute } from '@/lib/cosmos';
import { sendEmail, generateRouteEmailHtml, generateRouteEmailText } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { routeId, email, routeUrl } = body;

    if (!routeId || !email || !routeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: routeId, email, routeUrl' },
        { status: 400 }
      );
    }

    // Verify route exists
    const route = await getRoute(routeId);
    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }

    // Send email
    await sendEmail({
      to: email,
      subject: 'Your South Bound Route is Ready!',
      html: generateRouteEmailHtml(routeId, routeUrl, route.name),
      text: generateRouteEmailText(routeId, routeUrl, route.name),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

