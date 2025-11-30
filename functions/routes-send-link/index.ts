import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getRoute } from '../shared/cosmos';
import { sendEmail, generateRouteEmailHtml, generateRouteEmailText } from '../shared/email';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function routesSendLink(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    const body = await request.json();
    const { routeId, email, routeUrl } = body;

    if (!routeId || !email || !routeUrl) {
      return createCorsResponse(
        { error: 'Missing required fields: routeId, email, routeUrl' },
        400
      );
    }

    const route = await getRoute(routeId);
    if (!route) {
      return createCorsResponse(
        { error: 'Route not found' },
        404
      );
    }

    await sendEmail({
      to: email,
      subject: 'Your South Bound Route is Ready!',
      html: generateRouteEmailHtml(routeId, routeUrl, route.name),
      text: generateRouteEmailText(routeId, routeUrl, route.name),
    });

    return createCorsResponse({ success: true });
  } catch (error: any) {
    context.log.error('Error sending email:', error);
    return createCorsResponse(
      { error: error.message || 'Failed to send email' },
      500
    );
  }
}

app.http('routes-send-link', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'routes/send-link',
  handler: routesSendLink,
});

