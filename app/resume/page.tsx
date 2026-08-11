export default function ResumePage() {
  return (
    <main className='min-h-screen px-6 py-12 md:px-10 lg:px-16'>
      <article className='mx-auto max-w-4xl space-y-10'>
        <header className='space-y-4'>
          <p className='text-sm uppercase tracking-wide text-ink-500'>
            Accessible Resume
          </p>
          <h1 className='text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-100'>
            Yunior Batista
          </h1>
          <p className='text-lg text-ink-700 dark:text-ink-300'>
            Senior Frontend Engineer
          </p>
          <p className='text-sm text-ink-700 dark:text-ink-300'>
            Kissimmee, FL | 407-785-5587 | yuniorbatista1113@gmail.com
          </p>
          <p className='text-sm text-ink-700 dark:text-ink-300'>
            linkedin.com/in/yuniorbatista | yuniorbatista.com
          </p>
          <p className='text-base text-ink-700 dark:text-ink-300'>
            Product-minded Software Engineer with 8+ years of experience
            building scalable, accessible, user-centered web applications and
            digital products. Expertise in frontend architecture, React,
            Next.js, TypeScript, Angular, Vue, and component-based application
            development.
          </p>
          <p className='text-sm text-ink-600 dark:text-ink-400'>
            Prefer a printable document? Return to the home page and use
            Download Resume to get the PDF.
          </p>
        </header>

        <section className='space-y-3'>
          <h2 className='text-2xl font-semibold text-ink-900 dark:text-ink-100'>
            Summary
          </h2>
          <p className='text-base leading-7 text-ink-700 dark:text-ink-300'>
            Combines strong UX/UI judgment with technical leadership across
            system design, reusable component systems, API integration, testing
            strategy, performance, and reliable production delivery.
          </p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-2xl font-semibold text-ink-900 dark:text-ink-100'>
            Technical Skills
          </h2>
          <div className='space-y-4 text-base text-ink-700 dark:text-ink-300'>
            <p>
              <span className='font-semibold'>Frontend:</span> React, Next.js,
              Angular, Vue.js, Vuetify, TypeScript, JavaScript, HTML5, CSS/SCSS,
              Tailwind CSS
            </p>
            <p>
              <span className='font-semibold'>Architecture and UI:</span>{' '}
              Frontend Architecture, Micro-Frontends, Component Libraries,
              Design Systems, Responsive Design, Web Accessibility, Web
              Performance, OpenLayers
            </p>
            <p>
              <span className='font-semibold'>Quality and Delivery:</span> Jest,
              React Testing Library, Unit Testing, Testing Strategy, Git,
              GitHub, Code Review, Agile Development
            </p>
            <p>
              <span className='font-semibold'>Backend and Integration:</span>{' '}
              REST APIs, JSON, C#, .NET, Blazor Server
            </p>
            <p>
              <span className='font-semibold'>Leadership:</span> Technical
              Leadership, System Design, Stakeholder Collaboration, Requirements
              Analysis, Technical Documentation
            </p>
          </div>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-ink-900 dark:text-ink-100'>
            Professional Experience
          </h2>

          <section className='space-y-2'>
            <h3 className='text-xl font-semibold text-ink-900 dark:text-ink-100'>
              Design Interactive - Software Engineer
            </h3>
            <p className='text-sm text-ink-600 dark:text-ink-400'>
              Remote | February 2024 - Present
            </p>
            <ul className='list-disc space-y-2 pl-6 text-base text-ink-700 dark:text-ink-300'>
              <li>
                Build and maintain secure, scalable enterprise web applications
                supporting mission-critical government workflows and strict
                compliance requirements.
              </li>
              <li>
                Serve as Technical Lead for an Angular-based project, providing
                technical direction across architecture, system design,
                implementation strategy, and testing approach.
              </li>
              <li>
                Define scalable frontend patterns and technical standards for
                component architecture, API integration, maintainability,
                security, quality, and long-term application evolution.
              </li>
              <li>
                Develop modular frontend capabilities using Vue.js, Vuetify,
                OpenLayers, SCSS/CSS, and micro-frontend architecture.
              </li>
              <li>
                Design and maintain reusable UI components, responsive
                experiences, and interactive geospatial map-based features.
              </li>
              <li>
                Collaborate with stakeholders, product, QA, and engineering
                teams to translate complex requirements into technical designs,
                implementation plans, and reliable releases.
              </li>
              <li>
                Expand end-to-end delivery ownership through C# and Blazor
                Server development, integrating component-based UI solutions
                with backend services.
              </li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h3 className='text-xl font-semibold text-ink-900 dark:text-ink-100'>
              Airship - Software Engineer
            </h3>
            <p className='text-sm text-ink-600 dark:text-ink-400'>
              Remote | January 2022 - November 2022
            </p>
            <ul className='list-disc space-y-2 pl-6 text-base text-ink-700 dark:text-ink-300'>
              <li>
                Developed and maintained 5+ responsive web applications using
                React, Next.js, TypeScript, JavaScript, HTML, CSS, and Tailwind
                CSS.
              </li>
              <li>
                Built reusable UI components and applied responsive design,
                accessibility, performance, and maintainability best practices
                across customer-facing applications.
              </li>
              <li>
                Implemented unit and component tests with Jest and React Testing
                Library, helping achieve approximately 90% code coverage and
                contributing to a 50% reduction in reported defects.
              </li>
              <li>
                Collaborated with developers, designers, and product managers in
                Agile teams to translate requirements into high-quality features
                and deliver under tight timelines.
              </li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h3 className='text-xl font-semibold text-ink-900 dark:text-ink-100'>
              Power Home Remodeling - UI Engineer
            </h3>
            <p className='text-sm text-ink-600 dark:text-ink-400'>
              Remote | May 2020 - January 2022
            </p>
            <ul className='list-disc space-y-2 pl-6 text-base text-ink-700 dark:text-ink-300'>
              <li>
                Developed and maintained reusable React components for an
                internal design system using JavaScript, TypeScript, Redux, and
                SCSS.
              </li>
              <li>
                Partnered with design and engineering teams to improve UI
                consistency, usability, and adoption of shared interface
                patterns across applications.
              </li>
              <li>
                Expanded the design system with new components, documentation,
                and frontend best practices, helping reduce design
                inconsistencies by 20%.
              </li>
              <li>
                Improved component quality and performance through refactoring,
                reusable patterns, and maintainable styling practices,
                contributing to a 17% improvement in internal quality and
                performance metrics.
              </li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h3 className='text-xl font-semibold text-ink-900 dark:text-ink-100'>
              Darden Restaurants - Frontend Developer
            </h3>
            <p className='text-sm text-ink-600 dark:text-ink-400'>
              Orlando, FL | June 2019 - April 2020
            </p>
            <ul className='list-disc space-y-2 pl-6 text-base text-ink-700 dark:text-ink-300'>
              <li>
                Developed and executed A/B tests using JavaScript, jQuery, and
                Adobe Target, contributing to a 20% increase in revenue through
                conversion optimization.
              </li>
              <li>
                Applied modern JavaScript practices and TypeScript typing to
                improve code reliability, maintainability, and implementation
                quality.
              </li>
              <li>
                Collaborated with design and digital teams to improve user
                experience and brand consistency, contributing to a 10% increase
                in client visits.
              </li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h3 className='text-xl font-semibold text-ink-900 dark:text-ink-100'>
              Visit Orlando - Frontend Developer
            </h3>
            <p className='text-sm text-ink-600 dark:text-ink-400'>
              Orlando, FL | January 2018 - April 2020
            </p>
            <ul className='list-disc space-y-2 pl-6 text-base text-ink-700 dark:text-ink-300'>
              <li>
                Refactored and optimized web-development workflows using HTML,
                JavaScript, and Agility CMS, improving development efficiency
                and supporting faster delivery cycles.
              </li>
              <li>
                Enhanced CMS-driven web pages with responsive UI improvements,
                purposeful animations, and SEO best practices, contributing to a
                30% increase in site visits.
              </li>
              <li>
                Collaborated with cross-functional teams to troubleshoot issues,
                improve cross-browser compatibility, and contribute to an 8%
                reduction in reported defects.
              </li>
            </ul>
          </section>
        </section>

        <section className='space-y-3'>
          <h2 className='text-2xl font-semibold text-ink-900 dark:text-ink-100'>
            Project
          </h2>
          <h3 className='text-xl font-semibold text-ink-900 dark:text-ink-100'>
            Portfolio Website
          </h3>
          <p className='text-sm text-ink-600 dark:text-ink-400'>
            Next.js, React, TypeScript, Tailwind CSS, Framer Motion, SendGrid
          </p>
          <ul className='list-disc space-y-2 pl-6 text-base text-ink-700 dark:text-ink-300'>
            <li>
              Designed and developed a responsive portfolio platform to showcase
              frontend engineering, UI/UX, and product-development work.
            </li>
            <li>
              Implemented a modern Next.js architecture with reusable
              components, theme support, accessible responsive layouts,
              animations, and a SendGrid-powered contact workflow.
            </li>
            <li>
              Optimized the experience for usability, performance, and
              professional presentation across desktop and mobile devices.
            </li>
          </ul>
        </section>

        <section className='space-y-3'>
          <h2 className='text-2xl font-semibold text-ink-900 dark:text-ink-100'>
            Education
          </h2>
          <p className='text-base text-ink-700 dark:text-ink-300'>
            Bachelor of Science in Computer Science
          </p>
          <p className='text-sm text-ink-600 dark:text-ink-400'>
            Florida State University | Tallahassee, FL
          </p>
        </section>
      </article>
    </main>
  );
}
