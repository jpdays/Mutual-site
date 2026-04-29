# AGENTS.md — Mutual Frontend & Design Rules

This is the single source of truth for design philosophy, implementation rules, and workflow conventions for the Mutual site.

---

## Brand & Product Context

- **Product:** A smartphone + OS that enforces user intent (focus, sleep, control).
- **Tone:** Intelligent, precise, human — not wellness-soft, not preachy.
- **Audience:** High-agency users who have tried and failed to control phone usage.
- **Visual direction:**
  - Clean, intentional, slightly editorial.
  - Not overly "techy", not playful-startup.
  - Feels like a product you commit to.

---

## Priority

When generating frontend work, always prioritize:

1. Visual accuracy (if a reference is provided)
2. Design quality (if no reference)
3. Clean, minimal implementation

---

## Reference-Based Design (Strict Mode)

- If a reference image or website is provided:
  - Match layout, spacing, typography, and colors exactly.
  - Do NOT improve, redesign, or add features.
  - Replace content with placeholders if needed (`https://placehold.co/WIDTHxHEIGHT`).
- If multiple references are provided:
  - Combine structure from one with styling from another only if explicitly requested.
- When comparing against a reference, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px".
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.

---

## No-Reference Mode (Creative)

If no reference is provided:

- Design with high visual craft.
- Avoid generic SaaS layouts.
- Aim for: aesthetic clarity, storytelling + layout flow, clean structure + typography.

---

## Brand Assets

- Always check the `brand_assets/` folder before designing. It contains logos, headshots, phone mockups, and a demo video.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

---

## Design System Rules

### Colors

- Never use default Tailwind palette (blue-500, indigo-500, etc.).
- Define a custom base color and derive shades.
- Prefer neutral + 1 strong accent.

### Typography

- Always use 2 contrasting fonts:
  - Display (serif or expressive) for headings.
  - Clean sans-serif for body.
- Headings: tight tracking (`-0.02em` to `-0.04em`), large scale contrast (3–5× body size).
- Body: line-height `1.6`–`1.8`.

### Spacing

- Use a consistent spacing system.
- Avoid random Tailwind spacing jumps.
- Sections should feel rhythmically spaced.

### Layout

- Avoid boxed "card-heavy SaaS" layouts by default.
- Prefer: text + image side-by-side, flowing sections, minimal separators.

### Depth & Surfaces

- Use clear layering: base / elevated / floating.
- Avoid flat interfaces. Subtle depth > heavy shadows.

### Shadows

- Never use default Tailwind shadows (`shadow-md`, etc.).
- Use soft, layered shadows with low opacity.
- Slight color tint preferred.

### Gradients

- Layer multiple radial gradients where appropriate.
- Add grain/texture via SVG noise filter for depth.

### Buttons & Interactive Elements

- Buttons must feel physical: hover with slight scale (`1.02`–`1.05`), smooth easing (not linear).
- Only animate `transform` and `opacity`. Never use `transition-all`.
- Every interactive element must include: `hover`, `focus-visible`, and `active` states. No exceptions.

### Images

- Avoid raw flat images.
- Add gradient overlays and subtle blending where needed.

---

## Anti-Generic Guardrails

- No default Tailwind colors.
- No generic SaaS hero sections.
- No overused layouts (3 cards in a row, etc.).
- No "startup gradient blob" visuals.
- No vague marketing copy.
- Everything must feel intentional and designed.

---

## Workflow

### Dev Server

This is a React + Vite project. Use the standard scripts from `package.json`:

```sh
npm install        # Install dependencies
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run preview    # Preview the production build
npm run lint       # Run ESLint
```

### Screenshot Workflow

`screenshot.mjs` exists in the project root and uses `puppeteer-core` to capture full-page screenshots.

**Setup required:** The script needs a local Chrome/Chromium executable path. Before using it, update the `chromePath` variable in `screenshot.mjs` to point to your local Chrome installation. Do not commit machine-specific paths.

Usage (once configured):

```sh
node screenshot.mjs http://localhost:5173              # Basic screenshot
node screenshot.mjs http://localhost:5173 label        # Screenshot with label suffix
```

Screenshots save to `./temporary screenshots/screenshot-N.png` (auto-incremented).

After screenshotting, read the PNG with the Read tool to visually compare against references. Do at least 2 comparison rounds when matching a reference. Stop only when no visible differences remain or the user says so.

---

## Implementation Rules

- This is a **React + Vite** project. Write React components — not single-file `index.html` pages.
- Use Tailwind utility classes.
- Prefer clarity over cleverness.
- Avoid unnecessary JS.
- Keep code clean and structured.
- Do not add sections, features, or content not requested.
- Do not "improve" a reference design — match it.

---

## Hard Rules

- Do not add features not in the reference.
- Do not redesign reference layouts.
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo as primary color.
- Keep implementation simple and readable.

---

## If Unclear

- Ask clarifying questions before proceeding.
- Push back on vague or conflicting instructions.
