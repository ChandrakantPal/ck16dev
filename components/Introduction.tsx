import Typist from 'react-typist'

const Introduction = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full mx-auto h-96">
      <div className="text-left whitespace-nowrap">
        <Typist cursor={{ show: false }}>
          <p className="mt-1 text-4xl">Hi,</p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={1000} />
          <p className="mt-1 text-4xl">I am</p>
          <p className="mt-1 text-6xl">Chandrakant Pal</p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={2500} />
          <p className="mt-1 text-6xl">I build things on the web.</p>
        </Typist>
      </div>
    </section>
  )
}

export default Introduction
