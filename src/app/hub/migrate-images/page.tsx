'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Database, Cloud } from 'lucide-react';

interface MigrationResult {
  success: boolean;
  dryRun?: boolean;
  results?: {
    total: number;
    migrated: number;
    skipped: number;
    failed: number;
    details: Array<{ city: string; status: string; updates?: any }>;
  };
  city?: string;
  updates?: any;
  message?: string;
  error?: string;
}

export default function MigrateImagesPage() {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [cityId, setCityId] = useState('');

  const runMigration = async (dryRun: boolean = false) => {
    setMigrating(true);
    setResult(null);

    try {
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('migrate-images'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: cityId.trim() || undefined,
          dryRun,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Failed to run migration',
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Cloud className="w-6 h-6 text-sb-orange-500" />
          <h1 className="text-2xl font-bold text-stone-900">Migrate Images to Blob Storage</h1>
        </div>

        <p className="text-stone-600 mb-6">
          This will migrate all city images from external URLs (like Unsplash) to Azure Blob Storage.
          Images will be publicly accessible and stored permanently.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              City ID (optional - leave empty to migrate all cities)
            </label>
            <input
              type="text"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              placeholder="e.g., city-123"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              disabled={migrating}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => runMigration(true)}
              disabled={migrating}
              className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {migrating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Dry Run (Test)
                </>
              )}
            </button>
            <button
              onClick={() => runMigration(false)}
              disabled={migrating}
              className="flex-1 px-4 py-3 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {migrating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  Run Migration
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className={`bg-white rounded-xl border p-6 ${
          result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-2 ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? 'Migration Completed' : 'Migration Failed'}
              </h3>

              {result.error && (
                <p className="text-red-700 mb-4">{result.error}</p>
              )}

              {result.message && (
                <p className={`mb-4 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>
              )}

              {result.results && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-stone-900">{result.results.total}</div>
                      <div className="text-xs text-stone-600 mt-1">Total</div>
                    </div>
                    <div className="text-center p-3 bg-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{result.results.migrated}</div>
                      <div className="text-xs text-green-600 mt-1">Migrated</div>
                    </div>
                    <div className="text-center p-3 bg-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{result.results.skipped}</div>
                      <div className="text-xs text-blue-600 mt-1">Skipped</div>
                    </div>
                    <div className="text-center p-3 bg-red-100 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">{result.results.failed}</div>
                      <div className="text-xs text-red-600 mt-1">Failed</div>
                    </div>
                  </div>

                  {result.results.details.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-stone-700 mb-2">Details:</h4>
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {result.results.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="text-xs p-2 bg-white rounded border border-stone-200"
                          >
                            <span className="font-medium">{detail.city}:</span>{' '}
                            <span className={
                              detail.status.includes('migrated') ? 'text-green-600' :
                              detail.status.includes('failed') ? 'text-red-600' :
                              'text-stone-600'
                            }>
                              {detail.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {result.city && result.updates && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-stone-700 mb-2">City: {result.city}</h4>
                  <pre className="text-xs bg-white p-3 rounded border border-stone-200 overflow-auto">
                    {JSON.stringify(result.updates, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Stock images (Unsplash) are automatically uploaded to blob storage when selected</li>
          <li>AI-generated images are automatically uploaded to blob storage when saved</li>
          <li>File uploads are automatically uploaded to blob storage</li>
          <li>This migration tool moves existing URL-based images to blob storage</li>
          <li>All blob storage images are publicly accessible</li>
        </ul>
      </div>
    </div>
  );
}


