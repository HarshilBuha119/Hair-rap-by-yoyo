import { Alert, Linking } from 'react-native';

import { SALON } from '@/constants/brand';

async function open(url: string, failMessage: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open', failMessage);
  }
}

export const callSalon = () => open(`tel:${SALON.phone}`, `Please dial ${SALON.phoneDisplay}.`);

export const whatsapp = (message: string) =>
  open(
    `https://wa.me/${SALON.phone.replace('+', '')}?text=${encodeURIComponent(message)}`,
    'WhatsApp is not installed on this device.',
  );

export const directions = () => open(SALON.mapsUrl, 'Could not open maps.');
