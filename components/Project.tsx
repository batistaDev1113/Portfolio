'use client';
// Using custom glassmorphism cards and buttons
import { LazyMotion, m } from 'framer-motion';
import Image from 'next/image';
import { lazy, memo, useState } from 'react';

// Lazy load modal for better performance
const ProjectModal = lazy(() => import('./ProjectModal'));

// Optimize animation features loading
const loadFeatures = () =>
  import('framer-motion').then((res) => res.domAnimation);

export type ProjectProps = {
  project: {
    name: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    githubLink: string;
    liveDemoLink: string;
  };
};
const Project = memo(({ project }: ProjectProps) => {
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
    <LazyMotion features={loadFeatures} strict>
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, ease: 'easeInOut', duration: 2 }}
        viewport={{ once: true }}
      >
        <div className='w-full max-w-sm hover:cursor-pointer'>
          <div className='project-card w-full'>
            <div className='project-image-overlay'>
              <Image
                src={imageUrl || '/No-Image-Placeholder.svg'}
                width={400}
                height={250}
                alt={`${name} project screenshot`}
                className='w-full object-cover h-48'
                loading='lazy'
                placeholder='blur'
                blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEtklidd7w=='
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                quality={75}
              />
            </div>
            <div className='p-6 flex flex-col h-auto min-h-[240px]'>
              <div className='flex-1 space-y-3 pb-4'>
                <h4 className='text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                  {name}
                </h4>
                <p className='font-normal text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed'>
                  {description}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className='tech-tag'>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setOpenModal(!openModal)}
                className='modern-button w-full flex-shrink-0'
              >
                View Details
              </button>
            </div>
          </div>

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
      </m.div>
    </LazyMotion>
  );
});

Project.displayName = 'Project';

export default Project;
