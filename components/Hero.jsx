"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, LazyMotion, domAnimation, m } from 'framer-motion'
import { Spinner } from 'flowbite-react'


const Hero = () => {
  const [ mounted, setMounted ] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Spinner size="xl" aria-label='Spinner loader' />
      <p className='dark:text-white text-gray-500 px-10'>Loading...</p>
    </div>
  )

  return (
    <section className="bg-white dark:bg-gray-900 relative w-full md:w-5/6 lg:w-4/5 lg:h-screen h-screen sm:mt-20 lg:mt-5 lg:my-none">
      <LazyMotion features={domAnimation}>
        <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, ease: 'easeInOut' }} viewport={{ once: true }} className="grid px-4 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 place-items-center align-baseline sm:align-middle h-4/5">
          <div className="mr-auto place-self-center lg:col-span-7 mb-10">
            <h1 className="mt-0 text-4xl md:text-5xl md:font-semibold tracking-wide leading-none xl:text-6xl text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text font-kaushan">Frontend Developer</h1>
            <p className="max-w-2xl mb-6 text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">{" "}
              Building beautiful, user-friendly experiences with cutting-edge
              technology.{" "}</p>
            <Link href="/resume/Yunior_Batista_Resume.pdf" className="inline-flex items-center justify-center px-8 py-3 text-base text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-indigo-500 dark:focus:ring-gray-800 hover:scale-110 duration-500 ease-in-out" target='_blank'>
              Resume
            </Link>
          </div>
          <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, ease: 'easeInOut' }} className="flex justify-center lg:mt-0 lg:col-span-5 lg:flex bg-slate-900 dark:bg-transparent rounded-lg shadow-lg hover:scale-105 duration-300 skew-x-6 md:w-full w-5/6 mx-auto drop-shadow-xl shadow-red-600">
            <Image src="/developer-illustration-removebg-preview.png" alt="mockup" width="300" height="300" className='image' loading='eager' placeholder='blur' blurDataURL='data:image/png' />
          </m.div>
        </m.div>
      </LazyMotion>
    </section>
  )
}

export default Hero