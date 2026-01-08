# LinkedIn API Integration Guide

This directory will contain API routes for LinkedIn functionality once backend integration is implemented.

## Required API Routes

### POST `/api/linkedin/polish`
Polishes existing post text using GPT in Southbound style.

**Request Body:**
```json
{
  "text": "Raw post text",
  "style": "southbound"
}
```

**Response:**
```json
{
  "polishedText": "Polished post text..."
}
```

### POST `/api/linkedin/generate`
Generates a new LinkedIn post from a topic/idea.

**Request Body:**
```json
{
  "topic": "Travel tips for Southeast Asia",
  "style": "southbound"
}
```

**Response:**
```json
{
  "generatedText": "Generated post content..."
}
```

### POST `/api/linkedin/drafts`
Saves a new draft post.

**Request:** FormData
- `content`: string (post content)
- `media`: File[] (optional media files)

**Response:**
```json
{
  "id": "draft-id",
  "title": "Draft title",
  "content": "Post content",
  "status": "draft",
  "createdAt": "2025-01-15T10:00:00Z",
  "mediaCount": 2
}
```

### GET `/api/linkedin/drafts`
Fetches all draft posts.

**Response:**
```json
{
  "drafts": [
    {
      "id": "draft-id",
      "title": "Draft title",
      "content": "Post content",
      "status": "draft",
      "scheduledDate": null,
      "createdAt": "2025-01-15T10:00:00Z",
      "mediaCount": 2
    }
  ]
}
```

### PUT `/api/linkedin/drafts/:id`
Updates an existing draft.

**Request Body:**
```json
{
  "content": "Updated content",
  "media": ["media-url-1", "media-url-2"]
}
```

### DELETE `/api/linkedin/drafts/:id`
Deletes a draft post.

### POST `/api/linkedin/schedule`
Schedules a post for publication via LinkedIn API.

**Request Body:**
```json
{
  "content": "Post content",
  "scheduledAt": "2025-01-20T10:00:00Z",
  "timezone": "America/New_York",
  "mediaUrls": ["url1", "url2"]
}
```

**LinkedIn API Integration Required:**
- OAuth 2.0 authentication
- LinkedIn Marketing API access token
- Post scheduling endpoint
- Media upload to LinkedIn

### GET `/api/linkedin/scheduled`
Fetches all scheduled posts.

### POST `/api/linkedin/generate-media`
Generates media using AI (DALL-E, Midjourney, etc.).

**Request Body:**
```json
{
  "prompt": "Image description",
  "style": "southbound"
}
```

**Response:**
```json
{
  "mediaUrl": "https://generated-image-url.com/image.jpg"
}
```

### POST `/api/linkedin/upload-media`
Uploads media files to storage (Azure Blob Storage).

**Request:** FormData
- `file`: File

**Response:**
```json
{
  "url": "https://storage-url.com/file.jpg"
}
```

## LinkedIn API Setup

1. **Create LinkedIn App**
   - Go to https://www.linkedin.com/developers/apps
   - Create a new app
   - Request Marketing API access

2. **OAuth 2.0 Flow**
   - Implement authorization code flow
   - Store access tokens securely
   - Handle token refresh

3. **API Permissions Required**
   - `w_member_social` - Post on behalf of user
   - `w_organization_social` - Post on behalf of organization (if needed)

4. **Post Scheduling**
   - Use LinkedIn API to schedule posts
   - Handle timezone conversions
   - Store scheduled posts in database

## Database Schema (Suggested)

```sql
CREATE TABLE linkedin_drafts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'draft', 'scheduled', 'published'
  scheduled_at TIMESTAMP,
  timezone VARCHAR(50),
  media_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE linkedin_strategy (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  content_buckets JSONB,
  weekly_cadence INTEGER,
  kpis JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```





