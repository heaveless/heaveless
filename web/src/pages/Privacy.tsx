import { LegalList, LegalPage, LegalSection } from '../components/legal/LegalPage'

const link = 'text-ink underline decoration-line underline-offset-4 transition-colors hover:text-coral'
const email = <a className={link} href="mailto:hi@heaveless.com">hi@heaveless.com</a>
const code = (value: string) => <code className="font-mono text-[0.9em] text-ink">{value}</code>

export function PrivacyPage() {
  return (
    <LegalPage
      route="/privacy"
      title="Privacy Policy"
      updated="November 20, 2026"
      intro="This policy explains what we collect when you visit heaveless.com, log in with TikTok or make a donation, and what you can do about it. It covers the website and the donation flow, not TikTok itself."
    >
      <LegalSection number="01" title="Who is responsible">
        <p>heaveless is a personal website and live stream. The data controller is the operator of heaveless.com, reachable at {email}.</p>
      </LegalSection>

      <LegalSection number="02" title="What we collect">
        <LegalList items={[
          <>TikTok login data, only if you choose to log in: a TikTok user identifier, display name and avatar. We do not receive your password.</>,
          <>Donation data: amount, currency, reference, message or description, payment status and the display name associated with your TikTok account if you appear on the board. Full card or bank details are handled by the payment provider and are not stored by us.</>,
          <>Technical data: essential cookies, IP address and basic request logs used to operate and protect the site.</>,
          <>Messages you send us by email.</>,
        ]} />
        <p>We do not use advertising trackers and we do not sell personal data.</p>
      </LegalSection>

      <LegalSection number="03" title="How we use it">
        <p>We use this information to authenticate you with TikTok, keep you logged in, show your display name and avatar on the supporters board, process and confirm donations, mention supporters on stream, respond to messages, prevent fraud and abuse, troubleshoot the site and comply with legal obligations.</p>
        <p>Where data protection law requires a legal basis, we rely on performance of a contract or steps you ask for (login and donation), our legitimate interests in operating and securing the site, your consent for the public display of your supporter entry, and legal obligations.</p>
      </LegalSection>

      <LegalSection number="04" title="Cookies">
        <LegalList items={[
          <>{code('hl_session')}: a signed, HttpOnly cookie that keeps you logged in for up to 7 days.</>,
          <>{code('hl_oauth_state')}: a short-lived cookie (10 minutes) that protects the TikTok login flow against cross-site request forgery.</>,
        ]} />
        <p>Both are necessary for the features you request. We do not use advertising cookies. You can clear cookies in your browser, which logs you out. Blocking the session cookie prevents TikTok login.</p>
      </LegalSection>

      <LegalSection number="05" title="Sharing">
        <LegalList items={[
          <>TikTok, to authenticate you and read your basic profile. TikTok's own <a className={link} href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a> applies to your use of TikTok.</>,
          <>Our payment provider, to process the donation and confirm its status.</>,
          <>Hosting and email providers, to run the site and respond to messages.</>,
          <>Authorities or other parties when required by law, or to protect rights and safety.</>,
        ]} />
        <p>We do not sell personal data. Providers may process data outside Peru; we take reasonable steps to protect it.</p>
      </LegalSection>

      <LegalSection number="06" title="Retention">
        <LegalList items={[
          'Session: up to 7 days. OAuth state: 10 minutes.',
          'Supporter entry: until you ask for removal or the board is reset or closed.',
          'Donation records: for as long as needed for accounting, tax and legal obligations. The payment provider keeps its own records.',
          'Server logs: for a limited period for security and troubleshooting.',
          'Emails: for as long as needed to handle the conversation.',
        ]} />
      </LegalSection>

      <LegalSection number="07" title="Your rights">
        <p>Depending on your location, you may have the right to access, correct, delete, restrict or object to the processing of your data, and to withdraw consent. You can ask to be removed from the supporters board, or ask what data we hold, by writing to {email}. We may need to verify your request.</p>
        <p>You can log out at any time and clear cookies. You can also manage TikTok's permissions in your TikTok account. You may complain to your local data protection authority.</p>
      </LegalSection>

      <LegalSection number="08" title="Children">
        <p>The site is not directed to children under 13, the minimum age for a TikTok account. Donations are for adults (18+) or minors with parental permission.</p>
        <p>If we learn that we collected data from a child without the required consent, we will delete it.</p>
      </LegalSection>

      <LegalSection number="09" title="International transfers">
        <p>TikTok, our payment provider and our hosting and email providers may process data in other countries. Where required, we rely on appropriate safeguards for those transfers.</p>
      </LegalSection>

      <LegalSection number="10" title="Security">
        <p>We use HTTPS, HttpOnly signed session cookies, server-side secrets and limited access. No system is completely secure. If you suspect a problem, contact us at {email}.</p>
      </LegalSection>

      <LegalSection number="11" title="Changes">
        <p>We may update this policy. The new version will be posted with a new date. Material changes apply from the date posted.</p>
      </LegalSection>

      <LegalSection number="12" title="Contact">
        <p>For any privacy question or request, write to {email}.</p>
      </LegalSection>
    </LegalPage>
  )
}
