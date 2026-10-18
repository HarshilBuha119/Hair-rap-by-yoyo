// The salon's service menu, transcribed from the public price pages on hairrapbyyoyo.com.
// Prices are exactly as published. Durations are NOT published, so they are estimates used for slot planning.

export type Gender = 'women' | 'men' | 'both';
export type CategoryId = 'hair' | 'colour' | 'treatments' | 'skin' | 'body' | 'nails' | 'rituals';

export type Pricing =
  | { kind: 'flat'; price: number }
  /** One price per option, e.g. hair length or Manual / With Hydra. `null` = not offered. */
  | { kind: 'choice'; labels: string[]; prices: (number | null)[] }
  /** One price per stylist level (see LEVELS). `null` = not offered at that level. */
  | { kind: 'tier'; prices: (number | null)[] };

export type Service = {
  id: string;
  name: string;
  gender: Gender;
  category: CategoryId;
  group: string;
  pricing: Pricing;
  durationMin: number;
  photo: string;
  blurb?: string;
};

export const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'hair', label: 'Hair', icon: 'content-cut' },
  { id: 'colour', label: 'Colour', icon: 'palette-outline' },
  { id: 'treatments', label: 'Treatments', icon: 'water-outline' },
  { id: 'skin', label: 'Skin', icon: 'face-woman-shimmer-outline' },
  { id: 'body', label: 'Body', icon: 'spa-outline' },
  { id: 'nails', label: 'Nails', icon: 'hand-heart-outline' },
  { id: 'rituals', label: 'Hand & foot', icon: 'flower-tulip-outline' },
];

/** Stylist levels. The salon prices cuts and beard services by level. Index = position in a tier price list. */
export const LEVELS = [
  { id: 'stylist', name: 'Stylist', role: 'Skilled team member' },
  { id: 'senior', name: 'Senior Stylist', role: 'Years of experience' },
  { id: 'top', name: 'Top Stylist', role: 'Senior artist' },
  { id: 'cd', name: 'Yoyo', role: 'Creative Director' },
] as const;
export type LevelId = (typeof LEVELS)[number]['id'];
export const levelIndex = (id: string) => Math.max(0, LEVELS.findIndex((l) => l.id === id));
export const levelLabel = (id: string) => {
  const l = LEVELS.find((x) => x.id === id) ?? LEVELS[0];
  return l.id === 'cd' ? 'Yoyo · Creative Director' : l.name;
};

const LEN = ['Shoulder length', 'Mid back length', 'Waist length'];
const METHOD = ['Manual', 'With Hydra'];
const WAX = ['Trimming', 'Waxing'];

// ---------- builders ----------
const flat = (price: number): Pricing => ({ kind: 'flat', price });
const len = (a: number | null, b: number | null, c: number | null): Pricing => ({ kind: 'choice', labels: LEN, prices: [a, b, c] });
const method = (manual: number, hydra: number): Pricing => ({ kind: 'choice', labels: METHOD, prices: [manual, hydra] });
const choice = (labels: string[], ...prices: (number | null)[]): Pricing => ({ kind: 'choice', labels, prices });
const tier = (...prices: (number | null)[]): Pricing => ({ kind: 'tier', prices });

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const SERVICES: Service[] = [];
type Base = { gender: Gender; category: CategoryId; group: string; photo: string; durationMin: number };
const group = (base: Base, rows: [name: string, pricing: Pricing, durationMin?: number, blurb?: string][]) => {
  for (const [name, pricing, durationMin, blurb] of rows) {
    SERVICES.push({
      id: `${base.gender}-${slug(base.group)}-${slug(name)}`,
      name,
      pricing,
      durationMin: durationMin ?? base.durationMin,
      blurb,
      gender: base.gender,
      category: base.category,
      group: base.group,
      photo: base.photo,
    });
  }
};

