"use client";

import { Navbar } from "flowbite-react";
import { ModeToggle } from "./ModeToggle";

const Navigation = () => {
  return (
    <Navbar
      fluid={true}
      rounded={true}
      className='dark:bg-gray-900 w-full rounded-b-none lg:w-4/5'
    >
      <Navbar.Brand
        href='/'
        className='self-center text-2xl font-semibold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text md:text-4xl lg:text-3xl hover:text-teal-600'
      >
        Yunior B.
      </Navbar.Brand>
      <div className='flex space-x-8 items-center'>
        <ModeToggle />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className='uppercase'>
        <Navbar.Link
          href='#projects'
          role='link'
          aria-label='Some projects I have built'
        >
          <span className='pb-1 hover:text-teal-600 dark:hover:text-teal-300 hover:border-b-2  hover:border-indigo-500 hover:border-spacing-4'>
            Some Projects I&apos;ve Built
          </span>
        </Navbar.Link>
        <Navbar.Link href='#contact' role='link' aria-label='Contact me'>
          <span className='pb-1 hover:text-teal-600 dark:hover:text-teal-300 hover:border-b-2  hover:border-indigo-500 hover:border-spacing-4'>
            Contact Me
          </span>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
