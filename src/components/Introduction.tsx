import { HOME_SECTION_ID } from "@/config/nav";
import Typewriter from "./Typewriter";

const Introduction = () => (
  <section
    id={HOME_SECTION_ID}
    className="flex flex-col items-center justify-center w-full h-200 lg:h-screen"
  >
    <div className="w-full h-full p-6 mt-20 text-left md:p-14 lg:p-20">
      <Typewriter
        text="Hi, I am"
        className="block mt-1 text-lg text-accent md:text-xl"
      />
      <Typewriter
        as="h1"
        text="Chandrakant Pal."
        startDelayMs={1000}
        className="block mt-6 text-3xl font-semibold text-muted md:text-4xl lg:text-6xl"
      />
      <Typewriter
        text="I build things on the web."
        startDelayMs={2500}
        className="block mt-1 text-3xl font-semibold text-muted md:text-4xl lg:text-6xl"
      />
      <p className="w-full mt-8 text-lg text-muted md:text-xl">
        Senior software engineer based in India.
        <br /> I work end to end — interfaces, APIs, and the data underneath.
        <br /> History buff,
        <br /> Movie buff.
      </p>
    </div>
  </section>
);

export default Introduction;
