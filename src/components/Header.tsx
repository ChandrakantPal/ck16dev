import { FC, RefObject, useEffect, useRef } from 'react'
import HeaderItem from './HeaderItem'
import Logo from './Logo'

interface HeaderProps {
  toggle: boolean
  setToggle: (toggle: any) => void
  scrollToRef: (ref: RefObject<HTMLElement>) => void
  heroRef: RefObject<HTMLElement>
  aboutRef: RefObject<HTMLElement>
  skillsRef: RefObject<HTMLElement>
  workRef: RefObject<HTMLElement>
  contactRef: RefObject<HTMLElement>
}

const Header: FC<HeaderProps> = ({
  toggle,
  setToggle,
  scrollToRef,
  heroRef,
  aboutRef,
  skillsRef,
  workRef,
  contactRef,
}) => {
  const headerRef = useRef<HTMLHeadElement>(null)
  useEffect(() => {
    // const sticky = headerRef.current
    let lastScrollTop = 0
    const scrollCallBack: any = window.addEventListener('scroll', () => {
      // console.log(window.screenY - window.pageYOffset)
      let st = window.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop) {
        // scroll down
        headerRef.current.classList.remove('animate-slide')
        headerRef.current.classList.remove('sticky')
        headerRef.current.classList.remove('top-0')
      } else {
        // scroll up
        headerRef.current.classList.add('animate-slide')
        headerRef.current.classList.add('sticky')
        headerRef.current.classList.add('top-0')
      }
      lastScrollTop = st <= 0 ? 0 : st
    })
    return () => {
      window.removeEventListener('scroll', scrollCallBack)
    }
  }, [])
  return (
    <header
      ref={headerRef}
      className="z-50 w-full p-4 shadow-2xl bg-bunker bg-opacity-80"
    >
      <nav className="flex items-center justify-between">
        <div onClick={() => scrollToRef(heroRef)}>
          <Logo />
        </div>
        <div className="items-center justify-center flex-grow-0 hidden my-2 md:flex md:m-0">
          <div onClick={() => scrollToRef(aboutRef)}>
            <HeaderItem title="about" />
          </div>
          <div onClick={() => scrollToRef(skillsRef)}>
            <HeaderItem title="skills" />
          </div>
          <div onClick={() => scrollToRef(workRef)}>
            <HeaderItem title="work" />
          </div>
          <div onClick={() => scrollToRef(contactRef)}>
            <HeaderItem title="contact" />
          </div>
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
