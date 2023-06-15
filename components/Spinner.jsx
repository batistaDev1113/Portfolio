"use client";

import Image from "next/image";
import loaderGif from "public/gg.gif";

const Spinner = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Image
        src={loaderGif}
        alt="loader"
        width="300"
        height="300"
        quality={95}
        priority={true}
      />
    </div>
  );
};

export default Spinner;
