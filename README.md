# Mutual Site

Marketing and product site for Mutual — a smartphone and OS designed to enforce user intent (focus, sleep, control).

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS** (CDN)
- **Supabase** (backend/auth)
- **ESLint** for linting

## Getting Started

```sh
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  App.jsx          # Main application component
  main.jsx         # Entry point
  supabaseClient.js # Supabase configuration
  App.css          # Application styles
  assets/          # Static assets (fonts, icons, etc.)
brand_assets/      # Brand logos, headshots, phone mockups, demo video
```

## Design & Contribution Rules

See [AGENTS.md](./AGENTS.md) for all design philosophy, implementation rules, and workflow conventions.
