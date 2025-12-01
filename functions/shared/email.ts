export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Log for now - integrate with email service in production
  console.log('Email would be sent:', {
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
  
  // TODO: Integrate with Resend, SendGrid, or Azure Communication Services
}

export function generateRouteEmailHtml(routeId: string, routeUrl: string, name?: string): string {
  const greeting = name ? `Hi ${name}!` : 'Hi there!';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your South Bound Route</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #E86B32 0%, #2CB5C0 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Your Route is Saved!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            ${greeting} 👋
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Your South Bound route has been saved successfully. You can view and edit it anytime using the link below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${routeUrl}" style="display: inline-block; background: #E86B32; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              View Your Route
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Or copy and paste this link into your browser:<br>
            <a href="${routeUrl}" style="color: #E86B32; word-break: break-all;">${routeUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666;">
            Ready to make this route a reality? Click the button above to review your itinerary, and when you're ready, submit it for review. Our team will help arrange everything!
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Safe travels! 🌍<br>
            <strong>The South Bound Team</strong>
          </p>
        </div>
      </body>
    </html>
  `;
}

export function generateRouteEmailText(routeId: string, routeUrl: string, name?: string): string {
  const greeting = name ? `Hi ${name}!` : 'Hi there!';
  return `
Your Route is Saved!

${greeting}

Your South Bound route has been saved successfully. You can view and edit it anytime using the link below:

${routeUrl}

Ready to make this route a reality? Visit the link above to review your itinerary, and when you're ready, submit it for review. Our team will help arrange everything!

Safe travels!
The South Bound Team
  `.trim();
}


