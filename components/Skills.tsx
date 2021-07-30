import { FC, RefObject } from 'react'
import SectionHeader from './SectionHeader'
import Skill from './Skill'

const Skills: FC<{ skillsRef: RefObject<HTMLElement> }> = ({ skillsRef }) => {
  return (
    <section data-aos="fade-up" className="w-full md:mb-36" ref={skillsRef}>
      <SectionHeader title="skills" />
      <div className="px-10 my-10">
        <Skill title="ReactJS" url="/images/logos/react.png" proficiency={8} />
        <Skill title="NextJS" url="/images/logos/next.png" proficiency={8} />
        <Skill
          title="Typescript"
          url="/images/logos/typescript.png"
          proficiency={8}
        />
        <Skill title="NodeJS" url="/images/logos/node.png" proficiency={8} />
        <Skill
          title="GraphQL"
          url="/images/logos/graphql.png"
          proficiency={7}
        />
        <Skill
          title="PostgreSQL"
          url="/images/logos/postgresql.png"
          proficiency={5}
        />
      </div>
    </section>
  )
}

export default Skills
