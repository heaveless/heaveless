
export type SupporterTier = 'founder' | 'builder' | 'supporter'

export interface Supporter {
  name: string
  handle?: string
  tier: SupporterTier
  since: string
  avatar?: string
  you?: boolean
}

export interface PaymentConfig {
  qrImage?: string
  qrValue?: string
  href?: string
  placeholder?: boolean
}

export const liveStatus = {
  platform: 'TikTok',
  profileUrl: 'https://www.tiktok.com/@heaveless',
}

export const donationPresets = [5, 10, 20, 50]

export const payment: PaymentConfig = {
  qrValue: 'https://pay.heaveless.com/checkout?amount={amount}&ref={code}',
}

export const loginCopy = {
  eyebrow: 'Support',
  title: 'Keep this alive.',
  body: 'Pick an amount in soles.',
  bodySecondary: 'Scan the QR. Keep the stream alive.',
  note: 'Secure login. No posting.',
  authError: 'TikTok login failed. Try again.',
}

export const supporters: Supporter[] = []
