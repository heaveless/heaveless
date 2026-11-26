# Project skills

Skills live in `.pi/skills/` (project scope). The directory is gitignored as local Pi tooling, so the source of truth for re-creating it is the script:

```bash
./scripts/sync-skills.sh          # install or update everything
./scripts/sync-skills.sh --list   # show the manifest
```

After installing or editing a skill, run `/reload` inside Pi. The local campaign skill is hand-written and is **not** touched by the script.

## Manifest

| Skill | Source | License | Why it is here |
|---|---|---|---|
| `landing-page-art-direction` | Paldom/landing-page-builder-skills | MIT | commit to one named direction before code |
| `landing-page-copywriting` | Paldom/landing-page-builder-skills | MIT | outcome-first, no invented claims |
| `landing-page-structure` | Paldom/landing-page-builder-skills | MIT | section order and page skeleton |
| `visual-design-system` | Paldom/landing-page-builder-skills | MIT | tokens, budgets, DESIGN.md enforcement |
| `landing-page-accessibility` | Paldom/landing-page-builder-skills | MIT | WCAG 2.2 AA pass |
| `web-vitals-and-seo` | Paldom/landing-page-builder-skills | MIT | LCP, CLS, INP, metadata |
| `scroll-motion` | Paldom/landing-page-builder-skills | MIT | cheapest motion tier, reduced motion |
| `ux-guardrails` | Paldom/landing-page-builder-skills | MIT | zero-dep UX lint (0 criticals required) |
| `landing-page-experimentation` | Paldom/landing-page-builder-skills | MIT | A/B tests for the event and donation flow |
| `frontend-design` | anthropics/skills | Apache-2.0 | anti-generic visual direction (replaced the older copy) |
| `canvas-design` | anthropics/skills | Apache-2.0 | poster and illustration direction for the event art |
| `theme-factory` | anthropics/skills | Apache-2.0 | palette and theme starting points |
| `brand-guidelines` | anthropics/skills | Apache-2.0 | brand consistency when the event becomes a family of pages |
| `skill-creator` | anthropics/skills | Apache-2.0 | author and evaluate new campaign skills |
| `forms-inputs-checkout` | hueyexe/frontend-agent-skills | MIT | donation form, validation, errors |
| `accessibility-inclusive-design` | hueyexe/frontend-agent-skills | MIT | inclusive flows and semantics |
| `ui-visual-composition` | hueyexe/frontend-agent-skills | MIT | composition and hierarchy |
| `ux-writing-content-design` | hueyexe/frontend-agent-skills | MIT | microcopy for trust and clarity |
| `design-systems-frontend-architecture` | hueyexe/frontend-agent-skills | MIT | component and token architecture |
| `interaction-patterns-components` | hueyexe/frontend-agent-skills | MIT | interaction states and feedback |
| `information-architecture-navigation` | hueyexe/frontend-agent-skills | MIT | event navigation and structure |
| `ux-usability-foundations` | hueyexe/frontend-agent-skills | MIT | usability checks |
| `ux-research-discovery-testing` | hueyexe/frontend-agent-skills | MIT | lightweight testing |
| `browser-tools` | badlogic/pi-skills | MIT | screenshots and page inspection via CDP |
| `brave-search` | badlogic/pi-skills | MIT | research before copywriting |
| `heaveless-event-campaign` | local | project | locks the `/event` contract and verification steps |

Already present before this setup and left untouched: `design-taste-frontend`, `imagegen-frontend-web`, `shadcn`, `vercel-react-best-practices`, `web-design-guidelines`.

Skipped on purpose: `nextjs-landing-page` from the Paldom pack. This project is Preact plus Vite, and that skill would push Next.js conventions into a stack that does not use them.

## Reference only

`docs/references/nonprofit-donation-page-copy.md` vendors the MIT-licensed `nonprofit-donation-page-copy` skill from `sector-skills/nonprofit-skills`. It is documentation, not an auto-loaded skill: 2 installs upstream is not enough to make it a dependency.

## Runtime notes

- `browser-tools` needs its own dependencies and a Chrome/Chromium build: `cd .pi/skills/browser-tools && npm install`. The project already has the Playwright MCP server, so this is optional.
- `brave-search` needs `BRAVE_API_KEY` in the environment.
- `canvas-design` ships about 5 MB of OFL fonts. They are not loaded by the site.
- Skills are copied verbatim, including their `LICENSE` files. Keep those files when moving a skill.

## Moving to committed project skills

If the skills should travel with the repository instead of staying local, change `DEST` in `scripts/sync-skills.sh` to `.agents/skills` and remove `.pi/skills/` from `.gitignore`. Pi discovers `.agents/skills/` from the working directory up to the repository root and other Agent Skills clients can read the same folder.
