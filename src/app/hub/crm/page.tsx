import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';

const leads = [
    { id: 1, name: 'Sarah Jenkins', region: 'Southeast Asia', stage: 'New', rep: 'You', notes: 'Interested in Bali, 3 months.' },
    { id: 2, name: 'Mike Ross', region: 'South America', stage: 'Sent Builder', rep: 'You', notes: 'Budget is tight, looking at Colombia.' },
    { id: 3, name: 'Jessica Pearson', region: 'Europe', stage: 'Closed', rep: 'You', notes: 'Booked for Lisbon in June.' },
    { id: 4, name: 'Louis Litt', region: 'Southeast Asia', stage: 'Warm', rep: 'Tyler', notes: 'Needs fast wifi for trading.' },
    { id: 5, name: 'Donna Paulsen', region: 'Central America', stage: 'New', rep: 'You', notes: 'Referral from Harvey.' },
];

const stages = ['All Stages', 'New', 'Warm', 'Sent Builder', 'Itinerary Created', 'Ready for Handoff', 'Closed'];

export default function CRMPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">CRM & Leads</Heading>
        <p className="text-lg text-stone-600">Manage your active conversations.</p>
      </div>

      <Card className="bg-white border-stone-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
                <select className="px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#E86B32]">
                    {stages.map(stage => <option key={stage}>{stage}</option>)}
                </select>
                <select className="px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#E86B32]">
                    <option>All Reps</option>
                    <option>You</option>
                    <option>Tyler</option>
                </select>
            </div>
            <div className="text-sm text-stone-500">
                Showing {leads.length} leads
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
                <thead className="bg-stone-100 text-stone-800 font-semibold">
                    <tr>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Region</th>
                        <th className="p-4">Stage</th>
                        <th className="p-4">Assigned To</th>
                        <th className="p-4">Notes</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-4 font-medium text-stone-900">{lead.name}</td>
                            <td className="p-4">{lead.region}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                    lead.stage === 'New' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    lead.stage === 'Closed' ? 'bg-green-50 text-green-700 border-green-100' :
                                    lead.stage === 'Warm' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                    'bg-stone-100 text-stone-600 border-stone-200'
                                }`}>
                                    {lead.stage}
                                </span>
                            </td>
                            <td className="p-4">{lead.rep}</td>
                            <td className="p-4 max-w-xs truncate" title={lead.notes}>{lead.notes}</td>
                            <td className="p-4">
                                <button className="text-[#E86B32] hover:underline font-medium">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
}

