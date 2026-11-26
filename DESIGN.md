# heaveless design system

## Site baseline

The public site is a dark editorial system: night `#11110f`, coral `#ff5666`, system sans, mono micro-labels, tight tracking, numbered navigation. `PageShell`, `SiteHeader` and `SiteFooter` own that language. Do not change it to accommodate the campaign.

## Event direction: "One pine field, one paper page"

The `/event` page is an **isolated skin**, not a variation of the site. It reads as one sheet of stationery: the page opens on a pine field with the header standing in it, the field ends in a long snow drift, and the rest of the page is warm paper. The header stays with the reader and changes surface as the page changes surface.

- **Design read:** a printed Christmas letter laid over one night in Arequipa. Soft, human, specific. Never a storefront demo.
- **Reference:** a green Christmas scene with a tree, snow and a countdown, translated into a full-bleed page instead of a framed card.
- **Rejected defaults:** rounded "window" cards with snow caps and icicles, floating countdown plates, glass panels, photo-real 3D renders, confetti, emoji illustrations, a hero that reads as a card pasted onto a dark gallery.
- **Macrostructure:** adaptive header, full-bleed pine opening (promise left with the campaign panel under it, tree right), snow drift, paper countdown, dated plan, gift cards, letter, wall, pine footer under a paper edge. Nothing is ruled off from anything else: **there are no separators, hairlines or dividers between sections.** Space and the kicker carry the rhythm, and the only lines left on the page are the dashed plan timeline, card borders and the tag props.
- **Type personality:** Bricolage Grotesque 400 to 800 for display, Instrument Sans 400 to 700 for body, Yellowtail only for the signature and the closing line. Labels are 9 to 10px uppercase with wide tracking. Headlines run at weight 800 with `tracking-[-.04em]`.
- **Palette family:** pine night (`#041d15` to `#0a3826`), warm paper (`#fbf8ee`), forest ink (`#082e22`), one lime light (`#dff45f`) for the primary action and live numbers, berry and gold only inside the illustration.
- **Motion character:** a short hero entrance, a slow twinkle in the tree, the fixed snow layer. Cards that are not links do not lift on hover. Everything is disabled and the snow hidden under `prefers-reduced-motion`.

**Signature element:** the snow line. The pine field ends in one long paper drift. The tree and its presents stand in that snow and the countdown is printed just below it, on the paper. No frame, no card, no second surface.

Layout rules that keep it one page:

