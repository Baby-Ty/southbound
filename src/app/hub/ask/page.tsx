import { Heading } from '@/components/ui/Heading';
import { RepChat } from '../components/RepChat';

export default function AskPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="space-y-2 flex-shrink-0">
        <Heading level={1} className="!text-3xl md:!text-4xl">Ask South Bound</Heading>
        <p className="text-lg text-stone-600">Your AI assistant for quick answers.</p>
      </div>

      <div className="flex-grow">
        {/* Use a container that forces the chat to take up available space */}
        <div className="h-full flex flex-col">
             <RepChat />
        </div>
      </div>
    </div>
  );
}

