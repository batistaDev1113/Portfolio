# Yunior Batista — Senior Frontend Engineer Portfolio

[View the live site](https://www.yuniorbatista.com/) · [View the accessible resume](https://www.yuniorbatista.com/resume) · [Download the resume PDF](https://www.yuniorbatista.com/Yunior-Batista-Resume.pdf)

This is the source for Yunior Batista's portfolio: a product-minded Senior Frontend Engineer with 8+ years of experience building scalable, accessible web applications and digital products. It is designed to demonstrate the same standards brought to production work—clear information architecture, maintainable component systems, measurable performance, accessibility, and dependable delivery.

## What this portfolio demonstrates

- **Frontend architecture:** Reusable, typed React and Next.js components, thoughtful data boundaries, and a design-token system that keeps the interface consistent as it grows.
- **Accessible product engineering:** Semantic structure, keyboard-aware interactions, focus management, reduced-motion support, and an HTML resume that is usable with screen readers.
- **Performance-minded delivery:** Static routes, `next/image` optimization, lazy-loaded non-critical sections, and CSS-first motion that avoids adding hydration work to the critical path.
- **Quality as part of the build:** TypeScript, Jest and React Testing Library coverage, Playwright hero regression testing, dependency auditing, and CI checks for every pull request.

## Selected work

### Portfolio platform

A performance-focused portfolio built as a small production application rather than a static template. It uses a shared Tailwind v4 token system, responsive imagery, accessible dark mode, project case studies, and a server-side contact workflow.

The live mobile audit reports **93 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO**. The project’s performance budget targets a 90+ mobile Lighthouse score and near-zero CLS before changes merge.

### Kanban Board

A full-stack task-management experience where authenticated users create, reorder, and persist work across board columns. The project demonstrates practical product concerns beyond a UI mockup: drag-and-drop interactions, API-backed state, a database, and authentication.

See the portfolio’s [project case studies](https://www.yuniorbatista.com/#projects) for the problem, technical decisions, and outcomes behind each project.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| UI system | Tailwind CSS 4, CSS custom properties, responsive design, dark mode |
| Frontend practice | Component architecture, accessibility, Core Web Vitals, responsive images |
| Quality | Jest, React Testing Library, Playwright, ESLint, Prettier |
| Delivery and observability | GitHub Actions, Vercel Analytics, Sentry, Vercel |
| Contact workflow | Next.js route handler and Mailjet API |

## Site capabilities

- A focused senior-engineer introduction, availability status, social links, and accessible HTML/PDF resume options.
- Skills organized around frontend architecture, accessibility, performance, and quality tooling—not only a list of frameworks.
- Responsive project cards and individual case-study routes that explain problems, decisions, outcomes, and next steps.
- A validated contact form that delivers messages through a server-side Mailjet integration.
- Light and dark themes, responsive layouts, and motion that respects user preferences.

## Local development

### Prerequisites

- Node.js 22.x
- npm

### Run the app

```bash
git clone https://github.com/batistaDev1113/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` in the project root to enable the contact form:

```bash
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint:check` | Run ESLint without changing files. |
| `npm run lint` | Run ESLint and apply supported fixes. |
| `npm run format` | Format supported source files with Prettier. |
| `npm test -- --watchAll=false` | Run Jest once. |
| `npm run build && npm run test:e2e` | Build first, then run the Playwright suite. |

## Project structure

```text
app/          Next.js routes, API handlers, metadata, and global styles
components/   Reusable UI sections and interaction components
data/         Project content and case-study data
public/       Images and downloadable resume assets
__tests__/    Unit, component, route, and end-to-end coverage
.github/      CI workflows for quality, security, and smoke checks
```

## Quality and delivery

The repository treats quality gates as part of the product. Pull-request workflows include linting, type checking, unit tests, a Playwright hero regression check, production smoke coverage, and a critical-level production-dependency audit. The codebase also documents important operational decisions in [`docs/adr`](docs/adr).

## Contact

For roles, consulting, or product collaboration, use the [live-site contact form](https://www.yuniorbatista.com/#contact), [LinkedIn](https://www.linkedin.com/in/yunior-profile/), or [GitHub](https://github.com/batistaDev1113).

## License

MIT
