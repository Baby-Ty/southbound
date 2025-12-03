# Unsplash API Setup Guide

## Quick Setup

1. **Get your Unsplash API Key:**
   - Go to https://unsplash.com/developers
   - Sign in or create an account
   - Click "New Application"
   - Fill out the application form (you can use any name/description)
   - Accept the API use terms
   - Copy your "Access Key" (starts with something like `abc123...`)

2. **Add to your `.env.local` file:**
   ```bash
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-access-key-here
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Free Tier Limits

Unsplash API free tier includes:
- 50 requests per hour
- Unlimited requests per day (with rate limiting)
- Perfect for development and small projects

## Troubleshooting

- **Still seeing "API key not configured"**: Make sure the variable name is exactly `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` (case-sensitive)
- **Rate limit errors**: You've exceeded 50 requests/hour. Wait a bit and try again.
- **Invalid API key**: Double-check you copied the full key correctly

## Alternative: Use Default Images

If you don't want to use Unsplash API, the app will automatically use default city images when the API key is not configured. These are predefined images for common cities.




