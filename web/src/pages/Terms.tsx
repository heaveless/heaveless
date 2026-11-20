import { LegalList, LegalPage, LegalSection } from '../components/legal/LegalPage'

const link = 'text-ink underline decoration-line underline-offset-4 transition-colors hover:text-coral'
const email = <a className={link} href="mailto:hi@heaveless.com">hi@heaveless.com</a>

export function TermsPage() {
  return (
    <LegalPage
      route="/terms"
      title="Terms of Service"
      updated="November 20, 2026"
      intro="These terms govern your use of heaveless.com, the Live page and any donation made through it. By using the site you agree to them. If you do not agree, please do not use the site."
    >
      <LegalSection number="01" title="Who we are">
        <p>heaveless is a personal website and live stream operated by an independent creator. You can reach the operator at {email}.</p>
      </LegalSection>

      <LegalSection number="02" title="Using the site">
        <p>You may browse the site, watch the stream and share links to it. You are responsible for your activity and for keeping your TikTok account secure.</p>
        <LegalList items={[
          'Do not attempt to access restricted areas, interfere with the site or scrape it at scale.',
          'Do not use the site for unlawful purposes or to harass, impersonate or harm others.',
          'Do not try to bypass the login, payment or security controls.',
        ]} />
      </LegalSection>

      <LegalSection number="03" title="TikTok login">
        <p>Some features, including donating and appearing on the supporters board, require signing in with TikTok. When you log in we receive the basic profile information described in our <a className={link} href="/privacy">Privacy Policy</a>: a TikTok user identifier, display name and avatar. We never receive your password.</p>
        <p>Your use of TikTok is also governed by <a className={link} href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noreferrer">TikTok's terms of service</a>. You must be old enough to hold a TikTok account. To donate, you must be at least 18 or have permission from a parent or guardian.</p>
      </LegalSection>

      <LegalSection number="04" title="Donations">
        <p>Donations are voluntary support for the project and the stream. They are not a purchase, a charitable donation or a tax-deductible contribution.</p>
        <LegalList items={[
          'Amounts are in Peruvian soles (PEN). Payment methods, cards and bank details are handled by our payment provider; we do not store full payment details.',
          'Donations are generally non-refundable. If you believe a payment was made in error, write to us and we will review it. Nothing here limits rights you have under applicable law.',
          'We may refuse or refund a donation to prevent fraud or abuse, or to comply with the law.',
          'Perks, shoutouts, badges and board placement are discretionary. They are not guaranteed and may change or end. The monthly goal is informational and does not create an obligation to publish a specific amount of content.',
        ]} />
      </LegalSection>

      <LegalSection number="05" title="Supporters and the board">
        <p>When you log in with TikTok, your display name and avatar may be shown publicly on the supporters board. If you donate, your support tier may also be shown and you may be mentioned on stream.</p>
        <p>You can ask us to correct or remove your entry at any time by writing to {email}. Removal from the board does not refund a donation. We may remove entries that impersonate someone, contain unlawful content or are otherwise inappropriate.</p>
      </LegalSection>

      <LegalSection number="06" title="Content and intellectual property">
        <p>The site's text, design, code and original media belong to the operator or are used with permission. You may view the site and share links; you may not republish or use its content commercially without permission.</p>
        <p>If you send a message or note with a donation, you allow us to display it on the site or stream. You keep ownership of your words.</p>
        <p>TikTok and its logo are trademarks of TikTok. Their use here does not imply endorsement.</p>
      </LegalSection>

      <LegalSection number="07" title="Third-party services">
        <p>The site relies on TikTok for login, a payment provider for donations, and hosting and email providers. Their terms and privacy policies apply to their services.</p>
        <p>Links to third-party sites are provided for convenience. We are not responsible for their content or practices.</p>
      </LegalSection>

      <LegalSection number="08" title="Availability and disclaimers">
        <p>The site and stream are provided as-is. We do not guarantee uninterrupted availability, error-free operation or a particular stream schedule. We may change, pause or discontinue any part of the site, including the Live page and donation flow.</p>
        <p>Nothing on the site is financial, legal or tax advice.</p>
      </LegalSection>

      <LegalSection number="09" title="Limitation of liability">
        <p>To the maximum extent permitted by law, we are not liable for indirect, incidental or consequential losses, or for lost profits, data or opportunities, arising from your use of the site.</p>
        <p>Nothing in these terms limits liability that cannot be limited by law, or your statutory rights as a consumer.</p>
      </LegalSection>

      <LegalSection number="10" title="Changes and termination">
        <p>We may update these terms. The new version will be posted with a new date. Material changes apply from the date posted, and continued use of the site means acceptance. We may suspend or end access to the site or the board if these terms are violated or to protect the site or other users.</p>
      </LegalSection>

      <LegalSection number="11" title="Governing law">
        <p>These terms are governed by the laws of the Republic of Peru, without regard to conflict-of-law rules. Disputes will be handled by the competent courts of Lima, Peru, unless applicable law gives you a different forum.</p>
      </LegalSection>

      <LegalSection number="12" title="Contact">
        <p>For any question about these terms, write to {email}.</p>
      </LegalSection>
    </LegalPage>
  )
}