// ================= WOMEN =================
group({ gender: 'women', category: 'hair', group: 'Hair Cut', photo: 'cut-bob', durationMin: 60 }, [
  ['Hair Cut & Blow Dry', tier(1300, 1900, 2500, 12500), 60],
  ['Royal Hair Cut', tier(2500, 3000, 3500, 14000), 90],
  ['Kids Cut (under 10 years)', tier(1100, 1600, 2200, 12500), 45],
]);
group({ gender: 'women', category: 'hair', group: 'Hair Styling', photo: 'style-wash', durationMin: 45 }, [
  ['Hair Wash & Blast Dry', len(750, 850, 1050), 30],
  ['Hair Wash & Blow Dry', len(1150, 1250, 1450), 45],
  ['Ultimate Blow Dry', len(800, 900, 1000), 45],
  ['Elegant Hair Wash (pH, Biotop)', len(950, 1150, 1450), 45],
  ['Elegant Hair Wash & Blow Dry', len(1350, 1550, 1750), 60],
  ['Iron / Crimp Finish', len(1350, 1550, 1750), 60],
  ['Iron / Roller Finish', len(1400, 1600, 1800), 60],
]);

group({ gender: 'women', category: 'colour', group: 'Hair Colour', photo: 'colour-foils', durationMin: 150 }, [
  ['Colour Refresh / Toning', len(7000, 8500, 10000), 90],
  ['Global Colour (With Ammonia)', len(8000, 11000, 14000), 150],
  ['Global Colour (Without Ammonia)', len(9000, 12000, 15000), 150],
  ['Crown Highlights (With Pre-Light)', len(10500, 12500, 14500), 180],
  ['Full Head Highlights (With Pre-Light)', len(14000, 18000, 22000), 240],
  ['Full Head Highlights (Without Pre-Light)', len(13500, 16500, 19500), 240],
]);
group({ gender: 'women', category: 'colour', group: 'Luxury Colour', photo: 'colour-foils', durationMin: 180 }, [
  ['Root Touch Up (With Ammonia)', flat(2000), 75, 'Add ₹800 if styling'],
  ['Root Touch Up (Without Ammonia)', flat(2500), 75, 'Add ₹800 if styling'],
  // The site shows ₹2,500 for shoulder length here, which looks like a typo, so it is left as "on consultation".
  ['Global Colour (With Ammonia)', len(null, 12000, 14000), 150],
  ['Global Colour (Without Ammonia)', len(11000, 14000, 17000), 150],
  ['Full Head Highlights (With Pre-Light)', len(17500, 19500, 22500), 240],
  ['Full Head Highlights (Without Pre-Light)', len(19500, 22500, 25500), 240],
  ['Crown Highlights (With Pre-Light)', len(11500, 13500, 15500), 180],
  ['Colour Refresh / Toning', len(8500, 9500, 11000), 90],
]);

group({ gender: 'women', category: 'treatments', group: 'Hair Texture', photo: 'treat-iron', durationMin: 180 }, [
  ['Smoothing / Straightening / Rebonding', len(10500, 13500, 17500), 180],
  ['Premium Keratin Treatment', len(11500, 14500, 17500), 180],
  ['Botox Treatment', len(12500, 15500, 18500), 150],
  ['Smoothing / Keratin (Fringe)', flat(4000), 60],
  ['Add-on: Extra Long / Volume / Thickness', flat(2500), 30],
]);
group({ gender: 'women', category: 'treatments', group: 'Hair Treatment', photo: 'treat-wash', durationMin: 60 }, [
  ['Express Hair Spa', len(2000, 2500, 3000), 45],
  ['700 Keratin Oil Treatment', len(3500, 4000, 4500), 60],
  ['911 Repair Treatment', len(4000, 4500, 5000), 60],
  ['Anti Dandruff Treatment', len(2500, 2500, 3500), 60],
  ['Anti Hair Fall Treatment', len(2500, 2500, 3500), 60],
  ['Hair Retention Treatment', len(3500, 3500, 4500), 60],
  ['Olaplex Treatment', len(3500, 3500, 4500), 60],
  ['pH Hair Rituals', len(5500, 5500, 6500), 75],
]);

