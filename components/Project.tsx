'use client';
// Using custom glassmorphism cards and buttons
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import ProjectModal from './ProjectModal';

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
const Project = ({ project }: ProjectProps) => {
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
    <LazyMotion features={domAnimation}>
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
                alt={imageUrl ? 'Project image' : 'No image available'}
                className='w-full object-cover h-48'
                loading='lazy'
                placeholder='blur'
                blurDataURL='data:image/png'
                fetchPriority='low'
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

          <ProjectModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            technologies={technologies}
            githubLink={githubLink}
            liveDemoLink={liveDemoLink}
          />
        </div>
      </m.div>
    </LazyMotion>
  );
};

export default Project;
