export const dynamic = 'force-static';

const body = `# Yunior Batista

> Senior Frontend Engineer (8+ years) building scalable, accessible, high-performance web applications with React, Next.js, TypeScript, and modern frontend architecture. Based in Kissimmee, FL.

## Pages

- [Home](https://www.yuniorbatista.com/): Portfolio overview, hero, toolbox, selected projects, and contact form.
- [Resume](https://www.yuniorbatista.com/resume): Professional experience, technical skills, education, and contact details.
- [Sitemap](https://www.yuniorbatista.com/sitemap.xml): XML sitemap for discoverable pages.

## Machine-readable resources

- [Markdown homepage](https://www.yuniorbatista.com/index.md): Markdown representation of the portfolio/home content.
- [OpenAPI description](https://www.yuniorbatista.com/openapi.json): OpenAPI 3.1 document describing available HTTP APIs.
- [API catalog](https://www.yuniorbatista.com/.well-known/api-catalog): RFC 9727-style API catalog linking to service descriptions.
- [OAuth authorization server metadata](https://www.yuniorbatista.com/.well-known/oauth-authorization-server): Discovery metadata (this site does not provide a working OAuth authorization server).
- [OAuth protected resource metadata](https://www.yuniorbatista.com/.well-known/oauth-protected-resource): Protected resource discovery metadata for this site.

## APIs

- [Chat API](https://www.yuniorbatista.com/api/chat): \`POST\` JSON \`{ "messages": [...] }\` (AI SDK UI message array). Returns a streaming UI message response; may return 400, 429, 500, or 503.
- [Contact API](https://www.yuniorbatista.com/api/contact): \`POST\` JSON \`{ "full_name": string, "email": string, "textarea": string }\`. Returns 200 on success, 400 for missing fields, or 500 on service/configuration errors.

## Projects

- [Portfolio case study](https://www.yuniorbatista.com/): This site — Next.js/React/TypeScript portfolio with performance, accessibility, and CI quality gates.
- [Kanban Board](https://kanbanboardclone.vercel.app/): Full-stack drag-and-drop task manager with authentication and persisted state. Source: [github.com/batistaDev1113/kanban-board](https://github.com/batistaDev1113/kanban-board).

## Contact

- Email: [yuniorbatista1113@gmail.com](mailto:yuniorbatista1113@gmail.com)
- LinkedIn: [linkedin.com/in/yunior-profile](https://www.linkedin.com/in/yunior-profile)
- GitHub: [github.com/batistaDev1113](https://github.com/batistaDev1113)
`;

export function GET(): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
