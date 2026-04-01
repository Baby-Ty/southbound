'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Calendar,
  Save,
  Send,
  FileText,
  Clock,
  Edit,
  Trash2,
  Plus,
  Hash,
  X,
  Eye,
  EyeOff,
  Loader2,
  ChevronDown,
  Search,
  Tag,
  RefreshCw,
  Linkedin,
  AlertCircle,
  CheckCircle2,
  Globe,
  MessageSquare,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PostType = 'city-series' | 'lifestyle' | 'practical' | 'inspiration' | 'reel';
type PostStatus = 'draft' | 'scheduled' | 'published';

interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  city?: string;
  day?: number;
  hashtags: string[];
  mediaFiles: { name: string; url?: string }[];
  status: PostStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  timezone: string;
  createdAt: string;
  series?: string;
  visualNote?: string;
  source?: 'imported' | 'created';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POST_TYPES: { value: PostType; label: string; color: string }[] = [
  { value: 'city-series', label: 'City Series', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'lifestyle', label: 'Lifestyle', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'practical', label: 'Practical', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'inspiration', label: 'Inspiration', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'reel', label: 'Reel', color: 'bg-pink-100 text-pink-700 border-pink-200' },
];

const STATUS_COLORS: Record<PostStatus, string> = {
  draft: 'bg-stone-100 text-stone-600',
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
};

const TIMEZONES = [
  { value: 'Africa/Johannesburg', label: 'SAST — Johannesburg' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'GMT — London' },
  { value: 'Asia/Bangkok', label: 'ICT — Bangkok' },
  { value: 'Asia/Bali', label: 'WITA — Bali' },
  { value: 'America/Bogota', label: 'COT — Medellín' },
  { value: 'America/Argentina/Buenos_Aires', label: 'ART — Buenos Aires' },
  { value: 'Asia/Tbilisi', label: 'GET — Tbilisi' },
];

const LINKEDIN_CHAR_LIMIT = 3000;

const DEFAULT_HASHTAG_POOL = [
  '#RemoteWork', '#SouthAfrica', '#DigitalNomad', '#SlowTravel',
  '#WorkFromAnywhere', '#SouthAfricanNomad', '#Bali', '#Bangkok',
  '#ChiangMai', '#Medellin', '#BuenosAires', '#Tbilisi',
  '#RemoteWorker', '#TravelAndWork', '#NomadLife', '#WorkAndTravel',
  '#SouthBound', '#LiveAbroad', '#ExpatLife', '#LatinAmerica',
  '#SoutheastAsia', '#EasternEurope', '#AffordableTravel',
];

