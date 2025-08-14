# Southbnd - Travel Experience Platform

A modern Next.js application built with TypeScript and Tailwind CSS for discovering amazing travel experiences and local getaways.

## Features

- 🚀 **Next.js 15** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design** with mobile-first approach
- 🧩 **Component-based Architecture**
- ♿ **Accessibility** features included

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── Header.tsx          # Navigation header with mobile menu
│   ├── Footer.tsx          # Site footer with links
│   ├── Layout.tsx          # Main layout wrapper
│   └── index.ts            # Component exports
```

## Navigation Structure

The application includes a comprehensive navigation system with the following sections:

- **Home** - Landing page with hero section and features
- **Popular Trips** - Curated travel destinations
- **Local Getaways** - Nearby experiences and attractions
- **How It Works** - Process and booking information
- **About** - Company information
- **FAQs** - Frequently asked questions
- **Let's Chat** - Contact and support

## Design Features

- **Modern UI/UX** with gradient backgrounds and clean typography
- **Mobile-responsive** navigation with hamburger menu
- **Hover effects** and smooth transitions
- **Accessible** color schemes and semantic HTML
- **Custom scrollbar** styling
- **SEO optimized** with proper metadata

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Sanity CMS:**
   
   a. **Create a Sanity account** at [sanity.io](https://sanity.io)
   
   b. **Create a new project** in your Sanity dashboard
   
   c. **Set up environment variables:**
   Create a `.env.local` file in your project root:
   ```bash
   # Get these values from your Sanity project dashboard
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
   NEXT_PUBLIC_SANITY_DATASET=production
   
   # Optional: Only needed for write operations
   SANITY_API_TOKEN=your-api-token-here
   ```
   
   d. **Update the sanity.config.ts file** with your project ID:
   ```typescript
   projectId: 'your-actual-project-id', // Replace with your project ID
   ```

3. **Start Sanity Studio:**
   ```bash
   npm run sanity:dev
   ```
   This will start Sanity Studio at [http://localhost:3333](http://localhost:3333)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Content Management System (Sanity)

### Schemas

The project includes two main content types:

#### Trip Schema
- **title** - Trip name (required)
- **slug** - URL-friendly identifier (auto-generated from title)
- **heroImage** - Main trip image with alt text (required)
- **destination** - Location name (required)
- **duration** - Trip length (e.g., "2 weeks", "5 days")
- **description** - Brief trip overview (required, 10-500 characters)
- **inclusions** - Array of what's included in the trip
- **exclusions** - Array of what's not included
- **itinerary** - Rich text content with images and formatting
- **price** - Trip cost (required, minimum 0)
- **currency** - Currency code (USD, EUR, GBP, CAD, AUD)
- **category** - Either "popular" or "local" (required)
- **featured** - Boolean to highlight on homepage
- **publishedAt** - Publication date (auto-set)

#### FAQ Schema
- **question** - The question text (required)
- **answer** - Rich text answer with formatting and links
- **category** - Categorization (general, booking, travel, payment, cancellation)
- **order** - Display order (lower numbers appear first)
- **isActive** - Whether to display on website

### Content Management

1. **Access Sanity Studio** at `http://localhost:3333` when running `npm run sanity:dev`
2. **Create content** using the intuitive visual editor
3. **Preview changes** on your Next.js site immediately
4. **Publish content** to make it live on your website

### Example Pages

The project includes example pages demonstrating CMS integration:
- `/trips` - Displays all trips from Sanity
- `/faqs` - Shows all active FAQs organized by category

### Data Fetching

Content is fetched using GROQ queries defined in `src/lib/sanity.ts`:
```typescript
import { client, queries } from '@/lib/sanity'

// Fetch all trips
const trips = await client.fetch(queries.allTrips)

// Fetch trips by category
const popularTrips = await client.fetch(queries.tripsByCategory('popular'))

// Fetch single trip by slug
const trip = await client.fetch(queries.tripBySlug('bali-adventure'))
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sanity:dev` - Start Sanity Studio development server
- `npm run sanity:build` - Build Sanity Studio
- `npm run sanity:deploy` - Deploy Sanity Studio

## Styling

The project uses Tailwind CSS for styling with:
- Custom CSS variables for theming
- Responsive design utilities
- Modern color palette (blue/indigo theme)
- Typography using Geist font family
- Dark mode support (system preference)

## Components

### Header
- Responsive navigation with mobile menu
- Logo and brand identity
- Smooth transitions and hover effects

### Footer
- Organized link sections (Explore, Company, Legal)
- Social media icons
- Copyright and brand information

### Layout
- Flex-based layout with sticky footer
- Full-height design
- Proper semantic structure

## Technologies Used

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Sanity Studio
- **Icons:** Heroicons (SVG)
- **Fonts:** Geist Sans & Geist Mono
- **Linting:** ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built with ❤️ for travel enthusiasts
