export const dynamic = 'force-static';

const body = `# Yunior Batista — Senior Frontend Engineer

Product-minded Senior Frontend Engineer with 8+ years of experience building scalable, accessible, user-centered web applications. Based in Kissimmee, FL.

- Website: https://www.yuniorbatista.com/
- Resume: https://www.yuniorbatista.com/resume
- Email: yuniorbatista1113@gmail.com
- LinkedIn: https://www.linkedin.com/in/yunior-profile
- GitHub: https://github.com/batistaDev1113

## Summary

Expertise in frontend architecture, React, Next.js, TypeScript, Angular, Vue, component-based development, UX/UI judgment, and technical leadership across system design, reusable component systems, API integration, testing strategy, performance, and production delivery.

## Technical skills

- **Frontend:** React, Next.js, Angular, Vue.js, Vuetify, TypeScript, JavaScript, HTML5, CSS/SCSS, Tailwind CSS
- **Architecture & UI:** Frontend Architecture, Micro-Frontends, Component Libraries, Design Systems, Responsive Design, Web Accessibility (WCAG), Web Performance, OpenLayers
- **Quality & delivery:** Jest, React Testing Library, Unit Testing, Testing Strategy, Git, GitHub, Code Review, Agile
- **Backend & integration:** REST APIs, JSON, C#, .NET, Blazor Server
- **Leadership:** Technical Leadership, System Design, Stakeholder Collaboration, Requirements Analysis, Technical Documentation

## Professional experience

### Design Interactive — Software Engineer (Remote, Feb 2024–Present, Technical Lead)
- Build and maintain secure, scalable enterprise web apps for mission-critical government workflows with strict compliance.
- Tech Lead for Angular project: architecture, system design, implementation strategy, and testing approach.
- Define frontend patterns for component architecture, API integration, maintainability, security, quality, and long-term evolution.
- Modular frontend with Vue.js, Vuetify, OpenLayers, SCSS/CSS, and micro-frontend architecture.
- Reusable UI components, responsive experiences, and geospatial map features.
- Collaborate with stakeholders/product/QA/engineering to translate requirements into designs and releases.
- C# + Blazor Server for full-stack delivery.

### Airship — Software Engineer (Remote, Jan 2022–Nov 2022)
- Built 5+ responsive web apps with React, Next.js, TypeScript, and Tailwind CSS.
- Reusable UI components with accessibility, performance, and maintainability best practices.
- Jest + React Testing Library ~90% coverage and 50% defect reduction.
- Agile collaboration with design and product.

### Power Home Remodeling — UI Engineer (Remote, May 2020–Jan 2022)
- Reusable React components for internal design system (JS, TS, Redux, SCSS).
- Expanded design system with docs/best practices, 20% design inconsistency reduction.
- Refactoring contributed to 17% quality/performance improvement.

### Darden Restaurants — Frontend Developer (Orlando, FL, Jun 2019–Apr 2020)
- A/B testing with JS/jQuery/Adobe Target, 20% revenue increase via conversion optimization.
- TypeScript typing for reliability, 10% client visit increase.

### Visit Orlando — Frontend Developer (Orlando, FL, Jan 2018–Apr 2020)
- Refactored workflows with HTML/JS/Agility CMS.
- Responsive UI + SEO + animations, 30% site visit increase, 8% defect reduction.

## Projects

### Portfolio
- **Stack:** React, Next.js, TypeScript, Tailwind CSS, Playwright, Jest, Vercel
- **Impact:** Lighthouse (live site via PageSpeed Insights) — Desktop: Performance 99, Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100; Mobile: Performance 93, Accessibility 100, Best Practices 100, SEO 100
- **Highlights:** Pure-CSS motion, Tailwind v4 design tokens, next/image AVIF/WebP, CI quality gates
- **Live:** https://www.yuniorbatista.com/
- **Source:** https://github.com/batistaDev1113/Portfolio

### Kanban Board
- **Stack:** React, TypeScript, Tailwind CSS, React DND, Node.js, Vercel
- **Impact:** Full-stack drag-and-drop task manager with authentication and persisted database state
- **Live:** https://kanbanboardclone.vercel.app/
- **Source:** https://github.com/batistaDev1113/kanban-board

## Education

- BS Computer Science, Florida State University, Tallahassee, FL

## Machine-readable resources

- Sitemap: https://www.yuniorbatista.com/sitemap.xml
- LLM description: https://www.yuniorbatista.com/llms.txt
- OpenAPI: https://www.yuniorbatista.com/openapi.json
- API catalog: https://www.yuniorbatista.com/.well-known/api-catalog
- OAuth authorization server metadata: https://www.yuniorbatista.com/.well-known/oauth-authorization-server
- OAuth protected resource metadata: https://www.yuniorbatista.com/.well-known/oauth-protected-resource

## Contact

- Phone: 407-785-5587
- Email: yuniorbatista1113@gmail.com
- Website: https://www.yuniorbatista.com/
`;

export function GET(): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      Vary: 'Accept',
    },
  });
}
