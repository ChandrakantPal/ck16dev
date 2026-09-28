import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const About = () => (
  <section id="about" className="w-full mb-24 md:mb-36">
    <SectionHeader title="about" />
    <Reveal>
      <div className="flex flex-wrap-reverse items-start justify-center mt-10 md:flex-nowrap">
        <div className="w-full mx-10 my-5 md:px-20 md:w-1/2">
          <p className="text-muted md:text-xl">
            I&apos;m a senior software engineer working across the whole stack
            — TypeScript and React at the front, Node, tRPC and Postgres behind
            it. Most of that has been at startups, where the job is as much
            deciding what to build as building it. I care most about the parts
            people actually feel: pages that load, interfaces you can drive from
            the keyboard, and states that never surprise anyone.
          </p>
          <p className="mt-4 text-muted md:text-xl">
            This site is where I keep the sharp tools. Press ⌘K.
          </p>
        </div>
        <div className="relative w-full mx-24 md:mx-10 md:w-1/2">
          <div className="relative aspect-9/16 w-44 md:w-56">
            <Image
              src="/images/me.jpg"
              className="object-contain rounded-lg shadow-xl saturate-0"
              fill
              sizes="(min-width: 768px) 14rem, 11rem"
              alt="That's me"
            />
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);

export default About;
