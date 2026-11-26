#!/usr/bin/env bash
# Sync the curated design/UX skills into project scope (.pi/skills).
#
# Usage:
#   ./scripts/sync-skills.sh            # install / update everything
#   ./scripts/sync-skills.sh --list     # show what would be installed
#
# Skills are copied verbatim from their upstream repos. Everything is MIT or
# Apache-2.0; keep the LICENSE files inside each skill directory.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/.pi/skills"
LIST_ONLY=0
[[ "${1:-}" == "--list" ]] && LIST_ONLY=1

# repo | ref | path inside repo | local name (optional)
MANIFEST=$(cat <<'EOF'
# Paldom/landing-page-builder-skills — landing page pipeline incl. anti-slop guardrails
Paldom/landing-page-builder-skills|main|skills/landing-page-art-direction|landing-page-art-direction
Paldom/landing-page-builder-skills|main|skills/landing-page-copywriting|landing-page-copywriting
Paldom/landing-page-builder-skills|main|skills/landing-page-structure|landing-page-structure
Paldom/landing-page-builder-skills|main|skills/visual-design-system|visual-design-system
Paldom/landing-page-builder-skills|main|skills/landing-page-accessibility|landing-page-accessibility
Paldom/landing-page-builder-skills|main|skills/web-vitals-and-seo|web-vitals-and-seo
Paldom/landing-page-builder-skills|main|skills/scroll-motion|scroll-motion
Paldom/landing-page-builder-skills|main|skills/ux-guardrails|ux-guardrails
Paldom/landing-page-builder-skills|main|skills/landing-page-experimentation|landing-page-experimentation
# NOTE: skills/nextjs-landing-page is intentionally skipped — this project is Preact + Vite.
# anthropics/skills — official design + authoring skills
anthropics/skills|main|skills/frontend-design|frontend-design
anthropics/skills|main|skills/canvas-design|canvas-design
anthropics/skills|main|skills/theme-factory|theme-factory
anthropics/skills|main|skills/brand-guidelines|brand-guidelines
anthropics/skills|main|skills/skill-creator|skill-creator
# hueyexe/frontend-agent-skills — UX craft, forms, accessibility, composition
hueyexe/frontend-agent-skills|main|forms-inputs-checkout|forms-inputs-checkout
hueyexe/frontend-agent-skills|main|accessibility-inclusive-design|accessibility-inclusive-design
hueyexe/frontend-agent-skills|main|ui-visual-composition|ui-visual-composition
hueyexe/frontend-agent-skills|main|ux-writing-content-design|ux-writing-content-design
hueyexe/frontend-agent-skills|main|design-systems-frontend-architecture|design-systems-frontend-architecture
hueyexe/frontend-agent-skills|main|interaction-patterns-components|interaction-patterns-components
hueyexe/frontend-agent-skills|main|information-architecture-navigation|information-architecture-navigation
hueyexe/frontend-agent-skills|main|ux-usability-foundations|ux-usability-foundations
hueyexe/frontend-agent-skills|main|ux-research-discovery-testing|ux-research-discovery-testing
# badlogic/pi-skills — agent self-review infrastructure
badlogic/pi-skills|main|browser-tools|browser-tools
badlogic/pi-skills|main|brave-search|brave-search
EOF
)

if [[ $LIST_ONLY -eq 1 ]]; then
  echo "$MANIFEST" | grep -v '^#' | grep -v '^$' | while IFS='|' read -r repo ref path name; do
    printf '%-42s %s/%s\n' "${name:-$(basename "$path")}" "$repo" "$path"
  done
  exit 0
fi

mkdir -p "$DEST"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "$MANIFEST" | grep -v '^#' | grep -v '^$' | while IFS='|' read -r repo ref path name; do
  name="${name:-$(basename "$path")}"
  cache="$TMP/${repo//\//__}"
  if [[ ! -d "$cache" ]]; then
    echo "↓ downloading $repo@$ref"
    curl -fsSL "https://codeload.github.com/$repo/tar.gz/refs/heads/$ref" \
      | tar -xz -C "$TMP"
    mv "$TMP/$(basename "$repo")-$ref" "$cache"
  fi
  src="$cache/$path"
  if [[ ! -f "$src/SKILL.md" ]]; then
    echo "✗ $repo/$path has no SKILL.md" >&2
    exit 1
  fi
  rm -rf "${DEST:?}/$name"
  cp -R "$src" "$DEST/$name"
  echo "  ✓ $name"
done

echo ""
echo "Installed into .pi/skills — run /reload inside Pi to pick them up."
