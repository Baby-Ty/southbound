"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesSendLink = routesSendLink;
const cosmos_1 = require("../shared/cosmos");
const email_1 = require("../shared/email");
const cors_1 = require("../shared/cors");
async function routesSendLink(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    try {
        const body = await request.json();
        const { routeId, email, routeUrl } = body;
        if (!routeId || !email || !routeUrl) {
            return (0, cors_1.createCorsResponse)({ error: 'Missing required fields: routeId, email, routeUrl' }, 400);
        }
        const route = await (0, cosmos_1.getRoute)(routeId);
        if (!route) {
            return (0, cors_1.createCorsResponse)({ error: 'Route not found' }, 404);
        }
        await (0, email_1.sendEmail)({
            to: email,
            subject: 'Your South Bound Route is Ready!',
            html: (0, email_1.generateRouteEmailHtml)(routeId, routeUrl, route.name),
            text: (0, email_1.generateRouteEmailText)(routeId, routeUrl, route.name),
        });
        return (0, cors_1.createCorsResponse)({ success: true });
    }
    catch (error) {
        context.log(`Error sending email: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to send email' }, 500);
    }
}
module.exports = { routesSendLink };
