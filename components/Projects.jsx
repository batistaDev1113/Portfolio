import React from 'react'
import data from "../public/projects.json"
import Project from './Project';

const Projects = () => {
  const { projects } = data;
  return (
    <div className="bg-white w-4/5 mx-auto my-20 dark:bg-gray-900 z-50" id="projects">
      <h1 className=" w-full text-4xl uppercase text-gray-500 text-center my-20 tracking-widest">Projects</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6'>
        {projects.map(project => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

export default Projects