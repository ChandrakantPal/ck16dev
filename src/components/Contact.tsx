import Image from "next/image";
import SectionHeader from "./SectionHeader";

const socialLinks = [
  {
    href: "https://github.com/ChandrakantPal",
    label: "GitHub profile",
    icon: "/images/logos/github.png",
  },
  {
    href: "https://www.linkedin.com/in/chandrakant-pal",
    label: "LinkedIn profile",
    icon: "/images/logos/linkedin.png",
  },
];

const Contact = () => (
  <section id="contact" className="w-full">
    <SectionHeader title="contact" />
    <p className="mt-4 text-xl text-center text-muted md:text-2xl">
      Get in touch with me
    </p>
    <div className="flex items-center justify-center h-20 md:h-40">
      {socialLinks.map(({ href, label, icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <div className="relative w-10 mx-4 aspect-square md:w-16">
            <Image
              src={icon}
              className="object-contain invert"
              fill
              sizes="4rem"
              alt=""
            />
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default Contact;
