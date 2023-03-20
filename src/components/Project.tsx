import Aos from "aos";
import Image from "next/image";
import { FC, useEffect } from "react";

interface ProjectProp {
  link: string;
  title: string;
  stack: string;
}

const Project: FC<ProjectProp> = ({ link, title, stack }) => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <a
      data-aos="fade-up"
      href={link}
      className="flex flex-col items-center justify-center w-full rounded-lg"
      target="_blank"
    >
      <div className="relative w-32 md:w-40 aspect-square">
        <Image
          src="/images/logos/project.png"
          layout="fill"
          objectFit="contain"
          alt={title}
        />
      </div>
      <p className="w-2/3 mt-2 text-sm text-center text-gray-500">{title}</p>
      <p className="w-2/3 mt-2 text-sm text-center text-gray-500">{stack}</p>
    </a>
  );
};

export default Project;
