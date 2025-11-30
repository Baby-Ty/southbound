'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    destination: string;
    stage: string;
    notes: string;
    lastContact: string;
}

const initialLeads: Lead[] = [
    { id: '1', name: 'Sarah Jenkins', destination: 'Southeast Asia', stage: 'New', notes: 'Interested in Bali, 3 months.', lastContact: '2023-11-28' },
    { id: '2', name: 'Mike Ross', destination: 'South America', stage: 'Sent Builder', notes: 'Budget is tight.', lastContact: '2023-11-25' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ stage: 'New' });

  // Load from localStorage on mount
  useEffect(() => {
      const saved = localStorage.getItem('sb_leads');
      if (saved) {
          setLeads(JSON.parse(saved));
      } else {
          setLeads(initialLeads);
      }
  }, []);

  // Save to localStorage whenever leads change
  useEffect(() => {
      if (leads.length > 0) { // Prevent overwriting with empty array on initial hydration if not careful
           localStorage.setItem('sb_leads', JSON.stringify(leads));
      }
  }, [leads]);

  const handleAddLead = () => {
      if (!newLead.name) return;
      const lead: Lead = {
          id: Date.now().toString(),
          name: newLead.name || '',
          destination: newLead.destination || '',
          stage: newLead.stage || 'New',
          notes: newLead.notes || '',
          lastContact: new Date().toISOString().split('T')[0]
      };
      setLeads([lead, ...leads]);
      setNewLead({ stage: 'New' });
      setIsAdding(false);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure?')) {
          setLeads(leads.filter(l => l.id !== id));
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
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded">Cancel</button>
                  <button onClick={handleAddLead} className="px-4 py-2 bg-[#E86B32] text-white rounded hover:bg-[#F1783A]">Save Lead</button>
              </div>
          </Card>
      )}

      <Card className="bg-white border-stone-200 overflow-hidden">
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
                                    <button onClick={() => handleDelete(lead.id)} className="text-stone-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
}

