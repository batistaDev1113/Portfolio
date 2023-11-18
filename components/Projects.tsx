import data from "../public/projects.json";
import Project from "./Project";

type ProjectPropsArray = {
  projects: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    githubLink: string;
    liveDemoLink: string;
  }[];
};

const Projects = () => {
  const { projects }: ProjectPropsArray = data;
  return (
    <div
      className='bg-white w-4/5 mx-auto my-20 dark:bg-gray-900 z-50'
      id='projects'
    >
      <h3 className='w-full text-lg md:text-4xl font-semibold md:font-normal uppercase text-gray-500 text-center my-20 tracking-widest'>
        Some Projects I&apos;ve Built
      </h3>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-6'>
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
