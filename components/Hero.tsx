'use client';

// Using custom glassmorphism card instead of Flowbite.
// Hero entrance animations are pure-CSS (@keyframes, see globals.css) so the
// LCP hero-bio text renders without requiring framer-motion to hydrate.
import Image from 'next/image';
import { memo, useEffect } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import profile from '../public/picofme.webp';

const Hero = memo(() => {
  const HERO_ABOUT_TEXT = `Hi, I'm Yunior—a product-minded Senior Frontend Engineer. I turn complex ideas into intuitive, scalable web experiences with React, Next.js, and TypeScript, shipping accessible, high-performance interfaces that are as maintainable as they are polished.

I care about creating accessible, maintainable component systems that solve real product problems through thoughtful engineering and user-centered design.`;

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
      <div className='w-full flex justify-center md:items-center items-start py-2 md:py-0 hero-anim hero-anim-1'>
        <div className='hero-card w-11/12 lg:w-10/12 xl:w-2/3 2xl:w-3/5 p-5 sm:p-6 md:p-10 lg:p-12 overflow-visible max-h-none relative'>
          <div className='flex flex-col items-center text-center'>
            <div className='hero-anim hero-anim-2'>
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
            </div>

            <p className='eyebrow mb-3 hero-anim hero-anim-2'>
              // Hello, I&apos;m Yunior
            </p>

            <h1 className='mb-4 text-3xl font-bold text-white drop-shadow-lg fluid-title'>
              Yunior Batista
            </h1>

            <div className='my-2 md:my-3 text-center w-full hero-anim hero-anim-3'>
              <span
                data-testid='hero-title'
                className='text-transparent bg-linear-to-r from-blue-200 via-violet-200 to-indigo-200 bg-clip-text text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-lg'
              >
                Senior Frontend Engineer
              </span>
            </div>

            <p className='mt-1 text-sm sm:text-base text-white/70 font-mono hero-anim hero-anim-3'>
              Building accessible, high-performance web experiences
            </p>

            <div className='w-full flex justify-center items-center hero-anim hero-anim-4'>
              <p
                data-testid='hero-bio'
                className='w-full max-w-2xl mx-auto text-sm sm:text-base text-white/90 text-center leading-6 drop-shadow-sm backdrop-blur-md bg-black/20 rounded-lg p-3 sm:p-4 border border-white/20 whitespace-pre-line'
              >
                {HERO_ABOUT_TEXT}
              </p>
            </div>

            <div className='mt-4 flex items-center gap-2 hero-anim hero-anim-4'>
              <span className='relative flex h-2.5 w-2.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
                <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400'></span>
              </span>
              <span className='text-sm text-white/70 font-mono'>
                Available for new opportunities
              </span>
            </div>

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
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;