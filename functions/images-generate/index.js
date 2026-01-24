"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagesGenerate = imagesGenerate;
const openai_1 = __importDefault(require("openai"));
const cors_1 = require("../shared/cors");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || 'dummy',
});
async function imagesGenerate(context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: cors_1.corsHeaders,
        };
        return;
    }
    if (!process.env.OPENAI_API_KEY) {
        context.res = (0, cors_1.createCorsResponse)({ error: 'OpenAI API key missing' }, 500);
        return;
    }
    try {
        const body = req.body;
        const { prompt } = body;
        if (!prompt) {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Prompt required' }, 400);
            return;
        }
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `A high quality, photorealistic travel photograph of ${prompt}. Professional lighting, beautiful scenery, 4k.`,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            style: "natural"
        });
        context.res = (0, cors_1.createCorsResponse)({ url: response.data[0].url });
        return;
    }
    catch (error) {
        context.log(`OpenAI Error: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({ error: 'Failed to generate image' }, 500);
        return;
    }
}
module.exports = { imagesGenerate };
