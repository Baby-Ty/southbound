import React from 'react';
import { Metadata } from 'next';
import { client, queries } from '@/lib/sanity';
import { FAQ } from '@/types/sanity';
import ContactPageClient from '@/components/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us - South Bound',
  description: 'Get in touch with the South Bound team. We&apos;re here to help plan your next adventure.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

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
            text: 'Every trip includes work-friendly accommodation, access to co-working spaces, local SIM card, airport pickup, visa guidance, welcome pack with local tips, and optional cultural activities.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    category: 'general',
    order: 4,
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
    order: 5,
    isActive: true
  }
];

// This function runs at build time for static generation
async function getFaqs(): Promise<FAQ[]> {
  try {
    const faqs = await client.fetch(queries.allFaqs);
    return faqs.length > 0 ? faqs : sampleFaqs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return sampleFaqs;
  }
}

export default async function ContactPage() {
  const faqs = await getFaqs();

  return <ContactPageClient initialFaqs={faqs} />;
}