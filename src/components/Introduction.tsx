/* eslint-disable react/display-name */
import { forwardRef } from "react";
import Typist from "react-typist";

const Introduction = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section
      className="flex flex-col items-center justify-center w-full h-200 lg:h-screen"
      ref={ref}
    >
      <div className="w-full h-full p-6 mt-20 text-left md:p-14 lg:p-20">
        <Typist cursor={{ show: false }}>
          <p className="mt-1 text-lg text-green-400 md:text-xl">Hi, I am</p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={1000} />
          <p className="mt-6 text-3xl font-semibold text-gray-400 md:text-4xl lg:text-6xl">
            Chandrakant Pal.
          </p>
        </Typist>
        <Typist cursor={{ show: false }}>
          <Typist.Delay ms={2500} />
          <p className="mt-1 text-3xl font-semibold text-gray-500 md:text-4xl lg:text-6xl">
            I build things on the web.
          </p>
          <div className="w-full">
            <p className="mt-8 text-lg text-gray-500 md:text-xl">
              I am Web Developer based out of India. <br /> Tech enthusiast,
              constantly learning some new tech out there.
              <br /> History buff,
              <br /> Movie buff.
            </p>
          </div>
        </Typist>
      </div>
    </section>
  );
});

export default Introduction;