group({ gender: 'women', category: 'skin', group: 'Ethereal Facial', photo: 'facial-mask', durationMin: 60 }, [
  ['Express Facial', method(3000, 5000), 45],
  ['Purifying Facial', method(3200, 5200)],
  ['Hydrating Facial', method(3500, 5500)],
  ['Brighten Up Your Skin', method(4500, 6500)],
  ['Anti-Ageing Facial', method(5500, 7500), 75],
]);
group({ gender: 'women', category: 'skin', group: 'Elegant Facial', photo: 'facial-brush', durationMin: 75 }, [
  ['Aquatherm Advance Facial (Hydra Facial)', method(6000, 8000)],
  ['Collagen Advance Facial', method(6800, 8800)],
  ['Clarifying Advance Facial', method(7800, 9800)],
  ['Power C+ Proglam Facial', method(8500, 10500), 90],
  ['Power Retinol Facial', method(8500, 10500), 90],
  ['Power Hyaluronic Facial', method(8500, 10500), 90],
  ['Skin Corrective Facial', method(9000, 11000), 90],
  ['Dynamic Recovery Facial', method(10000, 12000), 90],
  ['Organic Facial', method(12000, 14000), 90],
]);
group({ gender: 'women', category: 'skin', group: 'Clean Up', photo: 'facial-mask', durationMin: 45 }, [
  ['Eye Therapy', method(1500, 2000), 30],
  ['Lip Treatment', method(1500, 2000), 30],
  ['Radiant Clean Up', method(2000, 3000)],
  ['Whitening Clean Up', method(2500, 3500)],
  ['Purifying Clean Up', method(2500, 3500)],
  ['Pre Cleanser Clean Up', method(3000, 4000)],
]);
group({ gender: 'women', category: 'skin', group: 'Express Facial Mask', photo: 'detan', durationMin: 20 }, [
  ['Quick Glow Mask', flat(1300)],
  ['Sensitive Mask', flat(2000)],
  ['Cooling Mask', flat(2200)],
  ['Skin Tightening Mask', flat(2400)],
]);
group({ gender: 'women', category: 'skin', group: 'Threading', photo: 'removal', durationMin: 10 }, [
  ['Eyebrow', flat(100)], ['Upper Lips', flat(80)], ['Forehead', flat(80)], ['Chin', flat(80)], ['Side Block', flat(100)], ['Full Face', flat(450), 25],
]);
group({ gender: 'women', category: 'skin', group: 'Waxing', photo: 'removal', durationMin: 20 }, [
  ['Eyebrow', flat(250), 10], ['Upper Lips', flat(200), 10], ['Forehead', flat(250), 10], ['Side Block', flat(250), 10], ['Jawline', flat(200), 10],
  ['Full Face', flat(800), 30], ['Underarms', flat(300), 15], ['Full Hand', flat(750), 30], ['Full Front', flat(900), 40], ['Full Back', flat(900), 40],
  ['Half Legs', flat(750), 30], ['Full Legs', flat(1300), 45], ['Bikini', flat(2500), 30], ['Full Body', flat(6500), 120],
]);
group({ gender: 'women', category: 'skin', group: 'Brazilian Wax', photo: 'removal', durationMin: 15 }, [
  ['Eyebrow', flat(250), 10], ['Upper Lips', flat(200), 10], ['Nose', flat(300), 10], ['Jawline', flat(200), 10], ['Forehead', flat(250), 10],
  ['Side Block', flat(250), 10], ['Full Face', flat(800), 30], ['Underarms', flat(400), 15], ['Bikini', flat(3500), 40],
]);

group({ gender: 'women', category: 'body', group: 'Body Therapy', photo: 'body', durationMin: 60 }, [
  ['Back Massage', flat(2500), 45],
  ['Body Massage', flat(5000), 75],
  ['Back Polishing', flat(4000), 45],
  ['Body Polishing', flat(8000), 90],
  ['Hans Spa Therapy', flat(4500), 60],
]);

