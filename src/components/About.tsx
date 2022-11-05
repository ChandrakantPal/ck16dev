import { FC, RefObject } from "react";
import SectionHeader from "./SectionHeader";

const About: FC<{ aboutRef: RefObject<HTMLElement> }> = ({ aboutRef }) => {
  return (
    <section
      data-aos="fade-up"
      className="w-full mb-24 md:mb-36"
      ref={aboutRef}
    >
      <SectionHeader title="about" />
      <div className="flex flex-wrap-reverse items-start justify-center mt-10 md:flex-nowrap">
        <div className="w-full mx-10 my-5 md:px-20 md:w-1/2">
          <p className="text-gray-500 md:text-xl">
            I am a self-taught software developer mostly focused on web
            development and web technologies in general, and building
            user-centric products with excellent user experience.
          </p>
          <p className="text-gray-400 md:text-xl"> Learn.Build.Repeat.</p>
        </div>
        <div className="w-full mx-24 md:mx-10 md:w-1/2">
          <img
            src="/images/me.jpg"
            className="object-contain rounded-lg shadow-xl w-44 md:w-56 filter saturate-0"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
