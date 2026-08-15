import About from "@/components/About";
import Contact from "@/components/Contact";
import Introduction from "@/components/Introduction";
import Skills from "@/components/Skills";

const Home = () => (
  <main className="site-shell">
    <Introduction />
    <About />
    <Skills />
    <Contact />
  </main>
);

export default Home;