group({ gender: 'women', category: 'nails', group: 'Nail Extensions & Art', photo: 'nails-pink', durationMin: 60 }, [
  ['Gel Paint on Natural Nails', flat(1000), 45],
  ['Regular Nail Paint', flat(500), 30],
  ['Temporary Nail Extensions', flat(2000), 75],
  ['Acrylic Nail Extension', flat(3500), 120],
  ['Gel Nail Extension', flat(3700), 120],
  ['Removal: Natural Nails', flat(350), 20],
  ['Removal: Temporary Extension', flat(500), 20],
  ['Removal: Acrylic Extension', flat(700), 30],
]);
group({ gender: 'women', category: 'nails', group: 'Nail Art (per finger)', photo: 'nails-tech', durationMin: 10 }, [
  ['3D / 4D Nail Art', choice(['Classic', 'Creative'], 450, 600)],
  ['Ombre', choice(['Dual colours', 'Trio colours', 'Multi colours'], 350, 450, 550)],
  ['Metallic Chrome', choice(['Half finger', 'Full finger', 'Ombre full finger'], 350, 400, 450)],
  ['Marble', choice(['Basic', 'Classic', 'Creative', 'Advance'], 150, 180, 210, 240)],
  ['Glitter', choice(['Glitter', 'With milers'], 150, 200)],
  ['Cat Eye', flat(400)],
  ['French / Foil / Sticker / Water Decal', flat(80)],
]);

// ================= MEN =================
group({ gender: 'men', category: 'hair', group: 'Hair Cut', photo: 'men-cut', durationMin: 45 }, [
  ['Hair Cut', tier(1000, 1600, 2500, 12500), 45, 'Includes hair wash, haircut and styling'],
  ['Royal Hair Cut', tier(2500, 3000, 3500, 14000), 75, 'Includes hair wash, head relaxation therapy, haircut and styling'],
  ['Kids Hair Cut (under 10 years)', tier(1000, 1600, 2500, 12500), 30],
]);
group({ gender: 'men', category: 'hair', group: 'Beard', photo: 'men-beard', durationMin: 30 }, [
  ['Beard Trimming', tier(600, 800, 1000, 5000)],
  ['Clean Shave', tier(600, 800, 1000, null)],
  ['Styling Beard', tier(600, 800, 1000, 5000)],
  ['Royal Shave', tier(3000, 3000, 3000, null), 60, 'Includes skin relaxation therapy and shave'],
]);
group({ gender: 'men', category: 'hair', group: 'Extra Care', photo: 'men-cut', durationMin: 20 }, [
  ['Men’s Hair Styling (with Yoyo)', flat(6000), 45],
  ['Men’s Hair Styling', flat(800), 30],
  ['Hair Wash', flat(400), 15],
  ['Elegant Hair Wash', flat(650), 25],
]);
group({ gender: 'men', category: 'colour', group: 'Hair Colour', photo: 'men-colour', durationMin: 60 }, [
  ['Moustache', flat(500), 20],
  ['Side Locks', flat(1000), 30],
  ['Global Colour (With Ammonia)', flat(2000), 90],
  ['Global Colour (Without Ammonia)', flat(2500), 90],
  ['Beard Colour (With Ammonia)', flat(1000), 45],
  ['Beard Colour (Without Ammonia)', flat(1400), 45],
  ['Partial Highlights (6 foils)', flat(7000), 150],
  ['Full Head Highlights', flat(9000), 180],
]);
group({ gender: 'men', category: 'treatments', group: 'Hair Texture', photo: 'treat-iron', durationMin: 150 }, [
  ['Premium Keratin Treatment', flat(7500), 150],
  ['Botox Treatment', flat(7500), 150],
  ['Smoothening / Keratin (Fringe)', flat(7500), 90],
  ['Add-on: Extra Long / Volume / Thickness', flat(2500), 30],
  ['Perming', flat(9000), 180],
]);
group({ gender: 'men', category: 'skin', group: 'Hair Removal', photo: 'men-facial', durationMin: 20 }, [
  ['Ear', choice(WAX, null, 350), 10],
  ['Nose', choice(WAX, null, 350), 10],
  ['Full Face', choice(WAX, null, 800), 30],
  ['Underarms', choice(WAX, 350, 550), 15],
  ['Half Legs', choice(WAX, 650, 1150), 30],
  ['Full Hand', choice(WAX, 850, 1250), 30],
  ['Full Front', choice(WAX, 1200, 1500), 40],
  ['Full Back', choice(WAX, 1200, 1500), 40],
  ['Full Leg', choice(WAX, 1200, 2000), 45],
  ['Full Body', flat(5000), 120],
]);

