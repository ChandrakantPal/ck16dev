/* eslint-disable react/display-name */
import Image from "next/image";
import { forwardRef } from "react";
import SectionHeader from "./SectionHeader";

const Contact = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section className="w-full" ref={ref}>
      <SectionHeader title="contact" />
      <h1 className="mt-4 text-center text-gray-500 tex-xl md:text-2xl">
        Get in touch with me
      </h1>
      <div className="flex items-center justify-center h-20 md:h-40">
        <a
          href="https://github.com/ChandrakantPal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative w-10 mx-4 cursor-pointer aspect-square md:w-16">
            <Image
              src="/images/logos/github.png"
              className="filter invert"
              layout="fill"
              objectFit="contain"
              alt="Github Profile"
            />
          </div>
        </a>
        <a
          href="https://www.linkedin.com/in/chandrakant-pal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative w-10 mx-4 cursor-pointer aspect-square md:w-16">
            <Image
              src="/images/logos/linkedin.png"
              className="filter invert"
              layout="fill"
              objectFit="contain"
              alt="LinkedIn Profile"
            />
          </div>
        </a>
      </div>
    </section>
  );
});

export default Contact;
