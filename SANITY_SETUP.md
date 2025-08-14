# Sanity CMS Setup Guide

This guide will help you set up Sanity Studio for your Southbnd travel website.

## 🚀 Quick Start

### 1. Create a Sanity Account

1. Go to [sanity.io](https://sanity.io) and create an account
2. Create a new project in your Sanity dashboard
3. Note down your Project ID and Dataset name (usually "production")

### 2. Environment Setup

Create a `.env.local` file in your project root:

```bash
# Required: Get these from your Sanity project dashboard
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional: Only needed for write operations
SANITY_API_TOKEN=your-api-token-here
```

### 3. Update Configuration Files

Update these files with your actual project ID:

**sanity.config.ts:**
```typescript
projectId: 'your-actual-project-id', // Replace with your project ID
```

**sanity.cli.ts:**
```typescript
projectId: 'your-actual-project-id', // Replace with your project ID
```

### 4. Start Sanity Studio

```bash
npm run sanity:dev
```

This will start Sanity Studio at `http://localhost:3333`

## 📝 Content Creation

### Trip Content

1. **Navigate to Trips** in Sanity Studio
2. **Click "Create New"** to add a trip
3. **Fill in the required fields:**
   - Title (required)
   - Slug (auto-generated, but editable)
   - Hero Image (required - upload an image)
   - Destination (required)
   - Duration (e.g., "2 weeks", "5 days")
   - Description (required, 10-500 characters)
   - Price (required)
   - Currency (select from dropdown)
   - Category (Popular or Local)

4. **Optional fields:**
   - Inclusions (what's included)
   - Exclusions (what's not included)
   - Itinerary (rich text with formatting)
   - Featured (highlight on homepage)

5. **Publish** when ready

### FAQ Content

1. **Navigate to FAQ** in Sanity Studio
2. **Click "Create New"** to add an FAQ
3. **Fill in:**
   - Question (required)
   - Answer (rich text with formatting)
   - Category (General, Booking, Travel, etc.)
   - Order (lower numbers appear first)
   - Active (toggle to show/hide)

4. **Publish** when ready

## 🔧 Development Commands

```bash
# Start Next.js development server
npm run dev

# Start Sanity Studio
npm run sanity:dev

# Build Sanity Studio
npm run sanity:build

# Deploy Sanity Studio
npm run sanity:deploy

# Build Next.js app
npm run build
```

## 🎨 Customization

### Adding New Fields

To add new fields to existing schemas:

1. **Edit schema files** in `sanity/schemas/`
2. **Add new defineField** objects
3. **Restart Sanity Studio** with `npm run sanity:dev`
4. **Update TypeScript types** in `src/types/sanity.ts`
5. **Update queries** in `src/lib/sanity.ts` if needed

### Creating New Schemas

1. **Create new schema file** in `sanity/schemas/`
2. **Export from** `sanity/schemas/index.ts`
3. **Create TypeScript types** in `src/types/sanity.ts`
4. **Add queries** in `src/lib/sanity.ts`
5. **Create components** to display the content

## 🔍 Data Fetching Examples

### Server Components (Recommended)

```typescript
import { client, queries } from '@/lib/sanity'

export default async function Page() {
  const trips = await client.fetch(queries.allTrips)
  
  return (
    <div>
      {trips.map(trip => (
        <div key={trip._id}>{trip.title}</div>
      ))}
    </div>
  )
}
```

### Client Components

```typescript
'use client'

import { useEffect, useState } from 'react'
import { client, queries } from '@/lib/sanity'

export default function ClientComponent() {
  const [trips, setTrips] = useState([])
  
  useEffect(() => {
    client.fetch(queries.allTrips).then(setTrips)
  }, [])
  
  return <div>{/* Your JSX */}</div>
}
```

## 🖼️ Image Handling

```typescript
import { urlFor } from '@/lib/sanity'

// In your component
<Image
  src={urlFor(trip.heroImage).width(400).height(300).url()}
  alt={trip.heroImage?.alt || trip.title}
  width={400}
  height={300}
/>
```

## 🚀 Deployment

### Deploy Sanity Studio

```bash
npm run sanity:deploy
```

This creates a hosted studio at `https://your-project-id.sanity.studio`

### Deploy Next.js App

Follow your preferred deployment method (Vercel, Netlify, etc.) and make sure to set environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN` (if needed)

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity + Next.js Guide](https://www.sanity.io/docs/nextjs)
- [Portable Text](https://www.sanity.io/docs/portable-text)

## ⚠️ Important Notes

1. **Never commit your API tokens** to version control
2. **Use read-only tokens** for public applications
3. **Test your queries** in Sanity Studio's Vision tool
4. **Enable CORS** for your domain in Sanity project settings
5. **Consider CDN usage** for better image performance

## 🆘 Troubleshooting

### "Dataset not found" error
- Check your project ID in environment variables
- Ensure dataset exists in your Sanity project
- Verify environment variables are loaded correctly

### Images not loading
- Check CORS settings in Sanity project
- Verify image URLs are being generated correctly
- Ensure images are published in Sanity Studio

### Content not updating
- Check if content is published in Sanity Studio
- Clear Next.js cache: `rm -rf .next`
- Verify CDN settings if using production dataset 