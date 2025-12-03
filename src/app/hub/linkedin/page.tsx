'use client';

/**
 * LinkedIn Content Hub Page
 * 
 * This page provides a complete workspace for creating, polishing, scheduling, and managing LinkedIn posts.
 * 
 * TODO: Backend Integration Points
 * - Connect GPT polish/generate functions to API endpoints (see src/hooks/useLinkedInWorkflow.ts)
 * - Implement LinkedIn OAuth 2.0 authentication flow
 * - Connect scheduling to LinkedIn Marketing API
 * - Implement media upload to Azure Blob Storage
 * - Connect drafts to database (Cosmos DB or similar)
 * - Implement strategy planning persistence
 * 
 * See src/app/api/linkedin/README.md for API endpoint specifications
 */

import { useState } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Save, 
  Send,
  FileText,
  Target,
  TrendingUp,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';

// Mock data for drafts
const mockDrafts = [
  {
    id: '1',
    title: 'Travel Tips for Southeast Asia',
    content: 'Just returned from an incredible journey through...',
    status: 'draft',
    scheduledDate: null,
    createdAt: '2025-01-15',
    mediaCount: 2
  },
  {
    id: '2',
    title: 'Why Remote Work is Changing Travel',
    content: 'The future of work is remote, and it\'s transforming...',
    status: 'scheduled',
    scheduledDate: '2025-01-20T10:00:00',
    createdAt: '2025-01-14',
    mediaCount: 1
  },
  {
    id: '3',
    title: 'Hidden Gems in Bali',
    content: 'Beyond the tourist spots, Bali has so much to offer...',
    status: 'draft',
    scheduledDate: null,
    createdAt: '2025-01-13',
    mediaCount: 0
  }
];

// Mock strategy data
const mockStrategy = {
  contentBuckets: [
    { id: '1', name: 'Travel Tips', count: 5, color: 'bg-blue-100 text-blue-700' },
    { id: '2', name: 'Destination Spotlights', count: 3, color: 'bg-green-100 text-green-700' },
    { id: '3', name: 'Remote Work Stories', count: 4, color: 'bg-purple-100 text-purple-700' },
    { id: '4', name: 'Customer Success', count: 2, color: 'bg-orange-100 text-orange-700' }
  ],
  weeklyCadence: 3,
  kpis: {
    engagement: '12.5%',
    reach: '8.2K',
    clicks: '234'
  }
};

