import Typist from 'react-typist'
import Image from 'next/image'

const Introduction = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <div className="px-20 py-20 text-left">
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
          <div className="max-w-sm md:w-full">
            <p className="mt-2 text-xs md:text-xl">
              I am software engineer based out Goa, India. <br /> Tech
              enthusiast, constantly learning some new tech out there.
              <br /> History buff,
              <br /> Movie buff.
            </p>
          </div>
        </Typist>
      </div>
    </section>
  )
}

export default Introduction
