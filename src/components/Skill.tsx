import Image from "next/image";
import { FC } from "react";

interface SkillProp {
  title: string;
  url: string;
  proficiency: number;
}

const Skill: FC<SkillProp> = ({ title, url, proficiency }) => {
  const rating = `${"**".repeat(proficiency)}${"..".repeat(10 - proficiency)}`;
  return (
    <>
      <div
        data-aos="fade-right"
        className="flex flex-wrap items-start w-full space-x-8 mb-7 md:my-16 md:justify-start"
      >
        <div className="flex items-center">
          <div className="relative w-12 h-12 mr-2 md:w-16 md:h-16">
            <Image
              src={url}
              className="filter invert"
              alt={title}
              objectFit="contain"
              layout="fill"
            />
          </div>
          <p className="text-gray-500 md:text-2xl">{title}</p>
        </div>
        <p className="mt-1 text-gray-500 md:text-2xl md:mt-0">
          [{rating}] {proficiency}/10 and learning
        </p>
      </div>
    </>
  );
};

export default Skill;
