import { fetchData } from '../db/fetchData';
import Project from './Project';

type ProjectProps = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubLink: string;
  liveDemoLink: string;
};

const Projects = async () => {
  const projects: ProjectProps[] = (await fetchData()) || [];

  const [featured, ...rest] = projects;

  return (
    <div
      className='w-full max-w-7xl mx-auto my-20 px-4 z-50 scroll-mt-20'
      id='projects'
    >
      <div className='flex flex-col items-center mb-16'>
        <p className='eyebrow'>// 02 · Work</p>
        <h2 className='fluid-title text-gray-900 dark:text-white mt-4 text-center'>
          Selected Projects
        </h2>
        <p className='mt-4 max-w-2xl text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-6'>
          A few things I&apos;ve designed and built. Click any card to see the
          tech stack and live links.
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
          {rest.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
