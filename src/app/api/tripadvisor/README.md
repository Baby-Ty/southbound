# TripAdvisor API Integration

## Setup

1. **Environment Variables**
   - Add `TRIPADVISOR_API_KEY` to your environment variables
   - Get your API key from [TripAdvisor Content API](https://developer.tripadvisor.com/content-api/)

## Endpoints

### `/api/tripadvisor/search`
- **POST**: Search for attractions in a city
  ```json
  {
    "cityName": "Bali",
    "countryName": "Indonesia",
    "limit": 20
  }
  ```
- **GET**: Search locations by query string
  ```
  GET /api/tripadvisor/search?query=Bali&limit=10
  ```

### `/api/tripadvisor/sync`
- **POST**: Sync activities for all cities in Europe (or specific city)
  ```json
  {
    "cityId": "optional-city-id",  // If provided, sync only this city
    "limit": 30,                    // Number of activities to fetch per city
    "skipExisting": false           // Skip cities that already have activities
  }
  ```
  
  This endpoint will:
  1. Fetch activities from TripAdvisor for each city
  2. Select the top 2 activities (by rating/review count) and mark them as default
  3. Fetch full details for each activity to get descriptions
  4. Generate AI descriptions for activities without TripAdvisor descriptions
  5. Update cities in Cosmos DB with enriched activities
  
  **Rate Limiting**: The endpoint includes delays between API calls to respect TripAdvisor's free tier limits (~1000 requests/day). It processes up to 50 cities per run by default.
  
  **Response**:
  ```json
  {
    "success": true,
    "message": "Sync completed for X cities",
    "synced": [
      {
        "cityId": "city-id",
        "cityName": "City Name",
        "activitiesCount": 30,
        "defaultsSet": 2
      }
    ],
    "skipped": [...],
    "errors": [...],
    "totalProcessed": 50,
    "remainingCities": 0
  }
  ```

- **GET**: Get sync status for all cities in Europe
  Returns status of all European cities including activity counts and default status.

### `/api/cities/[id]/activities`
- **GET**: Get all activities for a city
- **POST**: Pull activities from TripAdvisor
  ```json
  {
    "limit": 20,
    "replace": false
  }
  ```
- **PUT**: Update activities array
- **PATCH**: Update specific activity (e.g., toggle default)
  ```
  PATCH /api/cities/[id]/activities?locationId=12345
  {
    "isDefault": true
  }
  ```
- **DELETE**: Remove an activity
  ```
  DELETE /api/cities/[id]/activities?locationId=12345
  ```

## Scheduled Sync Setup

To set up periodic syncing of activities, you can:

1. **Azure Functions Timer Trigger** (Recommended)
   - Create an Azure Function with a timer trigger
   - Call `POST /api/tripadvisor/sync` weekly
   - Example cron expression: `0 0 0 * * 0` (every Sunday at midnight)

2. **External Cron Job**
   - Use a service like cron-job.org or GitHub Actions
   - Call `POST https://your-domain.com/api/tripadvisor/sync` weekly

3. **Manual Sync**
   - Admins can manually trigger sync from the admin hub
   - Or call the sync endpoint directly

## Rate Limits

TripAdvisor API has rate limits. The sync endpoint includes delays between city syncs to respect these limits. For production, consider:
- Caching responses in Cosmos DB
- Syncing during off-peak hours
- Limiting sync frequency to weekly or monthly

