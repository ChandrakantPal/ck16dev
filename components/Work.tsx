import Project from './Project'
import SectionHeader from './SectionHeader'

const Work = () => {
  return (
    <section className="w-full h-200">
      <SectionHeader title="work" />
      <div className="grid grid-cols-3 gap-5 mt-10">
        <Project
          link="https://helloworldtwitterclonegraphql.netlify.app/"
          title="Hello World (Twitter clone)"
          stack="React Node MongoDB GraphQL"
        />
      </div>
    </section>
  )
}

export default Work
