import type { ImageSourcePropType } from 'react-native';

import type { Service } from '@/data/menu';
import { PRODUCT_IMAGES } from '@/data/product-images';
import { BRAND_TILES, PHOTO } from '@/data/site-images';

export { LOGO_MARK, PHOTO, WORDMARK } from '@/data/site-images';

/** Look up one of the salon's photos by key, falling back to the reception shot. */
export const photo = (key: string): ImageSourcePropType => (PHOTO as Record<string, ImageSourcePropType>)[key] ?? PHOTO['lounge-reception'];

export const serviceImage = (s: Service) => photo(s.photo);

export const productImage = (id: number): ImageSourcePropType | undefined => PRODUCT_IMAGES[id];

/** Brand logo tiles (white on black) used by the shop's brand filter. */
export const BRAND_TILE: Record<string, ImageSourcePropType> = {
  pH: BRAND_TILES.ph,
  GK: BRAND_TILES.gk,
  Biotop: BRAND_TILES.biotop,
  Schwarzkopf: BRAND_TILES.schwarzkopf,
  'OSiS+': BRAND_TILES.osis,
  Olaplex: BRAND_TILES.olaplex,
  milk_shake: BRAND_TILES.milkshake,
};

/** Interior shots for the "Inside the lounge" gallery. */
export const LOUNGE = [
  { key: 'lounge-reception', caption: 'Reception' },
  { key: 'lounge-arch', caption: 'The arch' },
  { key: 'lounge-mirror', caption: 'Gold mirrors' },
  { key: 'lounge-styling', caption: 'On the floor' },
  { key: 'lounge-barber', caption: 'Barbering' },
  { key: 'lounge-hair', caption: 'Colour & length' },
] as const;
