'use client';
import { Button, Card } from 'flowbite-react';
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
        <div className='dark:bg-transparent w-full hover:cursor-pointer flex justify-center'>
          <Card className='w-full max-w-sm flowbite-card hover:shadow-xl hover:shadow-slate-600 transition duration-500 ease-in-out'>
            <Image
              src={imageUrl || '/No-Image-Placeholder.svg'}
              width={400}
              height={250}
              alt={imageUrl ? 'Project image' : 'No image available'}
              className='image w-full object-cover rounded-t-lg !h-48'
              style={{ height: '12rem' }}
              loading='lazy'
              placeholder='blur'
              blurDataURL='data:image/png'
              fetchPriority='low'
            />
            <div className='p-4 flex flex-col justify-between h-44'>
              <div>
                <h4 className='text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2'>
                  {name}
                </h4>
                <p className='font-normal text-gray-700 dark:text-gray-400 text-sm line-clamp-3'>
                  {description}
                </p>
              </div>
              <Button
                gradientDuoTone='purpleToBlue'
                size='sm'
                onClick={() => setOpenModal(!openModal)}
                className='mt-3'
              >
                More Details
              </Button>
            </div>
          </Card>

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
