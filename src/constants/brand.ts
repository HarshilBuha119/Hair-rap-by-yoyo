// Palette inspired by the brand's black, white and gold look. Swap for the official guidelines when received.
export const C = {
  ink: '#0B0B0D',
  inkSoft: '#1A1A1F',
  ivory: '#F7F3EC',
  paper: '#FFFFFF',
  sand: '#EDE6DA',
  line: '#E4DCCD',
  gold: '#B98B47',
  goldSoft: '#E9D8B7',
  text: '#17171A',
  muted: '#6B665E',
  danger: '#B3372F',
  success: '#2F7D5B',
} as const;

export const F = {
  serif: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
} as const;

export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const R = { sm: 10, md: 16, lg: 24, pill: 999 } as const;

export const SALON = {
  name: 'Hair Rap by Yoyo',
  tagline: "It's not just a hair.\nIt's a state of mind.",
  phone: '+919099938886',
  phoneDisplay: '+91 90999 38886',
  email: 'hello@hairrapbyyoyo.com',
  address:
    '1st Floor, Shilp Satved, Sindhubhavan Marg, Opposite Mango Restaurant, Above HDFC Bank, PRL Colony, Bodakdev, Ahmedabad 380054',
  hours: 'Open daily · 10:00 AM – 9:00 PM',
  openMin: 10 * 60,
  closeMin: 21 * 60,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Hair+Rap+by+Yoyo+Bodakdev+Ahmedabad',
} as const;

/** Figures the brand publishes on its About page. */
export const STATS = [
  { value: '45,000+', label: 'services delivered' },
  { value: '9,000+', label: 'clients' },
  { value: '75+', label: 'professionals' },
] as const;
