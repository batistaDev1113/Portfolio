"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, Button } from "flowbite-react";
import ProjectModal from "./ProjectModal";
import { LazyMotion, domAnimation, m } from "framer-motion";

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
        transition={{ delay: 1, ease: "easeInOut", duration: 2 }}
        viewport={{ once: true }}
      >
        <div className='dark:bg-transparent w-full hover:cursor-pointer flex justify-center'>
          <Card
            className='w-full flowbite-card hover:shadow-xl hover:shadow-slate-600 transition duration-500 ease-in-out'
            horizontal
          >
            <Image
              src={imageUrl}
              width={500}
              height={500}
              alt='Project image'
              className='image max-h-200 rounded-t-md'
            />
            <div className='p-6 md:h-60 h-70 flex flex-col justify-around'>
              <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                {name}
              </h5>
              <p className='font-normal text-gray-700 dark:text-gray-400 mt-5 mb-5'>
                {description}
              </p>
              <Button
                gradientDuoTone='purpleToBlue'
                onClick={() => setOpenModal(!openModal)}
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
