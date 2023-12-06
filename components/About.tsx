"use client";

import { Card } from "flowbite-react";
import { FaFileDownload } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { m, LazyMotion, domAnimation } from "framer-motion";

const About = () => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className='z-50 w-4/5 mx-auto dark:bg-gray-900 bg-white'
        id='about'
      >
        <h2 className='md:text-4xl font-semibold md:font-normal text-lg uppercase text-gray-500 text-center tracking-widest my-20'>
          About Me
        </h2>
        <div className='w-full'>
          <Card
            horizontal={true}
            className='flex w-full flex-col md:min-w-full lg:h-2/5 my-auto justify-center items-center'
          >
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, ease: "easeInOut" }}
              className='flex flex-col lg:flex-row align-middle justify-center gap-2 place-items-center'
            >
              <Image
                src='/picofme.png'
                alt='Yunior Batista'
                width={300}
                height={300}
                className='sm:px-10'
                loading='lazy'
                placeholder='blur'
                blurDataURL='data:image/png'
              />
              <div className='flex flex-col sm:px-10'>
                <h5 className='text-center md:text-2xl text-gray-500 lg:text-left mt-7 mb-5'>
                  A little bit about me
                </h5>
                <m.div
                  initial={{ y: 150, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                >
                  <p className='font-normal text-gray-700 dark:text-gray-400 leading-loose'>
                    Welcome to my web portfolio! I&apos;m Yunior Batista, a
                    passionate and experienced developer dedicated to creating
                    stunning and functional websites & web apps. With a deep
                    understanding of front-end, I strive to craft seamless
                    online experiences that leave a lasting impact. Throughout
                    my years in the industry, I have honed my skills in a
                    variety of technologies, including HTML5, CSS3, JavaScript,
                    and React. I possess a solid foundation in responsive design
                    principles, ensuring that every website/experience I create
                    is visually appealing and accessible across different
                    devices. In my free time I like to spend time with my
                    family, go fishing, watch movies, and play video games.
                  </p>
                </m.div>
                <section className='grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-3 grid-flow-col'>
                  <Link
                    href='/Yunior_Batista_Resume.pdf'
                    aria-label='Resume'
                    locale={false}
                    className='button-about'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Resume
                  </Link>
                  <Link
                    href='/Yunior_Batista_Resume.pdf'
                    aria-label='Download my CV'
                    locale={false}
                    download='/Yunior_Batista_Resume.pdf'
                    className='button-about'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Download my CV
                    <FaFileDownload className='ml-2' />
                  </Link>
                </section>
              </div>
            </m.div>
          </Card>
        </div>
      </m.div>
    </LazyMotion>
  );
};

export default About;
