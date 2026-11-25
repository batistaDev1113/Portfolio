'use client';
// Image-forward project cards. Featured = wide split; standard = 4/3 portrait
// with bottom gradient overlay (name + tech tags). Whole card links to the
// dedicated case-study route — no modal.
import Image from 'next/image';
import Link from 'next/link';
import { memo, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { Project as ProjectData } from '../types/project';

const emptySubscribe = () => () => {};

type ProjectProps = {
  featured?: boolean;
  order?: number;
  project: ProjectData;
};

const Project = memo(
  ({ project, featured = false, order = 0 }: ProjectProps) => {
    const { name, description, impact, imageUrl, technologies, slug } = project;
    const mounted = useSyncExternalStore(
      emptySubscribe,
      () => true,
      () => false
    );
    const { resolvedTheme } = useTheme();
    // Projects may ship theme-aware thumbnails (e.g. the Portfolio case has
    // dark/light screenshot variants); guard with `mounted` so SSR and initial
    // hydration match.
    const src =
      mounted && resolvedTheme === 'light'
        ? project.imageUrlLight || imageUrl
        : imageUrl;
    const href = `/projects/${slug}`;
    const revealDelay = {
      '--reveal-delay': `${order * 90}ms`,
    } as React.CSSProperties;

    return (
      <div className='w-full project-reveal' style={revealDelay}>
        {featured ? (
          /* Featured: landscape split, image-led */
          <Link
            href={href}
            className='group project-card featured-bleed w-full md:grid md:grid-cols-12 md:min-h-72 flex flex-col'
            aria-label={`View case study for ${name}`}
          >
            <div className='project-image-overlay aspect-[16/10] md:col-span-7 md:aspect-auto md:h-full'>
              <Image
                src={src || '/No-Image-Placeholder.svg'}
                width={800}
                height={450}
                alt={`${name} project screenshot`}
                className='w-full h-full object-cover'
                loading='lazy'
                sizes='(max-width: 768px) 100vw, 58vw'
                quality={80}
              />
              {/* Mobile visual overlay; the single accessible <h3> lives in the
                  text column (sr-only on mobile, visible at md+). */}
              <div
                aria-hidden='true'
                className='md:hidden absolute inset-x-0 bottom-0 p-5 pt-16 bg-linear-to-t from-black/85 via-black/45 to-transparent'
              >
                <span className='eyebrow text-white/70'>{'// Featured'}</span>
                <p className='mt-1 text-2xl font-bold tracking-tight text-white drop-shadow line-clamp-2'>
                  {name}
                </p>
              </div>
            </div>
            <div className='md:col-span-5 px-6 py-6 md:p-8 flex flex-col justify-center gap-4 relative'>
              <span className='hidden md:block eyebrow'>{'// Featured'}</span>
              <h3 className='sr-only md:not-sr-only fluid-subtitle text-2xl md:text-3xl font-bold tracking-tight text-ink-900 dark:text-white'>
                {name}
              </h3>
              <p className='text-ink-700 dark:text-ink-300 text-sm leading-relaxed line-clamp-4'>
                {description}
              </p>
              {impact && (
                <p className='inline-flex items-center gap-2 rounded-lg bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300 w-fit'>
                  <span aria-hidden='true'>▲</span>
                  {impact}
                </p>
              )}
              <div className='flex flex-wrap gap-2'>
                {technologies.slice(0, 5).map((tech, index) => (
                  <span key={index} className='tech-tag'>
                    {tech}
                  </span>
                ))}
              </div>
              <div className='flex items-center gap-4 mt-2'>
                <span className='project-cta'>Open case study</span>
                <FaExternalLinkAlt
                  className='w-3.5 h-3.5 text-primary-500'
                  aria-hidden='true'
                />
              </div>
            </div>
          </Link>
        ) : (
          /* Standard: 4/3 portrait, gradient overlay caption */
          <Link
            href={href}
            className='group project-card relative block w-full aspect-[4/3] overflow-hidden rounded-2xl'
            aria-label={`View case study for ${name}`}
            data-project-card
          >
            <div className='project-image-overlay w-full h-full bg-black'>
              <Image
                src={src || '/No-Image-Placeholder.svg'}
                width={400}
                height={300}
                alt={`${name} project screenshot`}
                className='w-full h-full object-contain object-[50%_35%]'
                loading='lazy'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                quality={75}
              />
            </div>

            {/* Bottom gradient + caption */}
            <div className='absolute inset-x-0 bottom-0 p-5 pt-16 bg-linear-to-t from-black/85 via-black/45 to-transparent'>
              <h3 className='text-lg font-bold tracking-tight text-white drop-shadow line-clamp-2'>
                {name}
              </h3>
              <div className='mt-2 flex flex-wrap gap-2'>
                {technologies.slice(0, 3).map((tech, index) => (
                  <span key={index} className='tag-overlay'>
                    {tech}
                  </span>
                ))}
              </div>
              {impact && (
                <p className='mt-2 text-xs font-semibold text-white/90 trivia-tag'>
                  ▲ {impact}
                </p>
              )}
            </div>

            {/* Corner glyph */}
            <div
              className='absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              aria-hidden='true'
            >
              <FaExternalLinkAlt className='w-4 h-4' />
            </div>
          </Link>
        )}
      </div>
    );
  }
);

Project.displayName = 'Project';

export default Project;
