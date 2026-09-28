import { skillGroups } from "@/config/skills";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const Skills = () => (
  <section id="skills" className="w-full mb-24 md:mb-36">
    <SectionHeader title="skills" />
    <div className="px-10 my-10 space-y-8 md:space-y-12">
      {skillGroups.map(({ title, items }) => (
        <Reveal key={title} direction="right">
          <div className="flex flex-col gap-2 md:flex-row md:gap-10">
            <h3 className="text-accent md:w-56 md:shrink-0 md:text-xl">
              {title}
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {items.map((item) => (
                <li key={item} className="text-muted md:text-xl">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Skills;
