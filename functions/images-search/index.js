"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagesSearch = imagesSearch;
const cors_1 = require("../shared/cors");
async function imagesSearch(context, req) {
    const origin = req.headers['origin'];
    const corsHeaders = (0, cors_1.getCorsHeaders)(origin);
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: corsHeaders,
        };
        return;
    }
    const query = req.query.query;
    if (!query) {
        context.res = (0, cors_1.createCorsResponse)({ error: 'Query required' }, 400, origin);
        return;
    }
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
        context.log("UNSPLASH_ACCESS_KEY is missing");
        context.res = (0, cors_1.createCorsResponse)([], 200, origin);
        return;
    }
    try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`, {
            headers: {
                Authorization: `Client-ID ${accessKey}`
            }
        });
        if (!res.ok) {
            const errorText = await res.text();
            context.log(`Unsplash API error: ${errorText}`);
            throw new Error("Unsplash API error");
        }
        const data = await res.json();
        const images = (data.results || []).map((img) => ({
            id: img.id,
            url: img.urls.regular,
            thumb: img.urls.small,
            alt: img.alt_description,
            photographer: img.user.name,
            photographerUrl: img.user.links.html
        }));
        context.res = (0, cors_1.createCorsResponse)(images, 200, origin);
        return;
    }
    catch (error) {
        context.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({ error: 'Failed to fetch images' }, 500, origin);
        return;
    }
}
module.exports = { imagesSearch };