- The header sits on the pine field and shares the hero container (1200px, 20/32px gutters). It is sticky at all times. Once the paper surface reaches it, the same row turns paper with forest ink; at the top it is pine again. The closing footer is a separate pine surface under its own paper edge, so the header only follows it when that edge actually reaches the header; on a normal viewport the footer sits below the header and the header stays paper over the paper. No second bar, no mirrored nav. The four anchors (plan, gifts, note, wall) appear from 768px up, where the logo, the links and the language switch fit without collision; below 768px the page is read in order.
- The opening is full-bleed. No rounded container, no outer frame, no drafting grid. The tree may bleed into the right gutter and always stands on the drift.
- The countdown is four numbers sitting in the open on the paper, under the date. No rail, no dividers, no frames: the numbers are separated by space. It is never a floating card, never a progress bar and never a dashboard.
- **The campaign panel is the only light surface in the pine field**, the way a campaign page states it (Kickstarter's rail, charity: water's give box, GoFundMe's card). White paper, 18px radius, one soft shadow, `max-w-[23rem]`. **While donations are closed it leads with the opening date as its figure:** kicker (`Donations open`), the date at `clamp(2.2rem,5.1vw,3.15rem)` with the year at `0.42em` in forest/60, one muted line (`The list is already written.`) and `See the plan` as a quiet underlined text link, not a lime button. **Once donations open the same panel switches to `Raised so far`**, the amount at `clamp(2.8rem,6.2vw,3.9rem)` with a half-size `S/` in forest/60, the hand-update line and the full-width lime primary action. **A campaign that has not opened never shows `S/ 0`.** Nothing else goes in it: no progress bar (there is no goal), no ring, no percentage, no ornament, no second wordmark. Below 980px it is full width under the copy; above, it hangs in the left column with the tree beside it.
- Every section shares the 1200px container. Vertical rhythm is 56 to 80px and it does all the separating work; section headings stay at or below 48px except the opening.
- Cards are paper with a hairline and a soft shadow. The only pine surface inside the paper field is the login panel.
- **The footer carries nothing the header already says.** No repeat of the section links, no second logo block: the greeting, one sentence about the evening, the address as a plain line (`Write to me at hi@heaveless.com`) and the small print row (`A personal campaign` left, Terms, Privacy, heaveless right).
- Labels are 9px minimum. The alpha floors are measured, not guessed: on paper, body 70% and labels 65% of forest; on pine, body 70% and labels 60% of paper; on the lime tag, 70% of pine. Anything lighter fails 4.5:1 and is decorative only.
- The plan is one rail at every width. From 900px it is a horizontal dashed line with a state dot per date, and the line ends at the last dot instead of running into the empty gutter; below that the four beats stack and each dot hangs from a short vertical segment in the gap above it, so the rule never crosses the copy. The dot state is derived from today in Lima, never stored: the first date that has not passed is next, every earlier date is done, and the plan cannot go stale after a date.
- Numbers are data or diegetic props, never decoration. No section indices, no step counters, no watermark numerals. The event skin does not inherit the site's numbered navigation, its mono micro-labels or its `01 / 02 / 03` rhythm: `/event` is a separate skin, not a section of the site.
- No filler sections. If a block only restates the letter or the plan in fewer words, delete it: the page is the promise, the figure, the countdown, the plan, the three parts of a gift, the letter and the wall.

## Event tokens

Defined in `web/src/index.css` under `@theme`.

| Token | Value | Use |
|---|---|---|
| `--color-pine-950` | `#041d15` | footer and the deepest field |
| `--color-pine-900` | `#06281c` | deep pine surface |
| `--color-pine-800` | `#0a3826` | header, top of the opening |
| `--color-pine-700` | `#0f4b33` | illustration pines |
| `--color-pine-600` | `#176b4b` | illustration, kickers and the countdown fill on paper |
| `--color-pine-500` | `#228a60` | illustration light |
| `--color-paper` | `#fbf8ee` | the snow field, cards |
| `--color-paper-2` | `#f1ecdc` | the second tag |
| `--color-forest` | `#082e22` | text and hairlines on paper |
| `--color-lime` | `#dff45f` | primary CTA, live numbers, highlights |
| `--color-berry` / `--color-gold` | `#dc4030` / `#f1c56b` | illustration only |
| `--color-snow` | `#fdfbf4` | snow banks |
| `--font-display` | Bricolage Grotesque | every headline |
| `--font-body` | Instrument Sans | body, labels, UI |
| `--font-script` | Yellowtail | signature and closing line only |

Fonts are self-hosted in `web/public/fonts` (OFL, latin subset) and only fetched when the event page renders them.

## Isolation rules

1. `/event` must not use `PageShell`, `SiteHeader` or `SiteFooter`. It owns `EventHeader` and `EventFooter`.
2. Event tokens, the `event-*`, `snow*`, `pine-card`, `paper-card` and `lime-tag` classes and `web/src/components/event/*` never leave the event route. One exception, written down so it does not grow: the Christmas teaser next to "See the work" on `/` may use `--color-lime` and the shared `components/icons/Snowflake` glyph. No event class, font or surface crosses over.
3. The rest of the site never adopts the pine/paper palette, Bricolage or Instrument Sans.
4. Route-level metadata: `EventPage` sets `color-scheme: dark`, the body background `#041d15`, the document title and `theme-color`, and restores all four on unmount.
5. The header listener and the snow layer are cleaned up on unmount. The snow layer is fixed, `aria-hidden`, `pointer-events: none`, sits below the sticky header and is `display: none` under reduced motion.
6. Layout must survive missing web fonts: no fixed width that only fits a webfont, no label that wraps inside a fixed-height button. Every CTA and the TikTok button stay single-line at any font.

## Language and copy rules

**The site is English. `/event` is bilingual, English and Spanish, and it says so in its header.** The switch is a quiet text link naming the other language (`Español` while reading English, `English` while reading Spanish), not a bordered chip; the choice is remembered in `localStorage` and it never leaks to the rest of the site.

- `web/src/data/event.ts` holds the locale neutral facts plus one full copy dictionary per language. There is no half translated string: if a sentence has a language, it exists in both.
- Everything textual comes from the dictionary: section copy, dates (`Intl` with `es-PE` or `en-US`, always in `America/Lima`), timer labels, `aria-label`s and the document title. The `html lang` follows the switch and is restored on unmount.
- The only fixed labels are the official TikTok button, `Log in with TikTok`, and the language endonym in the switch (`Español` / `English`). Both are proper labels and do not translate.
- Spanish copy is written, not machine turned: no em dashes, no mixed sentences, no `Navidad` sprinkled into an English line. Same for English.

- No em dashes or en dashes anywhere visible. Use a period or a comma.
- No invented numbers, donors, matches, testimonials or scarcity. There is no fixed count of kids or families and no goal: the donations decide how far down the list the evening reaches, and the page says so in one sentence instead of promising a number. An empty box is allowed to say it is empty. There is no funding dashboard: no counters, no percentages, no progress bars, no "updated" stamps. The numbers that appear are dates, and they are written like a person would write them.
- No product language. No "no agency, no middlemen, no paid ads" trust badges, no DONE / NEXT / LATER chips, no plan roadmap. If a fact needs saying, say it in a sentence, in the letter's voice.
- Donations are closed until `donationOpens` in `web/src/data/event.ts`, and `donationUrl === ''` means there is nothing to click yet. No button may pretend otherwise: no `mailto:` CTA, no "remind me" that only opens a mail client, no disabled or fake checkout. While closed, the page states the date and offers the address as a quiet contact line (`Before then, write to me at hi@heaveless.com`), nothing more.
- The instant `donationUrl` is set, the real checkout becomes the primary action in the two places that carry one: header and hero. Until then the header has no button at all and the hero's primary is `See the plan`, a real anchor styled as a quiet underlined text link, not a lime button.
- Donation-specific copy checklist: `docs/references/nonprofit-donation-page-copy.md`.

## Event pre-flight

- [ ] One `h1`, one primary CTA, no dead links, no `href="#"`.
- [ ] The header sticks, switches to paper at the paper line and returns to pine at the top.
- [ ] The opening is full-bleed: no rounded frame, no snow cap, no floating countdown card.
- [ ] The tree stands on the drift at 980px and wider; no gift is left floating.
- [ ] Countdown target comes from `event.deliveryDate`; no hardcoded day counts in copy.
- [ ] The plan dot state follows today in Lima; no stored `done / next / later` status survives a passed date.
- [ ] The four header anchors fit at 768px in both languages without touching the language switch.
- [ ] While donations are closed the panel shows the opening date, never `S/ 0`; the language switch is a text link, not a bordered chip.
- [ ] Contrast: cream on pine at least 10:1, forest/70 body on paper at least 5:1, forest/65 labels at least 4.5:1, paper/60 labels on pine at least 5:1, pine text on lime at least 12:1.
- [ ] The header is pine on the opening and paper through the body; if the footer's paper edge reaches it, it turns pine again, otherwise it stays paper over the paper.
- [ ] No horizontal separator anywhere: sections are divided by space only, and the paper edge on the footer is the one silhouette allowed.
- [ ] Focus is one two-tone ring: a pine outline with a lime halo, so it reads on both surfaces.
- [ ] Every interactive target at least 24x24 px, touch targets 44 px where practical. The TikTok button keeps the official 48px height and a single-line label.
- [ ] No visible label is below 9px and no body or label sits under the measured alpha floor.
- [ ] Auth notices are translated with the rest of the page; the only fixed labels are the TikTok button and the language endonym.
- [ ] Reduced motion disables the entrance, the twinkle and the snow layer.
- [ ] The tree is decorative: one SVG, `aria-hidden`, no image requests, no layout shift.
- [ ] No horizontal overflow at 320, 390, 768, 1024 and 1440.
- [ ] No event font requested on any other route.
- [ ] Title, meta description, `theme-color`, `color-scheme`, `html lang` and body colors restore when leaving `/event`.
- [ ] Build passes (`npm --prefix web run build`).
