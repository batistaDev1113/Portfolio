"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "/public/heroBackground.webp";
import { FaFileDownload } from "react-icons/fa";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Skeleton from "../components/Skeleton";
import { Card } from "flowbite-react";
import profile from "/public/picofme.webp";

const Hero = () => {
  const [mounted, setMounted] = useState<Boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton />;

  return (
    <LazyMotion features={domAnimation}>
      <section
        style={{
          backgroundImage: `url(${heroImage.src})`,
        }}
        className='z-50 relative w-full h-screen items-center justify-center flex bg-no-repeat bg-center bg-auto md:bg-fixed'
        data-testid='hero-section'
      >
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          className='w-full flex justify-center items-center'
        >
          <Card className='w-11/12 lg:w-10/12 xl:w-1/2 items-center'>
            <div className='flex flex-col items-center'>
              <m.div
                initial={{ translateX: 120, opacity: 0 }}
                animate={{ x: -120 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, ease: "easeInOut" }}
              >
                <Image
                  alt=' Yunior Batista'
                  height='96'
                  src={profile}
                  width='96'
                  sizes='(max-width: 600px) 100vw, (max-width: 1400px) 50vw, 1000px'
                  className='mb-3 rounded-full shadow-lg'
                />
              </m.div>
              <h5 className='mb-1 text-2xl opacity-70 font-semibold text-gray-900 dark:text-white'>
                Yunior Batista
              </h5>
              <m.div
                initial={{ translateX: 120, opacity: 0 }}
                animate={{ x: -120 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5, ease: "easeInOut" }}
                className='my-5'
              >
                <span className='text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-2xl md:text-4xl font-semibold'>
                  Frontend Developer
                </span>
              </m.div>
              <m.div
                initial={{ translateX: 120, opacity: 0 }}
                animate={{ x: -120 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2, ease: "easeInOut" }}
              >
                <p className='text-sm text-gray-500 dark:text-gray-400 max-w-md text-center leading-6'>
                  I&apos;m a Frontend Developer with 5+ years of experience,
                  creating beautiful user experiences using technologies such as
                  React, Nextjs, TypeScript and JavaScript.
                </p>
              </m.div>
              <section className='grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-3 grid-flow-col'>
                <Link
                  href='/Yunior-Batista-Resume.pdf'
                  aria-label='View Resume'
                  locale={false}
                  className='button-about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Resume
                </Link>
                <Link
                  href='/Yunior-Batista-Resume.pdf'
                  aria-label='Download Resume'
                  locale={false}
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
          </Card>
        </m.div>
      </section>
    </LazyMotion>
  );
};

export default Hero;
