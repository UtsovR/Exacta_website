export type PodId = 'conversion' | 'growth' | 'social' | 'creative';

export type Pod = {
  id: PodId;
  title: string;
  outcome: string;
  bullets: string[];
  bestFor: string;
  startingFrom?: string;
  services: string[];
};

export const pods: Pod[] = [
  {
    id: 'conversion',
    title: 'Conversion Studio',
    outcome: 'Ship conversion-grade sites, landing pages, and funnels.',
    bullets: ['CRO-first UX', 'High-speed builds', 'Launch-ready assets'],
    bestFor: 'Teams needing uplift fast',
    startingFrom: '₹1,20,000',
    services: ['Websites', 'Landing Pages', 'Funnels', 'Conversion Rate Optimization']
  },
  {
    id: 'growth',
    title: 'Growth Engine',
    outcome: 'Paid media that compounds ROAS and lead velocity.',
    bullets: ['Full-funnel ads', 'ROAS tracking', 'Iterate weekly'],
    bestFor: 'ROAS-focused performance',
    startingFrom: '₹90,000',
    services: ['Google Ads', 'Meta Ads', 'Lead Gen Campaigns', 'Spend Optimization']
  },
  {
    id: 'social',
    title: 'Social Momentum',
    outcome: 'Social systems that build brand heat and steady engagement.',
    bullets: ['Content sprints', 'Community care', 'Reporting that guides'],
    bestFor: 'Brands growing share-of-voice',
    startingFrom: '₹70,000',
    services: ['Content Plan', 'Publishing & QA', 'Community Management', 'Insights & Reporting']
  },
  {
    id: 'creative',
    title: 'Creative Lab',
    outcome: 'On-demand creative that stays on-brand and ready to test.',
    bullets: ['Ad creative kits', 'Brand visuals', 'Test-ready variants'],
    bestFor: 'Teams needing fresh creative fuel',
    startingFrom: '₹65,000',
    services: ['Ad Creatives', 'Posters & Social', 'Branding Visuals', 'UI Assets']
  }
];
