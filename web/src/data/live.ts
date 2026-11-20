/**
 * Everything on the Live page is driven from this file.
 * TODO before shipping: replace the placeholder handle, QR and payment link.
 * All amounts are in Peruvian soles (PEN).
 */

export type SupporterTier = 'founder' | 'builder' | 'supporter'

export interface LiveSession {
  name: string
  handle: string
  avatar: string
}

export interface Supporter {
  name: string
  handle?: string
  tier: SupporterTier
  since: string
  avatar?: string
  /** Marks the row added after the current mock session donates. */
  you?: boolean
}

export interface PaymentConfig {
  /** Static QR from your payment provider. Takes priority over qrValue. */
  qrImage?: string
  /**
   * Payload used to generate a QR when there is no image.
   * Supports {amount} and {code}. Use it for provider checkout links.
   */
  qrValue?: string
  /** Optional direct link to the provider checkout. */
  href?: string
  /** Set while the bundled QR is still a placeholder. */
  placeholder?: boolean
}

export const liveStatus = {
  platform: 'TikTok',
  profileUrl: 'https://www.tiktok.com/@heaveless',
}

export const donationPresets = [5, 10, 20, 50]

/**
 * The provider is responsible for the payment method (Yape, Plin, card).
 * This page only shows one QR, so no method selector is needed.
 */
export const payment: PaymentConfig = {
  // MOCK: generated from a fake checkout link so the QR looks real.
  // Replace with your provider QR image (qrImage) or checkout link (qrValue).
  qrValue: 'https://pay.heaveless.com/checkout?amount={amount}&ref={code}',
}

export const loginCopy = {
  eyebrow: 'Support',
  title: 'Keep this alive.',
  body: 'Pick an amount in soles.',
  bodySecondary: 'Scan the QR. Keep the stream alive.',
  note: 'Secure login. No posting.',
  authError: 'TikTok login failed. Try again.',
  authMissing: 'TikTok login is not configured yet.',
}

/** Add confirmed supporters here if you want them visible before logging in. */
export const supporters: Supporter[] = []
