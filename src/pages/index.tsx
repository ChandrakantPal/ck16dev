import Head from "next/head";
import { Ref, RefObject, useEffect, useRef, useState } from "react";
import aos from "aos";
import About from "../components/About";
import Contact from "../components/Contact";
import Header from "../components/Header";
import Introduction from "../components/Introduction";
import SideDrawer from "../components/SideDrawer";
import Skills from "../components/Skills";
import Work from "../components/Work";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToRef = (ref: RefObject<HTMLElement>) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
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
        <meta name="description" content="Chandrakant Pal frontend developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        toggle={menuToggle}
        setToggle={setMenuToggle}
        scrollToRef={scrollToRef}
        heroRef={heroRef}
        aboutRef={aboutRef}
        skillsRef={skillsRef}
        workRef={workRef}
        contactRef={contactRef}
      />
      {menuToggle && (
        <SideDrawer
          setToggle={setMenuToggle}
          scrollToRef={scrollToRef}
          aboutRef={aboutRef}
          skillsRef={skillsRef}
          workRef={workRef}
          contactRef={contactRef}
        />
      )}
      <main className="container mx-auto">
        <Introduction heroRef={heroRef} />
        <About aboutRef={aboutRef} />
        <Skills skillsRef={skillsRef} />
        {/* <Work workRef={workRef} /> */}
        <Contact contactRef={contactRef} />
      </main>
    </div>
  );
}
