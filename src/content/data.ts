import { LucideIcon } from 'lucide-react';

export type Service = {
  title: string;
  desc: string;
  icon: LucideIcon;
};

export type Platform = {
  name: string;
  icon: LucideIcon;
};

export type WorkTile = {
  title: string;
  category: string;
  metric: string;
  summary: string;
  image: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

import {
  MonitorSmartphone,
  Sparkles,
  Target,
  PenTool,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MousePointerClick
} from 'lucide-react';

export const heroCopy = {
  headline: 'Digital Marketing That Turns Attention Into Action',
  sub: 'Ads, Social, Design & Websites engineered to convert.',
  trust: ['Conversion-first', 'Performance-led', 'Creative-driven']
};

export const services: Service[] = [
  {
    title: 'Conversion-Focused Websites',
    desc: 'Design + build tuned for speed and sales.',
    icon: MonitorSmartphone
  },
  {
    title: 'Lead Generation Ads',
    desc: 'Acquisition engines that stay efficient.',
    icon: Target
  },
  {
    title: 'Social Media Management',
    desc: 'Strategic social that actually delivers.',
    icon: Sparkles
  },
  {
    title: 'Creative & Branding Design',
    desc: 'Visual systems that feel premium.',
    icon: PenTool
  }
];

export const platforms: Platform[] = [
  { name: 'Google Ads', icon: Globe },
  { name: 'Meta Ads', icon: MousePointerClick },
  { name: 'Instagram', icon: Instagram },
  { name: 'Facebook', icon: Facebook },
  { name: 'YouTube', icon: Youtube },
  { name: 'LinkedIn', icon: Linkedin }
];

export const workTiles: WorkTile[] = [
  {
    title: 'Fintech Funnel Revamp',
    category: 'Web + Paid',
    metric: '+120% leads',
    summary: 'Rebuilt landing architecture, launched multi-variant ads, lifted CVR.',
    image: '/work-placeholder-1.svg'
  },
  {
    title: 'DTC Launch Sprint',
    category: 'Social + Creative',
    metric: '+3.1x ROAS',
    summary: 'Creative system + iterative ads across Meta & IG with daily insights.',
    image: '/work-placeholder-2.svg'
  },
  {
    title: 'B2B Pipeline Engine',
    category: 'ABM + Ads',
    metric: '+78% SQLs',
    summary: 'Account-based plays with laser retargeting and intent-driven content.',
    image: '/work-placeholder-3.svg'
  }
];

export const testimonials: Testimonial[] = [
  {
    name: 'Anika Das',
    role: 'CMO, ScaleUp Labs',
    quote: 'Exacta rebuilt our paid engine—qualified pipeline doubled in 6 weeks.',
    rating: 5
  },
  {
    name: 'Marcus Lee',
    role: 'Founder, Northwave',
    quote: 'Sharp creative + ruthless experimentation. CAC down, revenue up.',
    rating: 4.8
  },
  {
    name: 'Sophia Turner',
    role: 'Marketing Lead, NovaGrid',
    quote: 'Clean, luxurious web experience and performance tracking that sticks.',
    rating: 4.9
  },
  {
    name: 'Yusuf Khan',
    role: 'CEO, CraftWorks',
    quote: 'They ship fast, listen, and keep results transparent.',
    rating: 5
  }
];

export const feedbackChips = ['Fast delivery', 'Premium design', 'Leads improved', 'Love the glow', 'Need case studies'];

export const ctaCopy = {
  headline: 'Ready to grow faster?',
  sub: 'Get a free strategy call and a conversion roadmap.'
};

export const CONTACT_EMAIL = 'support@exactaweb.com';

export const contactDetails = {
  address: '4/36A, Chanditala Lane, Tollygunge, Kolkata, West Bengal',
  phone: 'Phone:',
  email: 'Email:'
};
