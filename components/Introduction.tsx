import Typist from 'react-typist'

const Introduction = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen mx-auto">
      <div className="text-left whitespace-nowrap">
        <Typist cursor={{ show: false }}>
          <p className="mt-1 text-lg md:text-4xl">Hi,</p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={1000} />
          <p className="mt-1 text-lg md:text-4xl">I am</p>
          <p className="mt-1 text-xl md:text-6xl">Chandrakant Pal</p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={2500} />
          <p className="mt-1 text-xl md:text-6xl">I build things on the web.</p>
          <p className="mt-2 text-xl">
            I am software engineer based out Goa, India. <br /> Tech enthusiast,
            constantly learning some new tech out there.
            <br /> History buff,
            <br /> Movie buff.
          </p>
        </Typist>
      </div>
    </section>
  )
}

export default Introduction
