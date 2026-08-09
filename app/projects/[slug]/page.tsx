import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import projects from '../../../data/projects.json';
import type { Project } from '../../../types/project';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Case Study`,
    description: project.impact,
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className='eyebrow'>{children}</p>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project: Project | undefined = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const {
    name,
    description,
    impact,
    imageUrl,
    technologies,
    githubLink,
    liveDemoLink,
    problem,
    approach,
    keyDecisions,
    outcome,
    improvements,
  } = project;

  return (
    <main className='flex min-h-screen w-full flex-col bg-light-surface dark:bg-night'>
      <div className='mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8'>
        <Link
          href='/#projects'
          className='inline-flex items-center gap-2 font-mono text-sm text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-300'
        >
          <FaArrowLeft className='h-3.5 w-3.5' />
          Back to work
        </Link>
        <span className='font-mono text-xs uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500'>
          Case Study
        </span>
      </div>

      <header className='mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-2'>
          <div>
            <SectionLabel>// Project</SectionLabel>
            <h1 className='fluid-title mt-4 text-gray-900 dark:text-white'>
              {name}
            </h1>
            <p className='mt-4 text-base leading-7 text-gray-700 dark:text-gray-300'>
              {description}
            </p>
            <p className='mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'>
              <span aria-hidden='true'>▲</span>
              {impact}
            </p>
            <div className='mt-6 flex flex-wrap gap-2'>
              {technologies.map((tech) => (
                <span key={tech} className='tech-tag'>
                  {tech}
                </span>
              ))}
            </div>
            <div className='mt-8 flex flex-wrap gap-4'>
              <a
                href={liveDemoLink}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-primary-600 to-violet-a px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:-translate-y-0.5'
              >
                <FaExternalLinkAlt className='h-3.5 w-3.5' />
                Live demo
              </a>
              {githubLink && (
                <a
                  href={githubLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-500 hover:text-primary-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-primary-300'
                >
                  <FaGithub className='h-4 w-4' />
                  Source
                </a>
              )}
            </div>
          </div>
          <div className='relative overflow-hidden rounded-2xl bg-light-surface/50 dark:bg-surface'>
            <Image
              src={imageUrl}
              alt={`${name} project preview`}
              width={1200}
              height={675}
              className='aspect-[16/9] w-full object-cover'
              priority
              sizes='(max-width: 1023px) 100vw, 50vw'
            />
          </div>
        </div>
      </header>

      <section className='mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
        <div className='space-y-12'>
          <div>
            <SectionLabel>// Problem</SectionLabel>
            <p className='mt-4 max-w-3xl text-lg leading-8 text-gray-700 dark:text-gray-300'>
              {problem}
            </p>
          </div>

          <div>
            <SectionLabel>// Approach</SectionLabel>
            <p className='mt-4 max-w-3xl text-lg leading-8 text-gray-700 dark:text-gray-300'>
              {approach}
            </p>
          </div>

          <div>
            <SectionLabel>// Key Decisions</SectionLabel>
            <ul className='mt-4 space-y-3'>
              {keyDecisions.map((decision) => (
                <li key={decision} className='flex gap-3'>
                  <span
                    className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500'
                    aria-hidden='true'
                  />
                  <span className='max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300'>
                    {decision}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel>// Outcome</SectionLabel>
            <p className='mt-4 max-w-3xl text-lg leading-8 text-gray-700 dark:text-gray-300'>
              {outcome}
            </p>
          </div>

          {improvements.length > 0 && (
            <div>
              <SectionLabel>// What I'd Improve Next</SectionLabel>
              <ul className='mt-4 space-y-3'>
                {improvements.map((improvement) => (
                  <li key={improvement} className='flex gap-3'>
                    <span
                      className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-a'
                      aria-hidden='true'
                    />
                    <span className='max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300'>
                      {improvement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
