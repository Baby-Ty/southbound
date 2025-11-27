import { Check, MapPin, Heart, DollarSign, Globe, Clock, Sparkles, User } from 'lucide-react';

export const metadata = {
  title: 'Customer Success – South Bound',
  description: 'Join South Bound as a Customer Success team member. Remote, flexible, and perfect for travel enthusiasts.',
};

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-stone-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-6 animate-fade-in">
            <span className="px-3 py-1 text-xs font-bold tracking-wide text-orange-700 uppercase">Hiring Now</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 mb-8 tracking-tight font-heading">
            Customer Success
            <span className="block text-3xl sm:text-4xl text-orange-500 mt-2 font-handwritten rotate-[-2deg] origin-center transform-gpu">
              @ South Bound
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
            We're looking for someone to help with customer success.
            <span className="block mt-4 text-stone-500 text-lg">
              The role is about welcoming new leads, understanding what they want, and helping them get started with planning their trip.
            </span>
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-stone-500">
            <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-stone-100">
              <Globe className="w-4 h-4 mr-2 text-teal-500" />
              Remote
            </div>
            <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-stone-100">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              Flexible
            </div>
            <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-stone-100">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              Chilled Vibes
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Role Overview */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-stone-100 transition-all hover:shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-teal-50 rounded-2xl">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-heading">Role Overview</h2>
                <p className="text-stone-500 mt-1">You'll handle first contact when someone reaches out.</p>
              </div>
            </div>

            <div className="pl-0 sm:pl-16">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">What you'll do</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  "Reply to new enquiries",
                  "Ask a few basic questions",
                  "Explain how South Bound works",
                  "Help them choose a destination",
                  "Point them to the itinerary builder",
                  "Prep for booking call with founder"
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-stone-600 text-sm sm:text-base">
                    <Check className="w-5 h-5 text-teal-500 mr-3 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Earnings */}
          <section className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl p-8 sm:p-10 border border-orange-100 relative overflow-hidden">
            {/* Decorative texture */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-start gap-4 mb-8 relative z-10">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-heading">Earnings</h2>
                <p className="text-stone-600 mt-1">Generous commission structure.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-4">
                <p className="text-stone-700 text-lg font-medium">
                  You earn per client you bring in.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  A typical 90-day trip gives you around <span className="font-semibold text-stone-900">R2,500 – R5,000</span> per client.
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Typical Earnings (Your Cut)</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-stone-600">1 client / mo</span>
                    <span className="font-bold text-stone-900">R2.5k – R5k</span>
                  </li>
                  <li className="flex justify-between items-center text-sm border-t border-dashed border-stone-200 pt-2">
                    <span className="text-stone-600">2–3 clients / mo</span>
                    <span className="font-bold text-stone-900">R5k – R12k</span>
                  </li>
                  <li className="flex justify-between items-center text-sm border-t border-dashed border-stone-200 pt-2">
                    <span className="text-stone-600">4–5 clients / mo</span>
                    <span className="font-bold text-orange-600">R12k – R25k+</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-stone-100">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-stone-100 rounded-2xl">
                <User className="w-6 h-6 text-stone-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-heading">What we're looking for</h2>
                <p className="text-stone-500 mt-1">No formal experience required.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
               {[
                 { text: "Don't mind talking to new people", icon: <Heart className="w-5 h-5 text-rose-400" /> },
                 { text: "Replies quickly without overthinking", icon: <Sparkles className="w-5 h-5 text-yellow-400" /> },
                 { text: "Comfortable guiding simple conversations", icon: <Globe className="w-5 h-5 text-blue-400" /> },
                 { text: "Likes the idea of remote work and travel", icon: <MapPin className="w-5 h-5 text-green-400" /> },
               ].map((item, i) => (
                 <div key={i} className="flex items-center p-4 rounded-xl bg-stone-50 border border-stone-100">
                   <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                     {item.icon}
                   </div>
                   <span className="text-stone-700 font-medium">{item.text}</span>
                 </div>
               ))}
            </div>
          </section>

          <div className="text-center pt-8">
             <p className="text-stone-400 text-sm">
               South Bound &copy; {new Date().getFullYear()}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
