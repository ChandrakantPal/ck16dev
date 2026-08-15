import Image from "next/image";
import Reveal from "./Reveal";

interface SkillProps {
  title: string;
  url: string;
  proficiency: number;
}

const MAX_PROFICIENCY = 10;

const Skill = ({ title, url, proficiency }: SkillProps) => {
  const rating = `${"**".repeat(proficiency)}${"..".repeat(
    MAX_PROFICIENCY - proficiency,
  )}`;

  return (
    <Reveal direction="right">
      <div className="flex flex-wrap items-start w-full space-x-8 mb-7 md:my-16 md:justify-start">
        <div className="flex items-center">
          <div className="relative w-12 h-12 mr-2 md:w-16 md:h-16">
            <Image
              src={url}
              className="object-contain invert"
              alt={title}
              fill
              sizes="4rem"
            />
          </div>
          <p className="text-muted md:text-2xl">{title}</p>
        </div>
        <p className="mt-1 text-muted md:text-2xl md:mt-0">
          [{rating}] {proficiency}/{MAX_PROFICIENCY} and learning
        </p>
      </div>
    </Reveal>
  );
};

export default Skill;
