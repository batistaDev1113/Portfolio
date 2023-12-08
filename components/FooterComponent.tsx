"use client";

import { Footer } from "flowbite-react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { RxCodesandboxLogo } from "react-icons/rx";

const FooterComponent = () => {
  return (
    <Footer
      container={true}
      className='relative mt-auto pt-0 rounded-t-none bg-transparent'
    >
      <div className='w-full'>
        <Footer.Divider />
        <div className='w-full flex justify-between lg:justify-evenly md:text-center'>
          <Footer.Copyright href='#' by='Yunior Batista' year={2023} />
          <div className='flex space-x-4 ml-8'>
            <Footer.Icon
              href='https://www.linkedin.com/in/yunior-batista-profile/'
              target='_blank'
              icon={BsLinkedin}
              aria-label="Link to Yunior's LinkedIn profile"
            />
            <Footer.Icon
              href='https://github.com/batistaDev1113'
              target='_blank'
              icon={BsGithub}
              aria-label="Link to Yunior's GitHub profile"
            />
            <Footer.Icon
              href='#'
              target='_blank'
              icon={RxCodesandboxLogo}
              aria-label="Link to Yunior's codesandbox profile"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
