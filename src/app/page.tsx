import type { Metadata } from "next";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Introduction from "@/components/Introduction";
import Skills from "@/components/Skills";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = { alternates: { canonical: "/" } };
import Work from "@/components/Work";

const Home = () => (
  <main className="site-shell">
    <StructuredData />
    <Introduction />
    <About />
    <Work />
    <Skills />
    <Contact />
  </main>
);

export default Home;
