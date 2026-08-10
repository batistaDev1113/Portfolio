'use client';

// Using custom glassmorphism card instead of Flowbite.
// Hero entrance animations are pure-CSS (@keyframes, see globals.css) so the
// LCP hero-bio text renders without requiring framer-motion to hydrate.
import Image from 'next/image';
import { memo } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import portraitDark from '../public/images/portrait-dark.jpg';
import portraitLight from '../public/images/portrait-light.jpg';
import SocialLinks from '../components/SocialLinks';

const Hero = memo(() => {
  const { resolvedTheme } = useTheme();
  // Light mode uses the black-background cartoon (it reads as a clean photo
  // against the light page); dark mode uses the light-gray-background cartoon.
  const portraitSrc = resolvedTheme === 'light' ? portraitLight : portraitDark;

  const HERO_ABOUT_TEXT = `Hi, I'm Yunior—a product-minded Senior Frontend Engineer. I turn complex ideas into intuitive, scalable web experiences with React, Next.js, and TypeScript, shipping accessible, high-performance interfaces that are as maintainable as they are polished.

I care about creating accessible, maintainable component systems that solve real product problems through thoughtful engineering and user-centered design.`;

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
      className='z-50 relative w-full min-h-screen flex items-center animated-background'
      data-testid='hero-section'
    >
      {/* Editorial grid: text left, portrait + meta right */}
      <div className='w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-4 sm:px-6 lg:px-8 py-20 md:py-16'>
        {/* Left: headline + single primary CTA */}
        <div className='lg:col-span-7 flex flex-col items-start text-left hero-anim hero-anim-1'>
          <p className='eyebrow hero-anim hero-anim-2'>
            &nbsp;// Senior Frontend Engineer
          </p>

          <h1 className='mt-6 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-white drop-shadow-lg fluid-title hero-anim hero-anim-2 leading-[1.05] whitespace-nowrap'>
            Yunior Batista
          </h1>

          <div className='my-6 hero-anim hero-anim-3'>
            <span
              data-testid='hero-title'
              className='text-transparent bg-linear-to-r from-blue-200 via-violet-200 to-indigo-200 bg-clip-text text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-lg'
            >
              Senior Frontend Engineer
            </span>
          </div>

          <p
            data-testid='hero-bio'
            className='w-full max-w-xl text-sm sm:text-base text-white/90 leading-6 drop-shadow-sm hero-anim hero-anim-4 whitespace-pre-line'
          >
            {HERO_ABOUT_TEXT}
          </p>

          <div className='mt-6 flex items-center gap-2 hero-anim hero-anim-4'>
            <span className='relative flex h-2.5 w-2.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
              <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400'></span>
            </span>
            <span className='text-sm text-white/70 font-mono'>
              Available for new opportunities
            </span>
          </div>

          {/* Single primary + quiet secondary CTA */}
          <section
            className='w-full flex flex-wrap items-center gap-4 mt-8'
            aria-label='Resume actions'
          >
            <a
              href='/resume'
              aria-label='View Resume'
              aria-describedby='resume-format-note'
              className='button-about m-0'
            >
              View Resume
            </a>
            <button
              type='button'
              aria-label='Download Resume PDF'
              aria-describedby='resume-format-note'
              className='button-quiet hover:cursor-pointer'
              onClick={handleDownloadResume}
            >
              <FaFileDownload className='mr-2' />
              Resume PDF
            </button>
          </section>
          <p
            id='resume-format-note'
            className='mt-4 text-sm text-white/70 text-left max-w-md'
          >
            HTML resume for screen readers; PDF for sharing.
          </p>
        </div>

        {/* Right: portrait + meta rail */}
        <div className='lg:col-span-5 flex lg:justify-end justify-center hero-anim hero-anim-2'>
          <div className='flex flex-col items-center lg:items-end gap-10'>
            <div className='hero-portrait profile-image'>
              <Image
                alt='Yunior Batista - Senior Frontend Engineer'
                height={120}
                src={portraitSrc}
                width={120}
                sizes='(max-width: 1023px) 120px, (max-width: 1279px) 160px, (max-width: 1535px) 200px, 240px'
                className='rounded-full shadow-2xl object-cover'
                priority
                quality={80}
                placeholder='blur'
              />
            </div>
            <div className='flex lg:flex-col items-center gap-6 w-full'>
              <SocialLinks
                className='text-white/60 hover:text-white'
                variant='icon'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40'>
        <span className='font-mono text-[11px] tracking-widest uppercase'>
          scroll
        </span>
        <span className='w-px h-8 bg-gradient-to-b from-white/40 to-transparent' />
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