// ================= BOTH =================
group({ gender: 'both', category: 'hair', group: 'Head Massage', photo: 'massage', durationMin: 30 }, [
  ['Virgin Oil Head Massage (without wash)', flat(1500)],
  ['Organic Oil Head Massage (without wash)', flat(2000)],
]);
const bothSkin = (g: 'Ethereal Facial' | 'Elegant Facial' | 'Clean Up' | 'Express Facial Mask') => {
  const src = SERVICES.filter((s) => s.gender === 'women' && s.group === g);
  for (const s of src) SERVICES.push({ ...s, gender: 'men', id: s.id.replace(/^women-/, 'men-') });
};
bothSkin('Ethereal Facial');
bothSkin('Elegant Facial');
bothSkin('Clean Up');
bothSkin('Express Facial Mask');
group({ gender: 'both', category: 'skin', group: 'De-Tan', photo: 'detan', durationMin: 30 }, [
  ['Foot or Palm De-tan', flat(700), 20],
  ['Face & Neck De-tan', flat(1200), 30],
  ['Full Hands De-tan', flat(1800), 40],
  ['Half Leg De-tan', flat(1800), 40],
  ['Full Leg De-tan', flat(2500), 60],
  ['Full Back De-tan', flat(1500), 40],
  ['Full Front De-tan', flat(1500), 40],
  ['Full Body De-tan', flat(8000), 120],
]);
group({ gender: 'both', category: 'rituals', group: 'Pedicure', photo: 'pedicure', durationMin: 60 }, [
  ['Signature Pedicure', flat(1800)],
  ['Tropical Signature Pedicure', flat(2000)],
  ['Exotic Pedicure', flat(2300)],
  ['American Pedicure', flat(2500)],
  ['Cocktail Pedicure', flat(4000), 75],
  ['Orchid Pedicure', flat(3500), 75],
  ['Sunkiist Pedicure', flat(3000), 75],
  ['Hydra Pedicure', flat(3000), 75],
  ['Foot Reflexology', flat(1800), 45],
]);
group({ gender: 'both', category: 'rituals', group: 'Manicure', photo: 'footbath', durationMin: 45 }, [
  ['Nail Cut & File', flat(250), 15],
  ['Signature Manicure', flat(1600)],
  ['Tropical Paradise Manicure', flat(1800)],
  ['Exotic Manicure', flat(1700)],
  ['American Manicure', flat(2300)],
  ['Cocktail Manicure', flat(3800), 60],
  ['Orchid Manicure', flat(3300), 60],
  ['Sunkiist Manicure', flat(2800), 60],
  ['Hydra Manicure', flat(2800), 60],
  ['Hand Reflexology', flat(1600), 40],
]);

// Give a few services their own photo so signature cards and lists are not repetitive.
const PHOTO_OVERRIDE: Record<string, string> = {
  'women-hair-cut-royal-hair-cut': 'cut-bob2',
  'women-hair-cut-kids-cut-under-10-years': 'kids',
  'men-hair-cut-kids-hair-cut-under-10-years': 'kids',
  'men-hair-cut-royal-hair-cut': 'lounge-barber',
  'women-hair-treatment-olaplex-treatment': 'treat-iron',
  'women-hair-treatment-express-hair-spa': 'treat-wash',
  'men-beard-royal-shave': 'men-beard',
  'men-hair-cut-hair-cut': 'men-cut',
};
for (const s of SERVICES) if (PHOTO_OVERRIDE[s.id]) s.photo = PHOTO_OVERRIDE[s.id];

/** Group-level notes taken from the site. */
export const GROUP_NOTES: Record<string, string> = {
  'Hair Styling': 'Extra length: add ₹350',
  'Hair Cut': 'Extra length: add ₹500. Price depends on stylist level.',
  Beard: 'Price depends on stylist level.',
  'Hair Colour': 'Final price depends on consultation, hair type and requirement.',
  'Luxury Colour': 'Final price depends on consultation, hair type and requirement.',
  'Hair Texture': 'Final price depends on consultation, hair length and density.',
  'Nail Art (per finger)': 'Priced per finger.',
};

