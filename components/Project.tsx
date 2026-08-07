'use client';
// Using custom glassmorphism cards and buttons
import Image from 'next/image';
import { lazy, memo, useState } from 'react';

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

  return (
    <div className={featured ? 'w-full project-reveal' : 'project-reveal'}>
      {featured ? (
        /* Featured: landscape on md+, stacked on mobile */
        <div
          className='project-card w-full hover:cursor-pointer md:grid md:grid-cols-2 md:min-h-72 flex flex-col'
          onClick={() => setOpenModal(true)}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setOpenModal(true)}
          aria-label={`View details for ${name}`}
        >
          <div className='project-image-overlay h-56 md:h-full'>
            <Image
              src={imageUrl || '/No-Image-Placeholder.svg'}
              width={800}
              height={450}
              alt={`${name} project screenshot`}
              className='w-full h-full object-cover'
              loading='eager'
              priority
              sizes='(max-width: 768px) 100vw, 50vw'
              quality={80}
            />
          </div>
          <div className='p-8 flex flex-col justify-center gap-4'>
            <span className='text-xs font-semibold uppercase tracking-widest text-indigo-400'>
              Featured Project
            </span>
            <h4 className='text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(true);
              }}
              className='modern-button w-fit mt-2 hover:cursor-pointer px-8'
            >
              View Details
            </button>
          </div>
        </div>
      ) : (
        /* Standard card */
        <div className='w-full max-w-sm hover:cursor-pointer h-full flex flex-col'>
          <div className='project-card w-full h-full flex flex-col'>
            <div className='project-image-overlay shrink-0'>
              <Image
                src={imageUrl || '/No-Image-Placeholder.svg'}
                width={400}
                height={250}
                alt={`${name} project screenshot`}
                className='w-full object-cover h-48'
                loading='lazy'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                quality={75}
              />
            </div>
            <div className='p-6 flex flex-col flex-1'>
              <div className='flex-1 space-y-3'>
                <h4 className='text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2'>
                  {name}
                </h4>
                <p className='font-normal text-gray-700 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed'>
                  {description}
                </p>
                <div className='flex flex-wrap gap-2 min-h-8 items-start'>
                  {technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className='tech-tag'>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setOpenModal(!openModal)}
                className='modern-button w-full shrink-0 mt-4 hover:cursor-pointer'
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal && (
        <ProjectModal
          openModal={openModal}
          setOpenModal={setOpenModal}
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
