import SectionHeader from './SectionHeader'

const Contact = () => {
  return (
    <section className="w-full h-auto">
      <SectionHeader title="contact" />
      <h1 className="mt-4 text-center text-gray-500 tex-xl md:text-2xl">
        Get in touch with me
      </h1>
      <div className="flex items-center justify-center h-40">
        <a href="https://github.com/ChandrakantPal" target="_blank">
          <img
            src="/images/logos/github.png"
            className="object-contain w-16 mx-4 filter invert"
          />
        </a>
        <a href="https://www.linkedin.com/in/chandrakant-pal" target="_blank">
          <img
            src="/images/logos/linkedin.png"
            className="object-contain w-16 mx-4"
          />
        </a>
      </div>
    </section>
  )
}

export default Contact
