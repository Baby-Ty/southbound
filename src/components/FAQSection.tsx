'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { FAQ } from '@/types/sanity'

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
}

// Sample FAQs for fallback when CMS returns none
const sampleFaqs: FAQ[] = [
  {
    _id: 'faq-what-is-south-bound',
    question: 'What is South Bound?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-what-is-south-bound-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-what-is-south-bound-span',
            text: 'South Bound helps South African remote workers live and work from exciting, affordable destinations around the world. We handle the tricky stuff from finding work-friendly accommodation and co-working spaces to sorting local SIMs, airport transfers, and visa guidance so you can focus on your work and the adventure.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'general',
    order: 1,
    isActive: true
  },
  {
    _id: 'faq-who-is-this-for',
    question: 'Who is this for?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-who-is-this-for-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-who-is-this-for-span',
            text: 'If you have a remote job or freelance clients and want a change of scenery without the hassle of planning, we have you covered. Whether you are new to working abroad or already a seasoned traveller, our trips are designed to keep you productive and make the most of your time away.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'general',
    order: 2,
    isActive: true
  },
  {
    _id: 'faq-how-long-are-trips',
    question: 'How long are the trips?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-how-long-are-trips-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-how-long-are-trips-span',
            text: 'Most of our trips are planned in one month blocks that can be chained together. Many travellers stay on the road with us for three to nine months, moving between destinations at a steady and easy pace.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'travel',
    order: 3,
    isActive: true
  },
  {
    _id: 'faq-travel-with-group',
    question: 'Do I need to travel with a group?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-travel-with-group-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-travel-with-group-span',
            text: 'No. Our trips are designed for individuals. You can meet other travellers along the way if you want to, but there is no set group schedule you have to follow.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'travel',
    order: 4,
    isActive: true
  },
  {
    _id: 'faq-whats-included',
    question: 'What is included in a South Bound trip?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-whats-included-intro',
        children: [
          {
            _type: 'span',
            _key: 'faq-whats-included-intro-span',
            text: 'Every trip includes:',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      },
      {
        _type: 'block',
        _key: 'faq-whats-included-item-1',
        children: [
          { _type: 'span', _key: 'faq-whats-included-item-1-span', text: 'Work-friendly accommodation with private or shared options', marks: [] }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet',
        level: 1
      },
      {
        _type: 'block',
        _key: 'faq-whats-included-item-2',
        children: [
          { _type: 'span', _key: 'faq-whats-included-item-2-span', text: 'Access to a co-working space', marks: [] }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet',
        level: 1
      },
      {
        _type: 'block',
        _key: 'faq-whats-included-item-3',
        children: [
          { _type: 'span', _key: 'faq-whats-included-item-3-span', text: 'Local SIM card or eSIM', marks: [] }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet',
        level: 1
      },
      {
        _type: 'block',
        _key: 'faq-whats-included-item-4',
        children: [
          { _type: 'span', _key: 'faq-whats-included-item-4-span', text: 'Airport pickup', marks: [] }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet',
        level: 1
      },
      {
        _type: 'block',
        _key: 'faq-whats-included-item-5',
        children: [
          { _type: 'span', _key: 'faq-whats-included-item-5-span', text: 'Guidance on visas and entry requirements', marks: [] }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet',
        level: 1
      },
      {
        _type: 'block',
        _key: 'faq-whats-included-item-6',
        children: [
          { _type: 'span', _key: 'faq-whats-included-item-6-span', text: 'Welcome pack with tips for working and living in your new city', marks: [] }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet',
        level: 1
      },
      {
        _type: 'block',
        _key: 'faq-whats-included-item-7',
        children: [
          { _type: 'span', _key: 'faq-whats-included-item-7-span', text: 'Optional cultural and social activities', marks: [] }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet',
        level: 1
      }
    ],
    category: 'general',
    order: 5,
    isActive: true
  },
  {
    _id: 'faq-how-much-does-it-cost',
    question: 'How much does it cost?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-how-much-does-it-cost-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-how-much-does-it-cost-span',
            text: 'Prices vary by destination and duration. We aim to make trips affordable while still offering quality stays and amenities. You will see clear pricing when you browse specific trips.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'payment',
    order: 6,
    isActive: true
  },
  {
    _id: 'faq-bring-partner-family',
    question: 'Can I bring my partner or family?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-bring-partner-family-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-bring-partner-family-span',
            text: 'Yes. In most destinations we can arrange partner or family-friendly accommodation. Just let us know when you enquire.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'general',
    order: 7,
    isActive: true
  },
  {
    _id: 'faq-visa',
    question: 'Do I need a visa?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-visa-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-visa-span',
            text: 'Visa requirements depend on your passport and destination. We will guide you through what you need, where to apply, and how far in advance to do it.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'travel',
    order: 8,
    isActive: true
  },
  {
    _id: 'faq-reliable-internet',
    question: 'Will I have reliable internet?',
    answer: [
      {
        _type: 'block',
        _key: 'faq-reliable-internet-block',
        children: [
          {
            _type: 'span',
            _key: 'faq-reliable-internet-span',
            text: 'Yes. We vet all accommodations and co-working spaces for strong, stable internet so you can work without worry.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'general',
    order: 9,
    isActive: true
  }
]

const FAQSection = ({ faqs, title = "Frequently Asked Questions" }: FAQSectionProps) => {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId)
  }

  // Use sample FAQs if no real FAQs are provided
  const displayFaqs = faqs.length > 0 ? faqs : sampleFaqs

  // Group FAQs by category
  const groupedFaqs = displayFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  const categoryTitles = {
    general: 'General',
    booking: 'Booking',
    travel: 'Travel',
    payment: 'Payment',
    cancellation: 'Cancellation',
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: '#EF7441' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-8 lg:gap-12 xl:gap-16">
          {/* FAQ Content */}
          <div className="flex-1 lg:pr-8 xl:pr-16">
            <h2 className="text-4xl font-bold text-white text-left mb-12 uppercase tracking-wide">
              {title}
            </h2>

            {Object.entries(groupedFaqs).length > 0 ? (
              Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                <div key={category} className="mb-8">
                  <div className="space-y-4">
                    {categoryFaqs.map((faq) => (
                      <div
                        key={faq._id}
                        className="border-b border-white/20"
                      >
                        <button
                          onClick={() => toggleFaq(faq._id)}
                          className="w-full text-left py-6 focus:outline-none group"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium text-white pr-4 uppercase tracking-wide">
                              {faq.question}
                            </h4>
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 text-white">
                                {openFaq === faq._id ? (
                                  // Minus icon
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                ) : (
                                  // Plus icon
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                        
                        {openFaq === faq._id && (
                          <div className="pb-6">
                            <div className="text-white/90 leading-relaxed">
                              <PortableText
                                value={faq.answer}
                                components={{
                                  block: {
                                    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                  },
                                  marks: {
                                    link: ({ children, value }) => (
                                      <a
                                        href={value.href}
                                        className="text-white underline hover:text-white/80"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {children}
                                      </a>
                                    ),
                                  },
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/80 text-center py-8">
                No FAQs available at the moment.
              </div>
            )}
          </div>

          {/* Graphic Section - using faq image - bottom aligned */}
          <div className="hidden lg:flex flex-shrink-0 justify-center items-end">
            <div className="w-[380px] h-[380px] xl:w-[480px] xl:h-[480px]">
              <img 
                src="/images/faq-image.png" 
                alt="FAQ illustration" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection 