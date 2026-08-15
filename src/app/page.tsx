import About from "@/components/About";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";
import Skills from "@/components/Skills";

const Home = () => (
  <>
    <Header />
    <main className="site-shell">
      <Introduction />
      <About />
      <Skills />
      <Contact />
    </main>
  </>
);

export default Home;