export default function LinkedInPage() {
  const [ideaText, setIdeaText] = useState('');
  const [polishedText, setPolishedText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<File[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  // Placeholder handlers - will connect to backend later
  // See src/hooks/useLinkedInWorkflow.ts for hook-based implementation approach
  // See src/app/api/linkedin/README.md for API endpoint specifications
  
  const handlePolish = async () => {
    setIsPolishing(true);
    // TODO: Replace with hook call: const polished = await polishPost(ideaText);
    // API: POST /api/linkedin/polish
    // Backend: Connect to OpenAI GPT API with Southbound style prompt
    setTimeout(() => {
      setPolishedText(ideaText + ' [Polished by GPT in Southbound style]');
      setIsPolishing(false);
    }, 1500);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Replace with hook call: const generated = await generatePost(ideaText);
    // API: POST /api/linkedin/generate
    // Backend: Connect to OpenAI GPT API to generate post from topic
    setTimeout(() => {
      setPolishedText('Here\'s a LinkedIn post generated in Southbound style based on your idea...');
      setIsGenerating(false);
    }, 2000);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedMedia([...uploadedMedia, ...files]);
      // TODO: Upload files to Azure Blob Storage via API
      // API: POST /api/linkedin/upload-media
    }
  };

  const handleGenerateMedia = async () => {
    // TODO: Replace with hook call: const mediaUrl = await generateMedia(ideaText);
    // API: POST /api/linkedin/generate-media
    // Backend: Connect to DALL-E, Midjourney, or similar AI image generation service
    alert('Media generation will be connected to backend API');
  };

  const handleSaveDraft = async () => {
    // TODO: Replace with hook call: await saveDraft({ content: polishedText, media: uploadedMedia });
    // API: POST /api/linkedin/drafts
    // Backend: Save to database (Cosmos DB) with user association
    alert('Draft saved! (Backend integration pending)');
  };

  const handleSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      alert('Please select a date and time');
      return;
    }
    // TODO: Replace with hook call: await schedulePost({ content: polishedText, scheduledAt: `${scheduledDate}T${scheduledTime}`, timezone });
    // API: POST /api/linkedin/schedule
    // Backend: 
    //   1. Save to database as scheduled post
    //   2. Connect to LinkedIn Marketing API
    //   3. Use LinkedIn API to schedule post publication
    //   4. Handle OAuth 2.0 authentication flow
    alert('Post scheduled! (Backend integration pending)');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">LinkedIn Content Hub</Heading>
        <p className="text-lg text-stone-600">Create, polish, and schedule your LinkedIn posts in Southbound style.</p>
      </div>

      {/* Composer Section */}
      <Card className="p-6 bg-white">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#E86B32]" />
            <h2 className="text-xl font-bold text-stone-800">Create New Post</h2>
          </div>

          {/* Idea Input */}
          <div>
            <label htmlFor="idea-input" className="block text-sm font-medium text-stone-700 mb-2">
              Start with an idea or draft
            </label>
            <textarea
              id="idea-input"
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="Type your post idea here... What do you want to share with your LinkedIn audience?"
              className="w-full h-32 px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32] resize-none text-stone-800"
            />
          </div>

          {/* GPT Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handlePolish}
              disabled={!ideaText || isPolishing || isGenerating}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isPolishing ? 'Polishing...' : 'GPT Polish'}
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!ideaText || isPolishing || isGenerating}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate Post'}
            </Button>
          </div>

          {/* Polished Output */}
          {polishedText && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Polished Post
              </label>
              <textarea
                value={polishedText}
                onChange={(e) => setPolishedText(e.target.value)}
                className="w-full h-40 px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32] resize-none text-stone-800 bg-stone-50"
              />
            </div>
          )}

          {/* Media Section */}
          <div className="border-t border-stone-200 pt-6">
            <h3 className="text-sm font-medium text-stone-700 mb-3">Media</h3>
            <div className="flex flex-wrap gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors">
                  <Upload className="w-4 h-4 text-stone-600" />
                  <span className="text-sm font-medium text-stone-700">Upload Media</span>
                </div>
              </label>
              <button
                onClick={handleGenerateMedia}
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-stone-600" />
                <span className="text-sm font-medium text-stone-700">Generate Media</span>
              </button>
            </div>
            {uploadedMedia.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedMedia.map((file, idx) => (
                  <div key={idx} className="px-3 py-1 bg-stone-100 rounded-lg text-sm text-stone-700 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    {file.name}
                    <button
                      onClick={() => setUploadedMedia(uploadedMedia.filter((_, i) => i !== idx))}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduling Section */}
          <div className="border-t border-stone-200 pt-6">
            <h3 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Post
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="schedule-date" className="block text-xs text-stone-600 mb-1">
                  Date
                </label>
                <input
                  id="schedule-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32] text-stone-800"
                />
              </div>
              <div>
                <label htmlFor="schedule-time" className="block text-xs text-stone-600 mb-1">
                  Time
                </label>
                <input
                  id="schedule-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32] text-stone-800"
                />
              </div>
              <div>
                <label htmlFor="timezone" className="block text-xs text-stone-600 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32] text-stone-800"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-200">
            <Button
              onClick={handleSaveDraft}
              disabled={!polishedText}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!polishedText || !scheduledDate || !scheduledTime}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Schedule Post
            </Button>
          </div>
        </div>
      </Card>

      {/* Drafts and Strategy Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Drafts Section */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#E86B32]" />
              <h2 className="text-xl font-bold text-stone-800">Saved Drafts</h2>
            </div>
            <span className="text-sm text-stone-500">{mockDrafts.length} drafts</span>
          </div>
          <div className="space-y-3">
            {mockDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-stone-800">{draft.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      draft.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {draft.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-stone-600 mb-2 line-clamp-2">{draft.content}</p>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-4">
                    {draft.scheduledDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(draft.scheduledDate).toLocaleDateString()}
                      </div>
                    )}
                    {draft.mediaCount > 0 && (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {draft.mediaCount}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-stone-400 hover:text-[#E86B32]">
                      <Edit className="w-3 h-3" />
                    </button>
                    <button className="text-stone-400 hover:text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strategy Section */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#E86B32]" />
            <h2 className="text-xl font-bold text-stone-800">Content Strategy</h2>
          </div>
          
          {/* Content Buckets */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-700 mb-3">Content Buckets</h3>
            <div className="space-y-2">
              {mockStrategy.contentBuckets.map((bucket) => (
                <div
                  key={bucket.id}
                  className="flex items-center justify-between p-3 border border-stone-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${bucket.color}`}>
                      {bucket.name}
                    </div>
                    <span className="text-sm text-stone-600">{bucket.count} posts</span>
                  </div>
                  <button className="text-stone-400 hover:text-[#E86B32]">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Cadence */}
          <div className="mb-6 pb-6 border-b border-stone-200">
            <h3 className="text-sm font-medium text-stone-700 mb-2">Weekly Cadence</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-stone-800">{mockStrategy.weeklyCadence}</span>
              <span className="text-sm text-stone-600">posts per week</span>
            </div>
          </div>

          {/* KPIs */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-stone-50 rounded-lg">
                <div className="text-lg font-bold text-stone-800">{mockStrategy.kpis.engagement}</div>
                <div className="text-xs text-stone-600">Engagement</div>
              </div>
              <div className="text-center p-3 bg-stone-50 rounded-lg">
                <div className="text-lg font-bold text-stone-800">{mockStrategy.kpis.reach}</div>
                <div className="text-xs text-stone-600">Reach</div>
              </div>
              <div className="text-center p-3 bg-stone-50 rounded-lg">
                <div className="text-lg font-bold text-stone-800">{mockStrategy.kpis.clicks}</div>
                <div className="text-xs text-stone-600">Clicks</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

