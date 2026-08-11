import { fetchData } from '../db/fetchData';
import Project from './Project';
import type { Project as ProjectData } from '../types/project';

const Projects = async () => {
  const projects: ProjectData[] = (await fetchData()) || [];

  const [featured, ...rest] = projects;

  return (
    <div
      className='w-full max-w-7xl mx-auto my-20 px-4 z-50 scroll-mt-20'
      id='projects'
    >
      <div className='flex flex-col items-center mb-16'>
        <p className='eyebrow'>// 02 · Work</p>
        <h2 className='fluid-title text-ink-900 dark:text-white mt-4 text-center'>
          Selected Projects
        </h2>
        <p className='mt-4 max-w-2xl text-center text-ink-600 dark:text-ink-400 text-sm sm:text-base leading-6'>
          A few things I&apos;ve designed and built. Each card links to a full
          case study of the problem, decisions, and outcome.
        </p>
      </div>

      {/* Featured project — full-width cinematic card */}
      {featured && (
        <div className='mb-10'>
          <Project project={featured} featured />
        </div>
      )}

      {/* Remaining projects — responsive 1/2/3-col, generic for any N */}
      {rest.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center items-stretch'>
          {rest.map((project, index) => (
            <Project key={project.id} project={project} order={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
