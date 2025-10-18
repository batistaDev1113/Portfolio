'use client';

// Using custom glassmorphism card instead of Flowbite
import { LazyMotion, m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import Skeleton from '../components/Skeleton';
import profile from '/public/picofme.webp';

// Preload critical resources
const loadFeatures = () =>
  import('framer-motion').then((res) => res.domAnimation);

const Hero = memo(() => {
  const [mounted, setMounted] = useState<Boolean>(false);
  const HERO_ABOUT_TEXT =
    "Hi, I'm Yunior – a passionate Senior Frontend developer who transforms ideas into elegant digital experiences. I specialize in creating modern web applications using Next.js, React, and TypeScript, with a keen eye for both beautiful UI/UX design and robust, scalable enterprise solutions. I love bringing creativity and technical excellence together in every project I build.";

  useEffect(() => {
    setMounted(true);

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

  if (!mounted) return <Skeleton />;

  return (
    <LazyMotion features={loadFeatures} strict>
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
          <div className='hero-card w-11/12 lg:w-10/12 xl:w-1/2 p-8 md:p-12'>
            <div className='flex flex-col items-center'>
              <m.div
                initial={{ translateX: 120, opacity: 0 }}
                animate={{ x: -120 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, ease: 'easeInOut' }}
              >
                <div className='profile-image mb-6'>
                  <Image
                    alt='Yunior Batista - Senior Frontend Developer'
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
                initial={{ translateX: 120, opacity: 0 }}
                animate={{ x: -120 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5, ease: 'easeInOut' }}
                className='my-5 text-center w-full'
              >
                <span className='text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-2xl md:text-3xl font-semibold drop-shadow-lg'>
                  Senior Frontend Developer
                </span>
              </m.div>
              <m.div
                initial={{ translateX: 120, opacity: 0 }}
                animate={{ x: -120 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2, ease: 'easeInOut' }}
              >
                <p className='text-base text-white/85 max-w-lg text-center leading-6 drop-shadow-sm backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10'>
                  {HERO_ABOUT_TEXT}
                </p>
              </m.div>
              <section className='grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-3 grid-flow-col'>
                <Link
                  href='/Yunior-Batista-Resume.pdf'
                  aria-label='View Resume'
                  className='button-about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Resume
                </Link>
                <Link
                  href='/Yunior-Batista-Resume.pdf'
                  aria-label='Download Resume'
                  download='/Yunior-Batista-Resume.pdf'
                  className='button-about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Download Resume
                  <FaFileDownload className='ml-2' />
                </Link>
              </section>
            </div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
});

Hero.displayName = 'Hero';

export default Hero;
