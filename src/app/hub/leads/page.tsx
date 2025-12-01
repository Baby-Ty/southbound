'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    destination: string;
    stage: string;
    notes: string;
    lastContact: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ stage: 'New' });

  // Load leads from API on mount
  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      setError(null);
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('leads'));
      if (!response.ok) {
        throw new Error('Failed to load leads');
      }
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error('Error loading leads:', err);
      setError(err.message || 'Failed to load leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  const handleAddLead = async () => {
      if (!newLead.name || !newLead.destination) {
          setError('Name and destination are required');
          return;
      }

      try {
          setSaving(true);
          setError(null);
          const { apiUrl } = await import('@/lib/api');
          const response = await fetch(apiUrl('leads'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  name: newLead.name,
                  destination: newLead.destination,
                  stage: newLead.stage || 'New',
                  notes: newLead.notes || '',
              }),
          });

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || 'Failed to save lead');
          }

          const data = await response.json();
          setLeads([data.lead, ...leads]);
          setNewLead({ stage: 'New' });
          setIsAdding(false);
      } catch (err: any) {
          console.error('Error saving lead:', err);
          setError(err.message || 'Failed to save lead');
      } finally {
          setSaving(false);
      }
  };

  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this lead?')) {
          return;
      }

      try {
          setDeleting(id);
          setError(null);
          const { apiUrl } = await import('@/lib/api');
          const response = await fetch(apiUrl(`leads/${id}`), {
              method: 'DELETE',
          });

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || 'Failed to delete lead');
          }

          setLeads(leads.filter(l => l.id !== id));
      } catch (err: any) {
          console.error('Error deleting lead:', err);
          setError(err.message || 'Failed to delete lead');
      } finally {
          setDeleting(null);
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <Heading level={1} className="!text-3xl md:!text-4xl">My Leads</Heading>
            <p className="text-lg text-stone-600">Track your active conversations.</p>
        </div>
        <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#E86B32] text-white px-4 py-2 rounded-lg hover:bg-[#F1783A] transition-colors font-medium"
        >
            <Plus className="w-5 h-5" /> Add Lead
        </button>
      </div>

      {error && (
          <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-700 text-sm">{error}</p>
          </Card>
      )}

      {isAdding && (
          <Card className="p-4 bg-orange-50 border-orange-200 mb-6">
              <h3 className="font-bold text-stone-800 mb-4">New Lead</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="p-2 rounded border border-stone-300"
                    value={newLead.name || ''}
                    onChange={e => setNewLead({...newLead, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Destination Interest" 
                    className="p-2 rounded border border-stone-300"
                    value={newLead.destination || ''}
                    onChange={e => setNewLead({...newLead, destination: e.target.value})}
                  />
                  <select 
                    className="p-2 rounded border border-stone-300"
                    value={newLead.stage}
                    onChange={e => setNewLead({...newLead, stage: e.target.value})}
                  >
                      <option>New</option>
                      <option>Warm</option>
                      <option>Sent Builder</option>
                      <option>Closed</option>
                      <option>Lost</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Notes" 
                    className="p-2 rounded border border-stone-300"
                    value={newLead.notes || ''}
                    onChange={e => setNewLead({...newLead, notes: e.target.value})}
                  />
              </div>
              <div className="flex gap-2 justify-end">
                  <button 
                      onClick={() => {
                          setIsAdding(false);
                          setNewLead({ stage: 'New' });
                          setError(null);
                      }} 
                      className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded"
                      disabled={saving}
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={handleAddLead} 
                      className="px-4 py-2 bg-[#E86B32] text-white rounded hover:bg-[#F1783A] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={saving || !newLead.name || !newLead.destination}
                  >
                      {saving ? (
                          <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                          </>
                      ) : (
                          <>
                              <Save className="w-4 h-4" />
                              Save Lead
                          </>
                      )}
                  </button>
              </div>
          </Card>
      )}

      <Card className="bg-white border-stone-200 overflow-hidden">
        {loading ? (
            <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500 mx-auto mb-4" />
                <p className="text-stone-600">Loading leads...</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-600">
                    <thead className="bg-stone-100 text-stone-800 font-semibold">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Interest</th>
                            <th className="p-4">Stage</th>
                            <th className="p-4">Notes</th>
                            <th className="p-4">Last Contact</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-stone-400">No leads yet. Add one above!</td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="p-4 font-medium text-stone-900">{lead.name}</td>
                                    <td className="p-4">{lead.destination}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                            lead.stage === 'New' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            lead.stage === 'Closed' ? 'bg-green-50 text-green-700 border-green-100' :
                                            lead.stage === 'Lost' ? 'bg-stone-100 text-stone-500 border-stone-200' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                            {lead.stage}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-xs truncate" title={lead.notes}>{lead.notes}</td>
                                    <td className="p-4 text-xs text-stone-400">{lead.lastContact}</td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => handleDelete(lead.id)} 
                                            className="text-stone-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={deleting === lead.id}
                                        >
                                            {deleting === lead.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </Card>
    </div>
  );
}

