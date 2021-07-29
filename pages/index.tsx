import Head from 'next/head'
import { useEffect, useState } from 'react'
import aos from 'aos'
import About from '../components/About'
import Contact from '../components/Contact'
import Header from '../components/Header'
import Introduction from '../components/Introduction'
import SideDrawer from '../components/SideDrawer'
import Skills from '../components/Skills'
import Work from '../components/Work'

export default function Home() {
  const [menuToggle, setMenuToggle] = useState(false)
  useEffect(() => {
    aos.init({
      offset: 400,
      duration: 1000,
    })
  }, [])
  return (
    <div>
      <Head>
        <title>ck16dev</title>
        <meta name="description" content="Chandrakant Pal frontend developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header toggle={menuToggle} setToggle={setMenuToggle} />
      {menuToggle && <SideDrawer setToggle={setMenuToggle} />}
      <main className="container mx-auto">
        <Introduction />
        <About />
        <Skills />
        <Work />
        <Contact />
      </main>
    </div>
  )
}
