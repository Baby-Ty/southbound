# Azure Functions Setup for TripAdvisor Integration

Since this project uses `output: 'export'` (static export), Next.js API routes are not available. All API endpoints must be implemented as Azure Functions.

## Required Azure Functions

You need to create the following Azure Functions to support the TripAdvisor activities feature:

### 1. `/api/cities/{id}/activities` (GET, PUT, PATCH, DELETE)

**Route:** `cities/{id}/activities`

**Methods:**
- **GET** - Retrieve all activities for a city
- **PUT** - Update all activities for a city
- **PATCH** - Update a specific activity (e.g., toggle default status)
- **DELETE** - Remove an activity

**GET Response:**
```json
{
  "activities": [
    {
      "locationId": "string",
      "name": "string",
      "description": "string",
      "category": "string",
      "subcategories": ["string"],
      "rating": 4.5,
      "reviewCount": 1234,
      "images": ["url1", "url2"],
      "webUrl": "string",
      "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "country": "string",
        "postalcode": "string"
      },
      "coordinates": {
        "latitude": 0.0,
        "longitude": 0.0
      },
      "priceLevel": "string",
      "phone": "string",
      "website": "string",
      "hours": {
        "weekRanges": [[{"openTime": "string", "closeTime": "string"}]],
        "timezone": "string"
      },
      "isDefault": false,
      "lastSynced": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**PUT Request Body:**
```json
{
  "activities": [/* array of TripAdvisorActivity */]
}
```

**PATCH Request Body:**
```json
{
  "locationId": "string",
  "isDefault": true
}
```

**DELETE Query Parameters:**
- `locationId` - The location ID of the activity to delete

### 2. `/api/cities/{id}/activities/pull` (POST)

**Route:** `cities/{id}/activities/pull`

**Method:** POST

**Request Body:**
```json
{
  "limit": 30,
  "replace": false
}
```

**Response:**
```json
{
  "activities": [/* array of TripAdvisorActivity */],
  "count": 30
}
```

This function should:
1. Get the city data from Cosmos DB (using `getCity(id)`)
2. Call TripAdvisor API to fetch attractions (using `tripAdvisorClient.searchCityAttractions`)
3. Merge with existing activities (or replace if `replace: true`)
4. Update Cosmos DB (using `updateCityActivities`)
5. Return the updated activities list

### 3. `/api/tripadvisor/search` (POST)

**Route:** `tripadvisor/search`

**Method:** POST

**Request Body:**
```json
{
  "query": "string",
  "locationId": "string",
  "limit": 20
}
```

**Response:**
```json
{
  "results": [/* array of TripAdvisorActivity */]
}
```

This function should use `tripAdvisorClient.searchAttractions` to search for activities.

### 4. `/api/tripadvisor/sync` (POST) - Optional

**Route:** `tripadvisor/sync`

**Method:** POST

**Request Body (optional):**
```json
{
  "cityId": "string" // If provided, sync only this city
}
```

This function can be called by a scheduled Azure Function to periodically refresh activities for all cities (or a specific city).

## Implementation Notes

1. **Copy the TripAdvisor client code** (`src/lib/tripadvisor.ts`) to your Azure Functions project
2. **Copy the Cosmos DB functions** (`src/lib/cosmos-cities.ts`) to your Azure Functions project
3. **Set environment variables** in Azure Functions:
   - `TRIPADVISOR_API_KEY` - Your TripAdvisor API key
   - `COSMOS_ENDPOINT` - Your Cosmos DB endpoint
   - `COSMOS_KEY` - Your Cosmos DB key
   - `COSMOS_DATABASE_ID` - Your database ID
   - `COSMOS_CONTAINER_ID` - Your container ID

## Local Development

For local development, you have two options:

### Option 1: Temporarily disable static export

Edit `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  // output: 'export', // Comment this out for local dev
  // ... rest of config
};
```

Then create the API routes in `src/app/api/` (they were removed but you can recreate them).

### Option 2: Use Azure Functions Core Tools

1. Install Azure Functions Core Tools
2. Run your Azure Functions locally
3. Set `NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:7071` in `.env.local`

## Code References

The client-side code expects these endpoints:
- `ActivityManager.tsx` - Calls `/api/cities/{id}/activities` and `/api/cities/{id}/activities/pull`
- `ActivityPickerModal.tsx` - Calls `/api/tripadvisor/search`
- `EnhancedCityCard.tsx` - Calls `/api/cities/{id}/activities` to get default activities

All API calls use the `apiUrl()` function from `src/lib/api.ts`, which routes to Azure Functions when `NEXT_PUBLIC_FUNCTIONS_URL` is set.