// ---------- helpers ----------
export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);

/** Price for a service given the chosen option and stylist level. `null` = not offered. */
export function priceOf(s: Service, choiceIdx: number, level: number): number | null {
  switch (s.pricing.kind) {
    case 'flat':
      return s.pricing.price;
    case 'choice':
      return s.pricing.prices[choiceIdx] ?? null;
    case 'tier':
      return s.pricing.prices[level] ?? null;
  }
}

/** Lowest listed price, used for "from ₹x". */
export function startingPrice(s: Service): number {
  if (s.pricing.kind === 'flat') return s.pricing.price;
  const vals = s.pricing.prices.filter((p): p is number => p != null);
  return Math.min(...vals);
}

export const hasChoice = (s: Service) => s.pricing.kind === 'choice';
export const optionLabel = (s: Service, choiceIdx: number) => (s.pricing.kind === 'choice' ? s.pricing.labels[choiceIdx] : undefined);

/** First option that is actually offered, so default selections are never "not offered". */
export const firstOffered = (s: Service) => (s.pricing.kind === 'choice' ? Math.max(0, s.pricing.prices.findIndex((p) => p != null)) : 0);

export const SIGNATURE_IDS = [
  'women-hair-cut-hair-cut-blow-dry',
  'women-hair-cut-royal-hair-cut',
  'women-luxury-colour-global-colour-without-ammonia',
  'women-hair-treatment-olaplex-treatment',
  'men-hair-cut-hair-cut',
  'men-beard-royal-shave',
  'women-elegant-facial-aquatherm-advance-facial-hydra-facial',
];

export const MEMBERSHIPS = [
  { id: 'bella', name: 'Bella', price: '₹50k – 70k', users: '4 users', type: 'HNI Family Membership' },
  { id: 'estilo', name: 'Estilo', price: '₹1L – 1.5L', users: '4 users', type: 'HNI Family Membership' },
  { id: 'cabeza', name: 'Cabeza', price: '₹2L – 2.5L', users: '4 users', type: 'HNI Family Membership' },
  { id: 'dios', name: 'Dios', price: '₹3L – 3.5L', users: '8 users', type: 'HNI Dual Family Membership' },
  { id: 'aqua', name: 'Aqua', price: '₹5L – 6L', users: '16 users', type: 'HNI Group Membership' },
  { id: 'elegante', name: 'Elegante', price: '₹10L – 12L', users: '25 users', type: 'Corporate Membership' },
] as const;

export const ACADEMY_COURSES = [
  { id: 'barbering', title: 'Barbering', photo: 'academy-class' },
  { id: 'beginners', title: 'Beginners', photo: 'academy-instructor' },
  { id: 'creative', title: 'Creative', photo: 'academy-team' },
  { id: 'cut-colour', title: 'Cut & Colour', photo: 'academy-seated' },
  { id: 'look-learn', title: 'Look & Learn', photo: 'lounge-styling' },
  { id: 'specialist', title: 'Specialist', photo: 'academy-instructor' },
] as const;

export const TEAM = [
  { id: 'yoyo', name: 'Yoyo', role: 'Founder & Creative Director', photo: 'team-yoyo', bio: 'The face of the brand and its creative force, leading a team of artists to raise the standard of salon services in India.' },
  { id: 'anuj', name: 'Anuj', role: 'Co-founder', photo: 'team-anuj', bio: 'The backbone of Hair Rap by Yoyo and a steady supporter of the brand’s dreams.' },
  { id: 'garima', name: 'Garima', role: 'Co-founder & Creative Director', photo: 'team-garima', bio: 'A young artist and educator, passionate about hair and the salon industry.' },
  { id: 'sugar', name: 'Sugar', role: 'Chief Entertainment Officer', photo: 'team-sugar', bio: 'Irresponsibly responsible for unforgettable, cuteness-overloaded entertainment.' },
] as const;
