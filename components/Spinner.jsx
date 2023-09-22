"use client";

import Image from "next/image";
import loader from "public/loader.svg";

const Spinner = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-column">
      <Image
        src={loader}
        alt="loader"
        width="300"
        height="300"
        quality={95}
        priority={true}
      />
      <h3 className="font-kaushan font-semibold">Loading...</h3>
    </div>
  );
};

export default Spinner;
