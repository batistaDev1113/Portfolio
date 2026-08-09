// Static skills strip + toolbox marquee. Pure CSS motion (no JS), so it
// renders server-side with zero client JS on the critical path.
import { FaAccessibleIcon, FaCode, FaReact, FaMobileAlt } from 'react-icons/fa';
import LighthouseBadge from './LighthouseBadge';

const TOOLBOX = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Redux',
  'React Query',
  'Zustand',
  'Node.js',
  'Playwright',
  'Jest',
  'Storybook',
  'HTML',
  'CSS',
  'Accessibility (a11y)',
  'Git',
  'CI / CD',
  'Vercel',
];

const SKILLS = [
  {
    title: 'Frontend Architecture',
    description:
      'Scalable React and Next.js apps with component systems, typed contracts, and clean data layers that stay maintainable as they grow.',
    icon: FaReact,
  },
  {
    title: 'Accessibility & Standards',
    description:
      'WCAG-minded interfaces — semantic HTML, robust focus management, and CSS-first animations that respect reduced-motion preferences.',
    icon: FaAccessibleIcon,
  },
  {
    title: 'Performance & Delivery',
    description:
      'Core Web Vitals as a first-class concern: lazy loading, code-splitting, and measured Lighthouse budgets shipped through CI.',
    icon: FaCode,
  },
  {
    title: 'Quality Tooling',
    description:
      'TypeScript strictness, unit + end-to-end coverage with Jest and Playwright, and a CI pipeline that reviews every PR before it lands.',
    icon: FaMobileAlt,
  },
];

const Toolbox = () => {
  return (
    <section
      id='skills'
      className='w-full max-w-7xl mx-auto my-24 px-4 scroll-mt-20 relative z-50'
      aria-label='Skills and toolbox'
    >
      <div className='flex flex-col items-center mb-16'>
        <p className='eyebrow'>// 01 · Skills</p>
        <h2 className='fluid-title text-gray-900 dark:text-white mt-4 text-center'>
          How I build
        </h2>
        <p className='mt-4 max-w-2xl text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-6'>
          A practical toolkit for shipping reliable, human-first web products —
          from architecture and accessibility through performance and delivery.
        </p>
        <div className='mt-6'>
          <LighthouseBadge
            performance={87}
            accessibility={100}
            bestPractices={96}
            seo={100}
          />
        </div>
      </div>

      {/* Skill cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {SKILLS.map((skill) => (
          <div
            key={skill.title}
            className='card-elevated rounded-2xl p-6 relative overflow-hidden group transition-transform duration-300 hover:-translate-y-1.5'
          >
            <div className='w-11 h-11 rounded-xl bg-linear-to-br from-primary-600 to-violet-a flex items-center justify-center mb-5 text-white shadow-lg shadow-primary-500/20'>
              <skill.icon className='w-5 h-5' />
            </div>
            <h3 className='fluid-subtitle text-base font-semibold text-gray-900 dark:text-white'>
              {skill.title}
            </h3>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400 leading-6'>
              {skill.description}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbox rail — natively scrollable so every tool is reachable */}
      <div className='mt-16'>
        <p className='eyebrow mb-6 text-center'>// Toolbox</p>
        <div className='toolbox-rail' role='list'>
          {TOOLBOX.map((tool, i) => (
            <span key={i} className='toolbox-item' role='listitem'>
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Toolbox;
