import SectionHeader from './SectionHeader'

const About = () => {
  return (
    <section className="w-full h-200">
      <SectionHeader title="about" />
      <div className="flex flex-wrap-reverse items-start justify-center mt-10 md:flex-nowrap">
        <div className="w-full mx-10 my-5 md:px-20 md:w-1/2">
          <p className="text-gray-500 md:text-2xl">
            It all started in 3rd year of college where my friend{' '}
            <a
              href="https://www.linkedin.com/in/gomesluis479/"
              className="text-green-700"
            >
              {'('}Luis{')'}
            </a>{' '}
            introduced me to web developement, and our finial year project also
            need us to make a web dashboard, so thats where it all began and now
            I really enjoy builing Products. I initially started as a frontend
            dev and now I do both frontend and backend.
          </p>
        </div>
        <div className="w-full mx-24 md:mx-10 md:w-1/2">
          <img
            src="/images/me.jpg"
            className="object-contain rounded-lg shadow-xl w-44 md:w-56 filter saturate-0"
          />
        </div>
      </div>
    </section>
  )
}

export default About
