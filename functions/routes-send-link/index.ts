import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getRoute } from '../shared/cosmos';
import { sendEmail, generateRouteEmailHtml, generateRouteEmailText } from '../shared/email';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function routesSendLink(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  try {
    const body = req.body as {
      routeId?: string;
      email?: string;
      routeUrl?: string;
    };
    const { routeId, email, routeUrl } = body;

    if (!routeId || !email || !routeUrl) {
      (context as any).res = createCorsResponse(
        { error: 'Missing required fields: routeId, email, routeUrl' },
        400
      ); return;
    }

    const route = await getRoute(routeId);
    if (!route) {
      (context as any).res = createCorsResponse(
        { error: 'Route not found' },
        404
      ); return;
    }

    await sendEmail({
      to: email,
      subject: 'Your South Bound Route is Ready!',
      html: generateRouteEmailHtml(routeId, routeUrl, route.name),
      text: generateRouteEmailText(routeId, routeUrl, route.name),
    });

    (context as any).res = createCorsResponse({ success: true }); return;
  } catch (error: any) {
      context.log(`Error sending email: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { error: error.message || 'Failed to send email' },
      500
    ); return;
  }
}

module.exports = { routesSendLink };
