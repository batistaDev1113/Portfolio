'use client';

import Link from 'next/link';
import { memo, useEffect } from 'react';
import { FaExternalLinkAlt, FaGithub, FaTimes } from 'react-icons/fa';

type ProjectModalProps = {
  openModal: boolean;
  technologies: string[];
  githubLink: string;
  liveDemoLink: string;
  setOpenModal: (openModal: boolean) => void;
};

const ProjectModal = memo(
  ({
    openModal,
    setOpenModal,
    technologies,
    githubLink,
    liveDemoLink,
  }: ProjectModalProps) => {
    // Handle scroll lock without hiding scrollbar
    useEffect(() => {
      if (openModal) {
        // Get scrollbar width to prevent layout shift
        const scrollBarWidth =
          window.innerWidth - document.documentElement.clientWidth;

        // Lock scroll and compensate for scrollbar width
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        // Handle escape key
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            setOpenModal(false);
          }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          document.removeEventListener('keydown', handleEscape);
        };
      }
    }, [openModal, setOpenModal]);

    if (!openModal) return null;

    return (
      <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
        {/* Backdrop */}
        <div
          className='absolute inset-0 bg-black/50 backdrop-blur-sm'
          onClick={() => setOpenModal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenModal(false);
            }
          }}
          role='button'
          tabIndex={0}
          aria-label='Close modal'
        />

        {/* Modal */}
        <div className='relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden glassmorphism-modal'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Project Technologies
            </h2>
            <button
              onClick={() => setOpenModal(false)}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200'
              aria-label='Close modal'
            >
              <FaTimes className='w-5 h-5 text-gray-500 dark:text-gray-400' />
            </button>
          </div>

          {/* Body */}
          <div className='p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
            {/* Technologies Section */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Technologies Used
              </h3>
              <div className='flex flex-wrap gap-2'>
                {technologies.map((technology, index) => (
                  <span
                    key={index}
                    className='tech-tag text-gray-900 dark:text-white px-3 py-1.5 text-sm font-medium'
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Project Links
              </h3>

              <div className='space-y-3'>
                {/* GitHub Link */}
                <Link
                  href={githubLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200 group'
                >
                  <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-600 dark:to-gray-500 rounded-full'>
                    <FaGithub className='w-5 h-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      View Source Code
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Check out the repository on GitHub
                    </p>
                  </div>
                  <FaExternalLinkAlt className='w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
                </Link>

                {/* Live Demo Link */}
                <Link
                  href={liveDemoLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 rounded-xl transition-colors duration-200 group border border-blue-200 dark:border-blue-800'
                >
                  <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'>
                    <FaExternalLinkAlt className='w-4 h-4 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      View Live Project
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      See the project in action
                    </p>
                  </div>
                  <FaExternalLinkAlt className='w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProjectModal.displayName = 'ProjectModal';

export default ProjectModal;
