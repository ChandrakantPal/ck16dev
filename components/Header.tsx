import { useEffect, useRef } from 'react'
import HeaderItem from './HeaderItem'
import Logo from './Logo'

const Header = ({ toggle, setToggle }) => {
  const headerRef = useRef<HTMLHeadElement>(null)
  useEffect(() => {
    // const sticky = headerRef.current
    let lastScrollTop = 0
    const scrollCallBack: any = window.addEventListener('scroll', () => {
      // console.log(window.screenY - window.pageYOffset)
      let st = window.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop) {
        // scroll down
        headerRef.current.classList.remove('sticky')
        headerRef.current.classList.remove('top-0')
      } else {
        // scroll up
        headerRef.current.classList.add('sticky')
        headerRef.current.classList.add('top-0')
      }
      lastScrollTop = st <= 0 ? 0 : st
      console.log(
        { st, lastScrollTop },
        window.pageYOffset,
        document.documentElement.scrollTop
      )
    })
    return () => {
      window.removeEventListener('scroll', scrollCallBack)
    }
  }, [])
  return (
    <header
      ref={headerRef}
      className="z-50 w-full h-20 p-4 bg-black border-b border-gray-700"
    >
      <nav className="flex flex-wrap items-center justify-between h-full">
        <Logo />
        {/* <div className="w-full my-4 border-t border-dashed md:hidden" /> */}
        <div className="items-center justify-center hidden my-2 md:flex md:m-0">
          <HeaderItem title="about" />
          <HeaderItem title="skills" />
          <HeaderItem title="work" />
          <HeaderItem title="contact" />
        </div>
        <button
          className="px-4 py-2 text-lg text-center border border-white rounded-lg w-14 focus:outline-none md:hidden focus:border-green-700"
          onClick={() => setToggle((prevState) => !prevState)}
        >
          {toggle ? <span>x</span> : <span>{'>'}_</span>}
        </button>
      </nav>
    </header>
  )
}

export default Header
