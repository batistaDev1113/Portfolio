'use client';

// Using custom glassmorphism card instead of Flowbite
import { m } from 'framer-motion';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import profile from '../public/picofme.webp';

const Hero = memo(() => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  const HERO_ABOUT_TEXT = `Hi, I'm Yunior—a product-minded Senior Frontend Engineer who turns complex ideas into intuitive, scalable digital experiences. I build modern web applications with React, Next.js, and TypeScript, bringing together strong UI/UX design, frontend architecture, and reliable product delivery.

I care about creating accessible, high-performance interfaces that are not only polished visually, but also maintainable and built to evolve. From reusable component systems to enterprise applications, I enjoy solving real product problems through thoughtful engineering and user-centered design.`;

  useEffect(() => {
    // Preload resume PDF for faster access
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/Yunior-Batista-Resume.pdf';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMotionPreference = () => {
      setShouldReduceMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Yunior-Batista-Resume.pdf';
    link.download = 'Yunior-Batista-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      className='z-50 relative w-full min-h-screen md:h-screen flex justify-center md:items-center items-start py-6 md:py-0 animated-background'
      data-testid='hero-section'
    >
      <m.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { delay: 0.5, ease: 'easeInOut' }
        }
        viewport={{ once: true }}
        className='w-full flex justify-center md:items-center items-start py-2 md:py-0'
      >
        <div className='hero-card w-11/12 lg:w-10/12 xl:w-2/3 2xl:w-3/5 p-5 sm:p-6 md:p-10 lg:p-12 overflow-visible max-h-none'>
          <div className='flex flex-col items-center'>
            <m.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { delay: 1, ease: 'easeInOut' }
              }
            >
              <div className='profile-image mb-6'>
                <Image
                  alt='Yunior Batista - Senior Frontend Engineer'
                  height={120}
                  src={profile}
                  width={120}
                  sizes='(max-width: 768px) 96px, 120px'
                  className='rounded-full shadow-2xl'
                  priority
                  quality={90}
                  placeholder='blur'
                />
              </div>
            </m.div>
            <h5 className='mb-2 text-3xl font-bold text-white drop-shadow-lg'>
              Yunior Batista
            </h5>
            <m.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { delay: 1.5, ease: 'easeInOut' }
              }
              className='my-4 md:my-5 text-center w-full'
            >
              <span
                data-testid='hero-title'
                className='text-transparent bg-linear-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-lg'
              >
                Senior Frontend Engineer
              </span>
            </m.div>
            <m.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { delay: 2, ease: 'easeInOut' }
              }
              className='w-full flex justify-center items-center'
            >
              <p
                data-testid='hero-bio'
                className='w-full max-w-2xl mx-auto text-sm sm:text-base text-white/90 text-center leading-6 drop-shadow-sm backdrop-blur-md bg-black/20 rounded-lg p-3 sm:p-4 border border-white/20 whitespace-pre-line'
              >
                {HERO_ABOUT_TEXT}
              </p>
            </m.div>
            <section className='grid w-full max-w-2xl grid-cols-1 md:grid-cols-2 gap-3 mt-3'>
              <a
                href='/resume'
                aria-label='View Resume as HTML'
                aria-describedby='resume-format-note'
                className='button-about'
              >
                View Resume
              </a>
              <button
                type='button'
                aria-label='Download Resume'
                aria-describedby='resume-format-note'
                className='button-about hover:cursor-pointer'
                onClick={handleDownloadResume}
              >
                Download Resume
                <FaFileDownload className='ml-2' />
              </button>
            </section>
            <p
              id='resume-format-note'
              className='mt-2 text-sm text-white/90 text-center max-w-2xl'
            >
              View Resume opens the accessible HTML version. Use Download Resume
              for the PDF file.
            </p>
          </div>
        </div>
      </m.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
