import { skills } from "@/config/skills";
import SectionHeader from "./SectionHeader";
import Skill from "./Skill";

const Skills = () => (
  <section id="skills" className="w-full mb-24 md:mb-36">
    <SectionHeader title="skills" />
    <div className="px-10 my-10">
      {skills.map(({ title, iconUrl, proficiency }) => (
        <Skill
          key={title}
          title={title}
          url={iconUrl}
          proficiency={proficiency}
        />
      ))}
    </div>
  </section>
);

export default Skills;
