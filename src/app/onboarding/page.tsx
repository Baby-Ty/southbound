import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'South Bound – Quick Onboarding',
  description: 'A quick guide to understand what South Bound is and what your role will be.',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            South Bound – Quick Onboarding
          </h1>
          <p className="text-lg text-gray-600">
            A quick guide to understand what South Bound is and what your role will be.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10 space-y-10">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What South Bound Is</h2>
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p>South Bound is a founder-led travel studio that helps South Africans live and work abroad for 30–90 days.</p>
              <p>Tyler, the founder, creates simple itineraries with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Area recommendations</li>
                <li>Remote-work friendly accommodation</li>
                <li>Coworking/café options</li>
                <li>Lifestyle tips (gyms, basics, safety)</li>
                <li>Budget guidance</li>
                <li>WhatsApp support before the trip</li>
              </ul>
              <p className="mt-3">Destinations South Bound focuses on: Cape Town, Mexico, Argentina, Brazil.</p>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Who It's For</h2>
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p className="font-medium">South Bound's ideal travellers:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Work remotely</li>
                <li>Want a change of scenery</li>
                <li>Prefer slow travel over holidays</li>
                <li>Care about safety, comfort, lifestyle</li>
                <li>Age range: 25–40, flexible budget</li>
              </ul>
              <p className="mt-3 italic">If someone says "I'd love to go live in ____ for a month or two," they're a fit.</p>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Your Role</h2>
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p className="font-medium">Your job is simple:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Talk to people</li>
                <li>Share the itinerary builder</li>
                <li>Ask a few questions</li>
                <li>Keep chats moving</li>
                <li>Book calls when someone is serious</li>
                <li>Log leads in the tracker</li>
                <li>Hand tricky questions to Tyler, the founder</li>
              </ul>
              <p className="mt-3">You don't need travel knowledge.</p>
              <p>You don't need to close deals alone.</p>
              <p className="font-medium mt-3">2–5 hours a week is enough.</p>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. The Flow</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4 leading-relaxed">
              <li>Someone shows interest</li>
              <li>You ask: when, how long, budget, vibe</li>
              <li>Send the itinerary builder link</li>
              <li>Tyler, the founder, creates a draft itinerary</li>
              <li>You keep the conversation warm</li>
              <li>Suggest a quick call</li>
              <li>They pay a deposit → booked</li>
            </ol>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Basic Scripts</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Intro:</h3>
                <p className="text-gray-700 italic">
                  Hey! I'm helping with South Bound — it's a founder-led travel studio that helps South Africans live and work abroad for 30–90 days. Want me to send a sample itinerary?
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Follow-up questions:</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• When are you thinking of going?</li>
                  <li>• How long would you stay?</li>
                  <li>• Any place in mind?</li>
                  <li>• Your budget per month?</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Share builder:</h3>
                <p className="text-gray-700 italic">
                  Here's the itinerary link — pick a destination + trip length and you'll get a plan. Tyler, the founder, can customise it once you've checked it out.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Call:</h3>
                <p className="text-gray-700 italic">
                  Want a quick 10–15 min call with Tyler, the founder, to chat next steps?
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Follow-up:</h3>
                <p className="text-gray-700 italic">
                  Hey! Just checking if you had a chance to look at the itinerary 🙂
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tools You'll Use</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 leading-relaxed">
              <li>WhatsApp Business</li>
              <li>Instagram / LinkedIn messages</li>
              <li>Lead tracker (Notion/Airtable)</li>
              <li>Itinerary builder link</li>
              <li>Destination cheat sheets</li>
            </ul>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Earnings</h2>
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p className="font-medium">Commission-only for now:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You earn a fixed amount per traveller who books (or a percentage of our service fee).</li>
                <li>Paid when the traveller pays the deposit.</li>
              </ul>
              <p className="mt-3 text-sm text-gray-500 italic">
                {/* Easy to edit: Update the numbers below */}
                Amount: $XXX per booking | Percentage: XX% of service fee
              </p>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. What a Week Looks Like</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 leading-relaxed">
              <li>Reply to leads</li>
              <li>Reach out to 10–20 people</li>
              <li>Share the itinerary link</li>
              <li>Log conversations</li>
              <li>Follow up with warm leads</li>
              <li>Send Tyler, the founder, a quick weekly summary</li>
            </ul>
            <p className="mt-3 font-medium text-gray-700">Time: 2–5 hours per week.</p>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Ready to Start?</h2>
            <div className="text-gray-700 space-y-3 leading-relaxed mb-6">
              <p>If everything makes sense, the next step is simple:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Message Tyler, the founder</li>
                <li>He'll do a quick call with you</li>
                <li>You'll get access to all links and tools</li>
                <li>Then you can start with a few test messages</li>
              </ul>
            </div>
            <a
              href="#"
              className="inline-block bg-[#2CB5C0] hover:bg-[#2399a3] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Message Tyler on WhatsApp
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}

