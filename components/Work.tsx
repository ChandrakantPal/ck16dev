import { FC, RefObject } from 'react'
import Project from './Project'
import SectionHeader from './SectionHeader'

const Work: FC<{ workRef: RefObject<HTMLElement> }> = ({ workRef }) => {
  return (
    <section data-aos="fade-up" className="w-full md:mb-36" ref={workRef}>
      <SectionHeader title="work" />
      <div className="flex flex-wrap grid-cols-3 grid-rows-2 gap-10 mt-10 md:grid">
        <Project
          link="https://helloworldtwitterclonegraphql.netlify.app/"
          title="Hello World (Twitter clone)"
          stack="React Node MongoDB GraphQL"
        />
        <Project
          link="https://contactsbookclient.netlify.app"
          title="Contacts Book"
          stack="React TypeScript Tailwind Node MongoDB GraphQL"
        />
        <Project
          link="https://workfloy-clone.netlify.app"
          title="WorkFlowy Clone"
          stack="React TypeScript Tailwind Node MongoDB GraphQL"
        />
        <Project
          link="https://netflixclonereact.netlify.app"
          title="Netflix Clone"
          stack="React"
        />
        <Project
          link="https://hulu-clone-next-typescript-tailwind.vercel.app/"
          title="Hulu Clone"
          stack="Next TypeScript Tailwind"
        />
      </div>
    </section>
  )
}

export default Work
