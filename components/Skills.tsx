import Skill from './Skill'

const Skills = () => {
  return (
    <section className="w-full h-screen">
      <h1 className="text-2xl text-left text-green-700 md:text-4xl">
        ./skills
      </h1>
      <hr className="my-2 border-gray-500" />
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
          proficiency={5}
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
