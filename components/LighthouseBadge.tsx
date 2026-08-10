import { FaTachometerAlt } from 'react-icons/fa';

type LighthouseBadgeProps = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

// Proof-of-work Lighthouse badge. Scores reflect the last mobile audit of the
// live site (via PageSpeed Insights); update them after any significant
// change or a failing Core Web Vitals gate (see AGENTS.md).
const LighthouseBadge = ({
  performance,
  accessibility,
  bestPractices,
  seo,
}: LighthouseBadgeProps) => {
  const scores = [
    { label: 'Perf', value: performance },
    { label: 'A11y', value: accessibility },
    { label: 'Best practices', value: bestPractices },
    { label: 'SEO', value: seo },
  ];

  return (
    <div
      className='inline-flex items-center gap-3 rounded-full border border-primary-200 bg-primary-50/60 px-4 py-2 dark:border-border dark:bg-surface'
      aria-label={`Lighthouse scores — Performance ${performance}, Accessibility ${accessibility}, Best practices ${bestPractices}, SEO ${seo} out of 100`}
    >
      <FaTachometerAlt
        className='h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300'
        aria-hidden='true'
      />
      <span className='font-mono text-xs uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400'>
        Lighthouse
      </span>
      <span className='hidden h-4 w-px bg-gray-300 dark:bg-gray-600 sm:block' />
      <ul className='flex items-center gap-2 font-mono text-xs'>
        {scores.map(({ label, value }) => (
          <li
            key={label}
            className='flex items-center gap-1'
            title={`${label}: ${value}/100`}
          >
            <span className='text-gray-600 dark:text-gray-400'>{label}</span>
            <span className='font-semibold text-gray-800 dark:text-gray-100'>
              {value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LighthouseBadge;
