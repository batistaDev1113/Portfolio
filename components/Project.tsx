'use client';
// Image-forward project cards. Featured = wide split; standard = 4/3 portrait
// with bottom gradient overlay (name + tech tags). Whole card opens the modal —
// no separate footer button.
import Image from 'next/image';
import { lazy, memo, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

// Lazy load modal for better performance
const ProjectModal = lazy(() => import('./ProjectModal'));

export type ProjectProps = {
  featured?: boolean;
  project: {
    name: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    githubLink: string;
    liveDemoLink: string;
  };
};

const Project = memo(({ project, featured = false }: ProjectProps) => {
  const [openModal, setOpenModal] = useState(false);
  const {
    name,
    description,
    imageUrl,
    technologies,
    githubLink,
    liveDemoLink,
  } = project;

  const openModalKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenModal(true);
    }
  };

  return (
    <div className={featured ? 'w-full project-reveal' : 'project-reveal'}>
      {featured ? (
        /* Featured: landscape split, image-led */
        <div
          className='group project-card w-full hover:cursor-pointer md:grid md:grid-cols-12 md:min-h-72 flex flex-col'
          onClick={() => setOpenModal(true)}
          role='button'
          tabIndex={0}
          onKeyDown={openModalKey}
          aria-label={`View details for ${name}`}
        >
          <div className='project-image-overlay md:col-span-7 h-56 md:h-full'>
            <Image
              src={imageUrl || '/No-Image-Placeholder.svg'}
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
            <h4 className='fluid-subtitle text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
              {name}
            </h4>
            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4'>
              {description}
            </p>
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
        </div>
      ) : (
        /* Standard: 4/3 portrait, gradient overlay caption */
        <div
          className='group project-card relative w-full aspect-[4/3] hover:cursor-pointer overflow-hidden rounded-2xl'
          onClick={() => setOpenModal(true)}
          role='button'
          tabIndex={0}
          onKeyDown={openModalKey}
          aria-label={`View details for ${name}`}
          data-project-card
        >
          <div className='project-image-overlay absolute inset-0'>
            <Image
              src={imageUrl || '/No-Image-Placeholder.svg'}
              width={400}
              height={300}
              alt={`${name} project screenshot`}
              className='w-full h-full object-cover'
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
                <span
                  key={index}
                  className='tag-overlay'
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Corner glyph */}
          <div className='absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <FaExternalLinkAlt className='w-4 h-4' />
          </div>
        </div>
      )}

      {openModal && (
        <ProjectModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          name={name}
          description={description}
          technologies={technologies}
          githubLink={githubLink}
          liveDemoLink={liveDemoLink}
        />
      )}
    </div>
  );
});

Project.displayName = 'Project';

export default Project;