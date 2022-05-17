import { FC, RefObject } from 'react'
import { Projects } from '../utils/project.config'
import Project from './Project'
import SectionHeader from './SectionHeader'

const Work: FC<{ workRef: RefObject<HTMLElement> }> = ({ workRef }) => {
  return (
    <section data-aos="fade-up" className="w-full mb-24 md:mb-36" ref={workRef}>
      <SectionHeader title="work" />
      <div className="flex flex-wrap grid-cols-3 grid-rows-2 gap-10 mt-10 md:grid">
        {Projects.map((project) => (
          <Project
            link={project.link}
            title={project.title}
            stack={project.stack}
          />
        ))}
      </div>
    </section>
  )
}

export default Work
