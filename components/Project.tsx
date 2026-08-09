'use client';
// Image-forward project cards. Featured = wide split; standard = 4/3 portrait
// with bottom gradient overlay (name + tech tags). Whole card links to the
// dedicated case-study route — no modal.
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { useTheme } from 'next-themes';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { Project as ProjectData } from '../types/project';

type ProjectProps = {
  featured?: boolean;
  order?: number;
  project: ProjectData;
};

const Project = memo(
  ({ project, featured = false, order = 0 }: ProjectProps) => {
    const { name, description, impact, imageUrl, technologies, slug } = project;
    const { resolvedTheme } = useTheme();
    // Projects may ship theme-aware thumbnails (e.g. the Portfolio case has
    // dark/light screenshot variants); default to the canonical imageUrl.
    const src =
      resolvedTheme === 'light' ? project.imageUrlLight || imageUrl : imageUrl;
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
            className='group project-card w-full md:grid md:grid-cols-12 md:min-h-72 flex flex-col'
            aria-label={`View case study for ${name}`}
          >
            <div className='project-image-overlay md:col-span-7 h-56 md:h-full'>
              <Image
                src={src || '/No-Image-Placeholder.svg'}
                width={800}
                height={450}
                alt={`${name} project screenshot`}
                className='w-full h-full object-cover'
                loading='eager'
                priority
                sizes='(max-width: 768px) 100vw, 58vw'
                quality={80}
              />
            </div>
            <div className='md:col-span-5 p-8 flex flex-col justify-center gap-4 relative'>
              <span className='eyebrow'>// Featured</span>
              <h3 className='fluid-subtitle text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
                {name}
              </h3>
              <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4'>
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
                <FaExternalLinkAlt className='w-3.5 h-3.5 text-primary-500' />
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
                className='w-full h-full object-contain object-center'
                loading='lazy'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                quality={75}
              />
            </div>

            {/* Bottom gradient + caption */}
            <div className='absolute inset-x-0 bottom-0 p-5 pt-16 bg-linear-to-t from-black/85 via-black/45 to-transparent'>
              <h4 className='text-lg font-bold tracking-tight text-white drop-shadow line-clamp-2'>
                {name}
              </h4>
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
            <div className='absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
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
