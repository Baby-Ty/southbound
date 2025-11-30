import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { PenTool, FileText } from 'lucide-react';
import { RepChat } from '../components/RepChat';
import { CommissionCalculator } from '../components/CommissionCalculator';

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Tools</Heading>
        <p className="text-lg text-stone-600">Everything you need to close deals.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
            <Link href="#" className="block group">
                <Card className="p-6 bg-white border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <PenTool className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-stone-800">Trip Builder</h3>
                    </div>
                    <p className="text-sm text-stone-600">Create a custom itinerary link to send to your client.</p>
                </Card>
            </Link>
            
             <Link href="/hub/resources/scripts" className="block group">
                <Card className="p-6 bg-white border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-stone-800">Scripts</h3>
                    </div>
                    <p className="text-sm text-stone-600">Quick access to message templates.</p>
                </Card>
            </Link>
            
            <CommissionCalculator />
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
             <RepChat />
        </div>
      </div>
    </div>
  );
}

