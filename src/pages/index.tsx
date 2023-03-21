import Head from "next/head";
import { RefObject, useEffect, useRef, useState } from "react";
import aos from "aos";
import About from "../components/About";
import Contact from "../components/Contact";
import Header from "../components/Header";
import Introduction from "../components/Introduction";
import SideDrawer from "../components/SideDrawer";
import Skills from "../components/Skills";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToRef = (ref: RefObject<HTMLElement>) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const [menuToggle, setMenuToggle] = useState(false);
  useEffect(() => {
    aos.init({
      offset: 400,
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <div>
      <Head>
        <title>ck16dev</title>
        <meta
          name="description"
          content="I'm Chandrakant Pal, a self-taught software developer who enjoys building user-centric products. I specialize in web development and have experience with technologies like ReactJS, NextJS, TypeScript, React Native, NodeJS, GraphQL, MongoDB, and PostgreSQL."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        toggle={menuToggle}
        setToggle={setMenuToggle}
        scrollToRef={scrollToRef}
        heroRef={heroRef}
        aboutRef={aboutRef}
        skillsRef={skillsRef}
        // workRef={workRef}
        contactRef={contactRef}
      />
      {menuToggle && (
        <SideDrawer
          setToggle={setMenuToggle}
          scrollToRef={scrollToRef}
          aboutRef={aboutRef}
          skillsRef={skillsRef}
          // workRef={workRef}
          contactRef={contactRef}
        />
      )}
      <main className="container mx-auto">
        <Introduction ref={heroRef} />
        <About ref={aboutRef} />
        <Skills ref={skillsRef} />
        {/* <Work workRef={workRef} /> */}
        <Contact ref={contactRef} />
      </main>
    </div>
  );
}
