'use client';

import { Button, Modal } from 'flowbite-react';
import Link from 'next/link';

type ProjectModalProps = {
  openModal: boolean;
  technologies: string[];
  githubLink: string;
  liveDemoLink: string;
  setOpenModal: (openModal: boolean) => void;
};

export default function ProjectModal({
  openModal,
  setOpenModal,
  technologies,
  githubLink,
  liveDemoLink,
}: ProjectModalProps) {
  const modalPlacement = 'center';
  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        position={modalPlacement}
        className='duration-900 ease-in-out'
      >
        <Modal.Header>Technologies Used</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <section className='flex flex-wrap gap-2'>
              {technologies.map((technology) => (
                <Button
                  outline
                  key={technology}
                  className='text-sm'
                  gradientDuoTone='purpleToBlue'
                >
                  {technology}
                </Button>
              ))}
            </section>
            <section>
              <p className='font-normal text-gray-700 dark:text-gray-400 mt-5 mb-5'>
                Github Repo:{' '}
                <Button outline gradientDuoTone='purpleToBlue'>
                  <Link href={githubLink}>Click to visit Github Repo</Link>
                </Button>
              </p>
              <p className='font-normal text-gray-700 dark:text-gray-400 mt-5 mb-5'>
                Visit the live project:{' '}
                <Button outline gradientDuoTone='purpleToBlue'>
                  <Link href={liveDemoLink}>Click to visit live project</Link>
                </Button>
              </p>
            </section>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
