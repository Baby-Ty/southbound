# Video Compression Instructions

## Current Status
The hero video `south-bound.mp4` is **3.56MB** and needs to be compressed to improve page load performance.

## Manual Compression Required

Since FFmpeg is not installed on your system, please compress the video manually using one of these methods:

### Option 1: Install FFmpeg (Recommended)
1. Download FFmpeg from: https://www.gyan.dev/ffmpeg/builds/
2. Extract and add to PATH
3. Run this command in PowerShell:
```powershell
ffmpeg -i "public\south-bound.mp4" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k "public\south-bound-compressed.mp4"
```

### Option 2: Use Online Tool
1. Go to https://www.freeconvert.com/video-compressor
2. Upload `public/south-bound.mp4`
3. Set quality to 70-80% (target ~1.5MB)
4. Download as `south-bound-compressed.mp4`
5. Place in `public/` folder

### Option 3: Use HandBrake (Free Desktop App)
1. Download from: https://handbrake.fr/
2. Open `public/south-bound.mp4`
3. Use "Fast 1080p30" or "Fast 720p30" preset
4. Adjust quality slider to RF 28
5. Save as `south-bound-compressed.mp4` in `public/` folder

### Option 4: Create WebM Version (Best Compression)
If you have FFmpeg, also create a WebM version:
```powershell
ffmpeg -i "public\south-bound.mp4" -c:v libvpx-vp9 -crf 32 -b:v 0 "public\south-bound.webm"
```

## After Compression

Once you have the compressed video(s):
1. Replace the original or rename it to `south-bound-original.mp4`
2. The code has been updated to use `south-bound-compressed.mp4`
3. Test the page to ensure video plays correctly
4. Target file size: **1-1.5MB** (60% reduction)

## Code Changes Already Applied

The Hero component has been updated to:
- Use `preload="metadata"` instead of `preload="auto"`
- Support multiple video formats (WebM + MP4)
- Include lazy loading optimization
- Add video ref to prevent duplicate loading

You just need to provide the compressed video file(s).
