import React, { lazy } from 'react'
import Image from 'next/image'

const Project = ({ project }) => {
  const { name, description, imageUrl, technologies, githubLink, liveDemoLink } = project

  return (
    <div className="dark:bg-transparent w-full">
      <div className="group h-auto w-70">
        <div className="grid grid-cols-3 relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className='relative col-span-6 m-5'>
            <Image className="w-full rounded-xl shadow-xl shadow-black/40" src={imageUrl} alt={name} width={3000} height={2500} loading="lazy" placeholder='blur' blurDataURL='data:image/png' />
          </div>

          <div className="absolute inset-0 h-auto w-full rounded-xl bg-gray-800 px-6 xl:px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div className="flex h-full flex-col text-left justify-center w-full">
              <h1 className="text-md md:text-2xl font-bold">{name}</h1>
              <p className="text-sm md:text-md">{description}</p>
              <ul className='list-disc'>
                {technologies.map(technology => (
                  <li key={technology} className="text-base">{technology}</li>
                ))}
              </ul>
              <a href={githubLink} target='_blank' className="mt-2 text-gray-800 rounded-md bg-green-300 py-1 px-2 text-sm hover:bg-green-500">Github Repo</a>
              <a href={liveDemoLink} target='_blank' className="mt-2 text-gray-800 rounded-md bg-green-300 py-1 px-2 text-sm hover:bg-green-500">Live Demo</a>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Project