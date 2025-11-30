'use client';

// Force rebuild: v2
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Mail,
  MessageCircle,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  User,
} from 'lucide-react';
import { SavedRoute } from '@/lib/cosmos';

const STATUS_COLORS: Record<SavedRoute['status'], string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
};

const STATUS_ICONS: Record<SavedRoute['status'], typeof CheckCircle> = {
  draft: Clock,
  submitted: AlertCircle,
  'in-review': Clock,
  confirmed: CheckCircle,
};

export default function RoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SavedRoute['status'] | 'all'>('all');

  useEffect(() => {
    loadRoutes();
  }, [statusFilter]);

  async function loadRoutes() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      // Direct runtime URL detection for production
      const hostname = window.location.hostname;
      const isProduction = hostname.includes('azurewebsites.net') || hostname.includes('southbound');
      const baseUrl = isProduction 
        ? 'https://southbound-functions.azurewebsites.net' 
        : '';
      const url = `${baseUrl}/api/routes?${params.toString()}`;
      
      console.log('[Routes] Loading from:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load routes');
      
      const data = await response.json();
      setRoutes(data.routes || []);
    } catch (error) {
      console.error('Error loading routes:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      (route.name && route.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      route.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.stops.some((stop) =>
        stop.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const getRegionName = (region: string) => {
    const names: Record<string, string> = {
      europe: 'Europe',
      'latin-america': 'Latin America',
      'southeast-asia': 'Southeast Asia',
    };
    return names[region] || region;
  };

  const getTotalWeeks = (stops: SavedRoute['stops']) => {
    return stops.reduce((acc, stop) => acc + (stop.weeks || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Saved Routes</h1>
        <p className="text-stone-600">
          Review and manage routes submitted by users
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by email, region, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SavedRoute['status'] | 'all')}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="in-review">In Review</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      {/* Routes List */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {filteredRoutes.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-stone-300" />
            <p className="text-lg font-medium mb-2">No routes found</p>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Routes will appear here once users save them'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredRoutes.map((route) => {
              const StatusIcon = STATUS_ICONS[route.status];
              return (
                <div
                  key={route.id}
                  className="p-6 hover:bg-stone-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/hub/routes/${route.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[route.status]}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {route.status.replace('-', ' ')}
                        </span>
                        <span className="text-sm font-medium text-stone-600">
                          {getRegionName(route.region)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-stone-600 mb-3">
                        {route.name && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {route.name}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          {route.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {route.stops.length} stops
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {getTotalWeeks(route.stops)} weeks
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {route.stops.slice(0, 3).map((stop, idx) => (
                          <span
                            key={stop.id}
                            className="text-xs px-2 py-1 bg-stone-100 text-stone-700 rounded-md font-medium"
                          >
                            {stop.city}
                            {idx < Math.min(route.stops.length, 3) - 1 && ','}
                          </span>
                        ))}
                        {route.stops.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-stone-100 text-stone-700 rounded-md font-medium">
                            +{route.stops.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-stone-400">
                      <span className="text-xs">
                        {new Date(route.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {routes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="text-2xl font-bold text-stone-900">{routes.length}</div>
            <div className="text-sm text-stone-600">Total Routes</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {routes.filter((r) => r.status === 'submitted').length}
            </div>
            <div className="text-sm text-stone-600">Submitted</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {routes.filter((r) => r.status === 'in-review').length}
            </div>
            <div className="text-sm text-stone-600">In Review</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="text-2xl font-bold text-green-600">
              {routes.filter((r) => r.status === 'confirmed').length}
            </div>
            <div className="text-sm text-stone-600">Confirmed</div>
          </div>
        </div>
      )}
    </div>
  );
}