function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function newPost(): Post {
  return {
    id: generateId(),
    title: '',
    content: '',
    type: 'city-series',
    hashtags: [],
    mediaFiles: [],
    status: 'draft',
    timezone: 'Africa/Johannesburg',
    createdAt: new Date().toISOString(),
    source: 'created',
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type, small }: { type: PostType; small?: boolean }) {
  const t = POST_TYPES.find((p) => p.value === type);
  if (!t) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${t.color} ${small ? 'text-[10px]' : ''}`}>
      {t.label}
    </span>
  );
}

function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}

/** LinkedIn-style post preview */
function LinkedInPreview({ content, title }: { content: string; title: string }) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_LIMIT = 280;
  const shouldTruncate = content.length > PREVIEW_LIMIT && !expanded;
  const displayContent = shouldTruncate ? content.slice(0, PREVIEW_LIMIT) : content;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Profile header */}
      <div className="p-4 flex items-center gap-3 border-b border-stone-100">
        <div className="w-10 h-10 rounded-full bg-[#E86B32] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          T
        </div>
        <div>
          <p className="font-semibold text-stone-900 text-sm">Tyler | South Bound</p>
          <p className="text-xs text-stone-500">Founder • South Bound</p>
          <p className="text-xs text-stone-400">Just now • <Globe className="inline w-3 h-3" /></p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {content ? (
          <div className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
            {displayContent}
            {shouldTruncate && (
              <>
                <span className="text-stone-400">...</span>
                <button
                  onClick={() => setExpanded(true)}
                  className="ml-1 text-stone-500 font-medium hover:underline"
                >
                  see more
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-stone-400 italic">Your post will appear here as you type...</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 border-t border-stone-100 pt-3 flex items-center gap-6 text-xs text-stone-500">
        <button className="flex items-center gap-1 hover:text-blue-600">
          <span>👍</span> Like
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600">
          <MessageSquare className="w-3.5 h-3.5" /> Comment
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600">
          <RefreshCw className="w-3.5 h-3.5" /> Repost
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600">
          <Send className="w-3.5 h-3.5" /> Send
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LinkedInPage() {
  // ── Post list state ──
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<PostType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');

  // ── Editor state ──
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');
  const [showSavedHashtags, setShowSavedHashtags] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');

  // ── Hashtag pool (persisted to localStorage) ──
  const [savedHashtags, setSavedHashtags] = useState<string[]>(DEFAULT_HASHTAG_POOL);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Load saved hashtags from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sb-linkedin-hashtags');
      if (stored) setSavedHashtags(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist hashtags to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('sb-linkedin-hashtags', JSON.stringify(savedHashtags));
    } catch {}
  }, [savedHashtags]);

  // Load imported posts on mount
  useEffect(() => {
    async function loadPosts() {
      setIsLoadingPosts(true);
      try {
        const res = await fetch('/api/linkedin/import-posts');
        const data = await res.json();
        if (data.posts?.length > 0) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Failed to load imported posts:', err);
      } finally {
        setIsLoadingPosts(false);
      }
    }
    loadPosts();
  }, []);

  // ── Derived state ──
  const selectedPost = posts.find((p) => p.id === selectedId) ?? null;

  const filteredPosts = posts.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || p.type === filterType;
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // ── Post mutation helpers ──
  function updatePost(id: string, changes: Partial<Post>) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }

  function deletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function createNewPost() {
    const p = newPost();
    setPosts((prev) => [p, ...prev]);
    setSelectedId(p.id);
    setShowPreview(false);
  }

  function handleSave() {
    if (!selectedPost) return;
    // In production this would persist to Cosmos DB
    setSaveNotice('Draft saved');
    setTimeout(() => setSaveNotice(''), 2000);
  }

  function handleSchedule() {
    if (!selectedPost) return;
    if (!selectedPost.scheduledDate || !selectedPost.scheduledTime) {
      setGenerateError('Pick a date and time to schedule.');
      return;
    }
    updatePost(selectedPost.id, { status: 'scheduled' });
    setSaveNotice('Post scheduled');
    setTimeout(() => setSaveNotice(''), 2500);
  }

  // ── Hashtag helpers ──
  function addHashtagToPost(tag: string) {
    if (!selectedPost) return;
    const normalised = tag.startsWith('#') ? tag : `#${tag}`;
    if (selectedPost.hashtags.includes(normalised)) return;
    if (selectedPost.hashtags.length >= 5) return;
    updatePost(selectedPost.id, { hashtags: [...selectedPost.hashtags, normalised] });
  }

  function removeHashtagFromPost(tag: string) {
    if (!selectedPost) return;
    updatePost(selectedPost.id, { hashtags: selectedPost.hashtags.filter((h) => h !== tag) });
  }

  function addToHashtagPool(tag: string) {
    const normalised = tag.startsWith('#') ? tag : `#${tag}`;
    if (!savedHashtags.includes(normalised)) {
      setSavedHashtags((prev) => [...prev, normalised]);
    }
  }

  function removeFromHashtagPool(tag: string) {
    setSavedHashtags((prev) => prev.filter((h) => h !== tag));
  }

  function handleHashtagInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const tag = hashtagInput.trim();
      addHashtagToPost(tag);
      addToHashtagPool(tag);
      setHashtagInput('');
    }
  }

  // ── AI API calls ──
  async function callGenerate(action: 'post' | 'title' | 'hashtags', extra: Record<string, any> = {}) {
    if (!selectedPost) return null;
    setGenerateError('');
    const body = {
      action,
      type: selectedPost.type,
      city: selectedPost.city,
      day: selectedPost.day,
      content: selectedPost.content,
      ...extra,
    };
    const res = await fetch('/api/linkedin/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setGenerateError(data.error || 'Generation failed');
      return null;
    }
    return data.result as string;
  }

  async function handleGeneratePost() {
    if (!selectedPost) return;
    setIsGeneratingPost(true);
    try {
      const result = await callGenerate('post', { topic: selectedPost.title || undefined });
      if (result) {
        updatePost(selectedPost.id, { content: result });
        // Auto-expand to show the preview
        if (result.length > 100) setShowPreview(false); // keep editor visible
      }
    } finally {
      setIsGeneratingPost(false);
    }
  }

  async function handleGenerateTitle() {
    if (!selectedPost) return;
    setIsGeneratingTitle(true);
    try {
      const result = await callGenerate('title');
      if (result) updatePost(selectedPost.id, { title: result });
    } finally {
      setIsGeneratingTitle(false);
    }
  }

  async function handleGenerateHashtags() {
    if (!selectedPost) return;
    setIsGeneratingHashtags(true);
    try {
      const result = await callGenerate('hashtags');
      if (result) {
        const tags = result.match(/#[a-zA-Z][a-zA-Z0-9]*/g) || [];
        // Add to post (up to 5) and to saved pool
        const newTags: string[] = [];
        for (const tag of tags) {
          if (newTags.length + selectedPost.hashtags.length < 5) {
            if (!selectedPost.hashtags.includes(tag)) newTags.push(tag);
          }
          addToHashtagPool(tag);
        }
        updatePost(selectedPost.id, { hashtags: [...selectedPost.hashtags, ...newTags] });
      }
    } finally {
      setIsGeneratingHashtags(false);
    }
  }

  // ── Character counter colour ──
  function charCountColour(len: number) {
    if (len > LINKEDIN_CHAR_LIMIT) return 'text-red-600 font-semibold';
    if (len > LINKEDIN_CHAR_LIMIT * 0.9) return 'text-orange-500';
    return 'text-stone-400';
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-2rem)] -mx-4 md:-mx-8 -mt-4 md:-mt-8">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-72 xl:w-80 flex-shrink-0 border-r border-stone-200 bg-white flex flex-col">
        {/* Sidebar header */}
        <div className="p-4 border-b border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              <h1 className="font-bold text-stone-900">LinkedIn</h1>
            </div>
            <button
              onClick={createNewPost}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E86B32] text-white rounded-lg text-sm font-medium hover:bg-[#d4612c] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New post
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32] bg-stone-50"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as PostType | 'all')}
              className="flex-1 text-xs px-2 py-1.5 border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#E86B32] bg-white"
            >
              <option value="all">All types</option>
              {POST_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PostStatus | 'all')}
              className="flex-1 text-xs px-2 py-1.5 border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#E86B32] bg-white"
            >
              <option value="all">All status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Post list */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingPosts ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-5 h-5 text-stone-400 animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-6 text-center text-stone-400 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              {posts.length === 0 ? 'No posts yet. Create your first one.' : 'No posts match your filters.'}
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {filteredPosts.map((post) => (
                <li key={post.id}>
                  <button
                    onClick={() => { setSelectedId(post.id); setShowPreview(false); setGenerateError(''); }}
                    className={`w-full text-left p-3.5 hover:bg-stone-50 transition-colors ${
                      selectedId === post.id ? 'bg-orange-50 border-l-2 border-[#E86B32]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <TypeBadge type={post.type} small />
                      <StatusBadge status={post.status} />
                    </div>
                    <p className="text-sm font-medium text-stone-800 line-clamp-1 mb-1">
                      {post.title || (
                        <span className="italic text-stone-400">Untitled post</span>
                      )}
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {post.content.slice(0, 90) || 'No content yet'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400">
                      {post.city && <span>{post.city}{post.day ? ` · Day ${post.day}` : ''}</span>}
                      {post.scheduledDate && (
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {post.scheduledDate}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-stone-200 text-xs text-stone-400 text-center">
          {posts.length} post{posts.length !== 1 ? 's' : ''} total
        </div>
      </aside>

      {/* ── MAIN EDITOR AREA ── */}
      <main className="flex-1 overflow-y-auto bg-stone-50/50">
        {!selectedPost ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
              <Linkedin className="w-8 h-8 text-[#E86B32]" />
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">LinkedIn Content Hub</h2>
            <p className="text-stone-500 mb-6 max-w-sm text-sm">
              Select a post to edit, or create a new one. The AI can generate posts, titles, and hashtags in the South Bound voice.
            </p>
            <button
              onClick={createNewPost}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E86B32] text-white rounded-xl font-medium hover:bg-[#d4612c] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first post
            </button>
          </div>
        ) : (
          /* Post editor */
          <div className="max-w-3xl mx-auto p-6 pb-16">

            {/* Editor top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Type selector */}
                <div className="relative">
                  <select
                    value={selectedPost.type}
                    onChange={(e) => updatePost(selectedPost.id, { type: e.target.value as PostType })}
                    className="appearance-none pl-3 pr-7 py-1.5 text-sm font-medium border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-[#E86B32] cursor-pointer"
                  >
                    {POST_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                </div>

                {/* City + Day (city series only) */}
                {selectedPost.type === 'city-series' && (
                  <>
                    <input
                      type="text"
                      placeholder="City name"
                      value={selectedPost.city || ''}
                      onChange={(e) => updatePost(selectedPost.id, { city: e.target.value })}
                      className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] w-32"
                    />
                    <div className="relative">
                      <select
                        value={selectedPost.day || ''}
                        onChange={(e) => updatePost(selectedPost.id, { day: parseInt(e.target.value) || undefined })}
                        className="appearance-none pl-3 pr-7 py-1.5 text-sm border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-[#E86B32]"
                      >
                        <option value="">Day?</option>
                        <option value="1">Day 1 — Intro</option>
                        <option value="2">Day 2 — Accommodation</option>
                        <option value="3">Day 3 — Work Setup</option>
                        <option value="4">Day 4 — Food</option>
                        <option value="5">Day 5 — Fitness</option>
                        <option value="6">Day 6 — Weekends</option>
                        <option value="7">Day 7 — Community</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Preview toggle */}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    showPreview
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPreview ? 'Edit' : 'Preview'}
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm('Delete this post?')) deletePost(selectedPost.id);
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showPreview ? (
              /* ── PREVIEW MODE ── */
              <LinkedInPreview content={selectedPost.content} title={selectedPost.title} />
            ) : (
              /* ── EDIT MODE ── */
              <div className="space-y-5">

                {/* Error notice */}
                {generateError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {generateError}
                    <button onClick={() => setGenerateError('')} className="ml-auto"><X className="w-4 h-4" /></button>
                  </div>
                )}

                {/* ── TITLE ── */}
                <section className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Title</label>
                    <button
                      onClick={handleGenerateTitle}
                      disabled={isGeneratingTitle}
                      className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingTitle ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-[#E86B32]" />
                      )}
                      Generate title
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Give this post a title for filing (not the hook — just your internal label)"
                    value={selectedPost.title}
                    onChange={(e) => updatePost(selectedPost.id, { title: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32]"
                  />
                </section>

                {/* ── CONTENT ── */}
                <section className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Post Content</label>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${charCountColour(selectedPost.content.length)}`}>
                        {selectedPost.content.length}/{LINKEDIN_CHAR_LIMIT}
                      </span>
                      <button
                        onClick={handleGeneratePost}
                        disabled={isGeneratingPost}
                        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-[#E86B32] hover:bg-[#d4612c] text-white transition-colors disabled:opacity-60"
                      >
                        {isGeneratingPost ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {isGeneratingPost ? 'Generating...' : 'Generate post'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    ref={contentRef}
                    value={selectedPost.content}
                    onChange={(e) => updatePost(selectedPost.id, { content: e.target.value })}
                    placeholder={
                      selectedPost.type === 'city-series' && selectedPost.city && selectedPost.day
                        ? `Write your ${selectedPost.city} Day ${selectedPost.day} post, or click Generate...`
                        : 'Write your post here, or click Generate to create one from your type/city selection...'
                    }
                    rows={14}
                    className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32] resize-none font-mono leading-relaxed"
                  />
                  <p className="text-xs text-stone-400 mt-1.5">
                    First 2–3 lines must make someone click "see more". Short paragraphs. Leave white space.
                  </p>
                </section>

                {/* ── HASHTAGS ── */}
                <section className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5" />
                      Hashtags
                      <span className="text-stone-400 font-normal">({selectedPost.hashtags.length}/5)</span>
                    </label>
                    <button
                      onClick={handleGenerateHashtags}
                      disabled={isGeneratingHashtags}
                      className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingHashtags ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-[#E86B32]" />
                      )}
                      Suggest hashtags
                    </button>
                  </div>

                  {/* Active post hashtags */}
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                    {selectedPost.hashtags.length === 0 ? (
                      <span className="text-xs text-stone-400 italic">No hashtags yet — generate or type below</span>
                    ) : (
                      selectedPost.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E86B32] bg-opacity-10 text-[#E86B32] border border-[#E86B32] border-opacity-30 rounded-full text-xs font-medium"
                        >
                          {tag}
                          <button onClick={() => removeHashtagFromPost(tag)} className="hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Type a hashtag */}
                  {selectedPost.hashtags.length < 5 && (
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Type a hashtag and press Enter..."
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={handleHashtagInputKeyDown}
                        className="flex-1 px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32]"
                      />
                    </div>
                  )}

                  {/* Saved hashtag pool */}
                  <div>
                    <button
                      onClick={() => setShowSavedHashtags(!showSavedHashtags)}
                      className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 mb-2"
                    >
                      <Tag className="w-3 h-3" />
                      Saved hashtags ({savedHashtags.length})
                      <ChevronDown className={`w-3 h-3 transition-transform ${showSavedHashtags ? 'rotate-180' : ''}`} />
                    </button>

                    {showSavedHashtags && (
                      <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        {savedHashtags.map((tag) => (
                          <div key={tag} className="group flex items-center">
                            <button
                              onClick={() => addHashtagToPost(tag)}
                              disabled={selectedPost.hashtags.includes(tag) || selectedPost.hashtags.length >= 5}
                              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                selectedPost.hashtags.includes(tag)
                                  ? 'bg-stone-200 text-stone-400 border-stone-200 cursor-not-allowed'
                                  : 'bg-white text-stone-600 border-stone-300 hover:bg-[#E86B32] hover:text-white hover:border-[#E86B32]'
                              }`}
                            >
                              {tag}
                            </button>
                            <button
                              onClick={() => removeFromHashtagPool(tag)}
                              className="hidden group-hover:block ml-0.5 text-stone-300 hover:text-red-500"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* ── MEDIA ── */}
                <section className="bg-white rounded-xl border border-stone-200 p-4">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-3">
                    Media
                  </label>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-sm text-stone-700 transition-colors">
                      <Upload className="w-4 h-4 text-stone-500" />
                      Upload image / video
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          if (!e.target.files) return;
                          const newFiles = Array.from(e.target.files).map((f) => ({ name: f.name }));
                          updatePost(selectedPost.id, { mediaFiles: [...selectedPost.mediaFiles, ...newFiles] });
                        }}
                      />
                    </label>
                    <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-sm text-stone-700 transition-colors">
                      <ImageIcon className="w-4 h-4 text-stone-500" />
                      Generate image prompt
                    </button>
                  </div>

                  {selectedPost.mediaFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.mediaFiles.map((f, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg text-xs text-stone-700"
                        >
                          <FileText className="w-3 h-3" />
                          {f.name}
                          <button
                            onClick={() =>
                              updatePost(selectedPost.id, {
                                mediaFiles: selectedPost.mediaFiles.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-stone-400 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedPost.visualNote && (
                    <p className="mt-3 text-xs text-stone-500 italic bg-stone-50 px-3 py-2 rounded-lg border border-stone-200">
                      <span className="font-medium not-italic">Visual note:</span> {selectedPost.visualNote}
                    </p>
                  )}
                </section>

                {/* ── SCHEDULE ── */}
                <section className="bg-white rounded-xl border border-stone-200 p-4">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Date</label>
                      <input
                        type="date"
                        value={selectedPost.scheduledDate || ''}
                        onChange={(e) => updatePost(selectedPost.id, { scheduledDate: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Time</label>
                      <input
                        type="time"
                        value={selectedPost.scheduledTime || ''}
                        onChange={(e) => updatePost(selectedPost.id, { scheduledTime: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Timezone</label>
                      <select
                        value={selectedPost.timezone}
                        onChange={(e) => updatePost(selectedPost.id, { timezone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-[#E86B32]"
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* ── ACTION BAR ── */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 border border-stone-200 bg-white text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save draft
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={!selectedPost.scheduledDate || !selectedPost.scheduledTime}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2] text-white rounded-xl text-sm font-medium hover:bg-[#0958a8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Clock className="w-4 h-4" />
                    Schedule post
                  </button>
                  <button
                    disabled
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-400 rounded-xl text-sm font-medium cursor-not-allowed"
                    title="Connect LinkedIn to publish directly"
                  >
                    <Send className="w-4 h-4" />
                    Publish now
                  </button>

                  {/* Save notice */}
                  {saveNotice && (
                    <span className="flex items-center gap-1.5 text-sm text-green-700 ml-auto">
                      <CheckCircle2 className="w-4 h-4" />
                      {saveNotice}
                    </span>
                  )}
                </div>

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
