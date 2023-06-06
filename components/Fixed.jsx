import Image from "next/image";
import iphone from "../public/projects-images/fixed-page/iphone13.png";
import ipad from "../public/projects-images/fixed-page/ipad.png";
import laptop from "../public/projects-images/fixed-page/laptop.png";
import mac from "../public/projects-images/fixed-page/mac-desktop.png";

export const IMAGES = [iphone, ipad, laptop, mac];

const Fixed = () => {
  return (
    <div className="hidden sticky top-2 bottom-0 sm:flex justify-center align-center flex-wrap h-4/5 w-4/5 my-20 z-auto">
      {IMAGES &&
        IMAGES.map((image, index) => (
          <div key={index} className="w-1/4 h-2/3 relative">
            <Image
              alt="image"
              src={image}
              width={400}
              height={300}
              loading="lazy"
            />
          </div>
        ))}
    </div>
  );
};

export default Fixed;
