import { FC, RefObject } from "react";
import SectionHeader from "./SectionHeader";
import Skill from "./Skill";

const Skills: FC<{ skillsRef: RefObject<HTMLElement> }> = ({ skillsRef }) => {
  return (
    <section
      data-aos="fade-up"
      className="w-full mb-24 md:mb-36"
      ref={skillsRef}
    >
      <SectionHeader title="skills" />
      <div className="px-10 my-10">
        {[
          {
            title: "ReactJS",
            url: "/images/logos/react.png",
            proficiency: 8,
            key: `1R`,
          },
          {
            title: "NextJS",
            url: "/images/logos/next.png",
            proficiency: 8,
            key: `2N`,
          },
          {
            title: "Typescript",
            url: "/images/logos/typescript.png",
            proficiency: 8,
            key: `3T`,
          },
          {
            title: "NodeJS",
            url: "/images/logos/node.png",
            proficiency: 8,
            key: `4N`,
          },
          {
            title: "GraphQL",
            url: "/images/logos/graphql.png",
            proficiency: 7,
            key: `5G`,
          },
          {
            title: "PostgreSQL",
            url: "/images/logos/postgresql.png",
            proficiency: 5,
            key: `6p`,
          },
        ].map(({ title, url, proficiency, key }) => (
          <Skill key={key} title={title} url={url} proficiency={proficiency} />
        ))}
      </div>
    </section>
  );
};

export default Skills;
