'use client';

// Using custom glassmorphism card instead of Flowbite
import { m } from 'framer-motion';
import Image from 'next/image';
import { memo, useEffect } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import profile from '../public/picofme.webp';

const Hero = memo(() => {
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

  return (
    <section
      className='z-50 relative w-full h-screen items-center justify-center flex animated-background'
      data-testid='hero-section'
    >
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, ease: 'easeInOut' }}
        viewport={{ once: true }}
        className='w-full flex justify-center items-center'
      >
        <div className='hero-card w-11/12 lg:w-10/12 xl:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-2rem)]'>
          <div className='flex flex-col items-center'>
            <m.div
              initial={{ x: 120, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, ease: 'easeInOut' }}
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
              initial={{ x: 120, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, ease: 'easeInOut' }}
              className='my-5 text-center w-full'
            >
              <span
                data-testid='hero-title'
                className='text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-2xl md:text-3xl font-semibold drop-shadow-lg'
              >
                Senior Frontend Engineer
              </span>
            </m.div>
            <m.div
              initial={{ x: 120, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2, ease: 'easeInOut' }}
            >
              <p
                data-testid='hero-bio'
                className='text-base text-white/85 max-w-lg text-center leading-6 drop-shadow-sm backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 whitespace-pre-line'
              >
                {HERO_ABOUT_TEXT}
              </p>
            </m.div>
            <section className='grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-3 grid-flow-col'>
              <a
                href='/Yunior-Batista-Resume.pdf'
                aria-label='View Resume'
                className='button-about'
                target='_blank'
                rel='noopener noreferrer'
              >
                View Resume
              </a>
              <a
                href='/Yunior-Batista-Resume.pdf'
                aria-label='Download Resume'
                download='Yunior-Batista-Resume.pdf'
                className='button-about'
                target='_blank'
                rel='noopener noreferrer'
              >
                Download Resume
                <FaFileDownload className='ml-2' />
              </a>
            </section>
          </div>
        </div>
      </m.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
