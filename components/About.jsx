"use client"

import React, { useMe } from 'react'
import { Card, Avatar } from 'flowbite-react'
import Image from "next/image";
import profileImage from '../public/profile.png'
import { m, LazyMotion, domAnimation } from 'framer-motion'

const About = () => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} className="w-4/5 mx-auto" id="about">
        <h1 className="text-4xl uppercase text-gray-500 text-center tracking-widest my-20">About</h1>
        <div className="w-full">
          <Card
            horizontal={true}
            shadow="true"
            className="flex w-full flex-col md:min-w-full lg:h-2/5 my-auto justify-center items-center"
          >

            {/* avatar */}
            <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7, ease: 'easeInOut' }} className="flex flex-col xl:flex-row align-middle justify-center gap-2   place-items-center xl:place-items-end ">
              {/* <Avatar
                img="/profile.png"
                rounded={true}
                bordered={true}
                size="xl"
                alt="Yunior Batista"
                style={{ width: "100%" }}
                className='mx-auto px-10 lg:scale-140 scale-100'
              /> */}
              <Image src={profileImage} alt="Yunior Batista" width={300} height={300} className="sm:px-10 lg:scale-140 scale-100" loading="lazy" placeholder='blur' blurDataURL='data:image/png' />
              <div className="flex flex-col sm:px-10">
                <h5 className="text-2xl font-semibold text-gray-500 text-center lg:text-left mt-7 mb-5">
                  A little bit about me
                </h5>
                <m.div initial={{ x: 250, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease: 'easeInOut', delay: 0.5 }}>
                  <p className="font-normal text-gray-700 dark:text-gray-400 leading-loose">
                    Welcome to my web portfolio! I&apos;m Yunior Batista, a passionate and experienced developer dedicated to creating stunning and functional websites & web apps. With a deep understanding of front-end, I strive to craft seamless online experiences that leave a lasting impact.

                    Throughout my years in the industry, I have honed my skills in a variety of technologies, including HTML5, CSS3, JavaScript, and React. I possess a solid foundation in responsive design principles, ensuring that every website/experience I create is visually appealing and accessible across different devices.

                    In my free time I like to spend time with my family, go fishing, watch movies, and play video games.

                  </p>
                </m.div>
              </div>
            </m.div>

          </Card>
        </div >
      </m.div >
    </LazyMotion>
  )
}

export default About;