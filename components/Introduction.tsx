import Typist from 'react-typist'
import Image from 'next/image'

const Introduction = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen">
      <div className="w-full h-full px-10 py-6 mt-20 text-left md:px-20 md:mt-52">
        <Typist cursor={{ show: false }}>
          <p className="mt-1 text-xl md:text-4xl">Hi,</p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={1000} />
          <p className="mt-1 text-xl md:text-4xl">I am</p>
          <p className="mt-1 text-2xl md:text-6xl">Chandrakant Pal</p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={2500} />
          <p className="mt-1 text-2xl md:text-6xl">
            I build things on the web.
          </p>
          <div className="w-full">
            <p className="mt-2 text-lg md:text-2xl">
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
