# Yunior Batista — Portfolio

A personal portfolio website built with **Next.js 16** and **React 19**, showcasing projects, skills, and a contact form. Features a modern glassmorphism design with animated backgrounds, dark mode, and smooth Framer Motion transitions.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 + custom CSS (glassmorphism) |
| Font | Inter (Google Fonts via `next/font`) |
| Animations | Framer Motion 12 |
| Dark Mode | next-themes |
| Icons | react-icons |
| Email | Mailjet API |
| Analytics | Vercel Analytics |
| Error Monitoring | Sentry |
| Testing | Jest + React Testing Library |

## Features

**Sticky Navigation** — Full-width header with blur backdrop (`backdrop-blur-md`) that stays above all content (`z-[100]`). Includes a dark/light mode toggle and smooth anchor links.

**Animated Hero** — Full-screen section with an animated 4-color gradient background, glassmorphism card, floating profile image with rotating gradient ring, and staggered Framer Motion entrance animations. Links to view and download resume.

**Project Showcase** — Responsive 1→2→3 column grid of glassmorphism project cards with hover lift effects. Each card shows a screenshot, description, and up to 3 tech tags. A lazy-loaded modal reveals GitHub and live demo links with an Escape key handler and scroll-lock.

**Contact Form** — Split-layout section with a 3D CSS envelope illustration and a validated contact form (name, email, message). Submissions are sent via the Mailjet API through a Next.js API route.

**Dark Mode** — Full light and dark theme support throughout all components.

**Responsive** — Mobile-first layout, tested across phone, tablet, and desktop breakpoints.

## Getting Started

```bash
git clone https://github.com/batistaDev1113/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the project root with:

```
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format with Prettier |
| `npm run test` | Run Jest tests in watch mode |

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss any significant changes.

## License

MIT
