# AGENTS.md — Frontend & Design Rules (Mutual)

## Priority
When generating frontend work, always prioritize:
1. Visual accuracy (if a reference is provided)
2. Design quality (if no reference)
3. Clean, minimal implementation

---

## Reference-Based Design (Strict Mode)
- If a reference image or website is provided:
  - Match layout, spacing, typography, and colors exactly
  - Do NOT improve, redesign, or add features
  - Replace content with placeholders if needed (`https://placehold.co/...`)
- If multiple references are provided:
  - Combine structure from one with styling from another only if explicitly requested

---

## No-Reference Mode (Creative)
If no reference is provided:
- Design with high visual craft
- Avoid generic SaaS layouts
- Aim for:
  - Balance Phone (aesthetic clarity)
  - Shift (storytelling + layout flow)
  - Fort (clean structure + typography)

---

## Output Defaults
- Single `index.html` file unless specified otherwise
- Tailwind CSS via CDN
- Mobile-first responsive
- No unnecessary files or frameworks

---

## Brand & Product Context (Mutual)
- Product: smartphone + OS that enforces user intent (focus, sleep, control)
- Tone: intelligent, precise, human — NOT wellness-soft, NOT preachy
- Audience: high-agency users who have tried and failed to control phone usage
- Visual direction:
  - Clean, intentional, slightly editorial
  - Not overly “techy”, not playful-startup
  - Feels like a product you commit to

---

## Design System Rules

### Colors
- Never use default Tailwind palette (blue-500, indigo, etc.)
- Define a custom base color and derive shades
- Prefer neutral + 1 strong accent

---

### Typography
- Always use 2 contrasting fonts:
  - Display (serif or expressive) for headings
  - Clean sans-serif for body
- Headings:
  - Tight tracking (~ -0.02 to -0.04em)
  - Large scale contrast (3–5x body size)
- Body:
  - Line-height: ~1.6–1.8

---

### Spacing
- Use a consistent spacing system
- Avoid random Tailwind spacing jumps
- Sections should feel rhythmically spaced

---

### Layout
- Avoid boxed “card-heavy SaaS” layouts by default
- Prefer:
  - Text + image side-by-side
  - Flowing sections
  - Minimal separators

---

### Depth & Surfaces
- Use clear layering:
  - Base / elevated / floating
- Avoid flat interfaces
- Subtle depth > heavy shadows

---

### Shadows
- Never use default Tailwind shadows
- Use soft, layered shadows with low opacity
- Slight color tint preferred

---

### Buttons
- Must feel physical:
  - Hover: slight scale (1.02–1.05)
  - Smooth easing (not linear)
- Do NOT use `transition-all`
- Use transform + opacity only

---

### Images
- Avoid raw flat images
- Add:
  - Gradient overlays
  - Subtle blending where needed

---

### Interaction Rules
Every interactive element must include:
- hover state
- focus-visible state
- active state

No exceptions.

---

## Anti-Generic Guardrails
- No default Tailwind colors
- No generic SaaS hero sections
- No overused layouts (3 cards in a row, etc.)
- No “startup gradient blob” visuals
- No vague marketing copy

Everything must feel intentional and designed.

---

## Constraints
- Do not add features not requested
- Do not redesign reference layouts
- Keep implementation simple and readable

---

## Implementation Notes
- Prefer clarity over cleverness
- Avoid unnecessary JS
- Use Tailwind utility classes directly
- Keep code clean and structured

---

## If Unclear
- Ask clarifying questions before proceeding
- Push back on vague or conflicting instructions