import { FC, RefObject } from 'react'
import HeaderItem from './HeaderItem'

interface SideDrawerProp {
  setToggle: (toggle: any) => void
  scrollToRef: (ref: RefObject<HTMLElement>) => void
  aboutRef: RefObject<HTMLElement>
  skillsRef: RefObject<HTMLElement>
  workRef: RefObject<HTMLElement>
  contactRef: RefObject<HTMLElement>
}

const SideDrawer: FC<SideDrawerProp> = ({
  setToggle,
  scrollToRef,
  aboutRef,
  skillsRef,
  workRef,
  contactRef,
}) => {
  return (
    <>
      <nav className="fixed right-0 z-20 w-40 h-screen md:hidden">
        <div className="flex flex-col items-center justify-around w-full h-full py-20 ml-auto border-l border-gray-900 shadow-inner bg-bunker">
          <div
            onClick={() => {
              setToggle(false)
              scrollToRef(aboutRef)
            }}
          >
            <HeaderItem title="about" />
          </div>
          <div
            onClick={() => {
              setToggle(false)
              scrollToRef(skillsRef)
            }}
          >
            <HeaderItem title="skills" />
          </div>
          <div
            onClick={() => {
              setToggle(false)
              scrollToRef(workRef)
            }}
          >
            <HeaderItem title="work" />
          </div>
          <div
            onClick={() => {
              setToggle(false)
              scrollToRef(contactRef)
            }}
          >
            <HeaderItem title="contact" />
          </div>
        </div>
      </nav>
      <div
        className="fixed z-10 w-screen h-screen bg-black opacity-80 md:hidden"
        onClick={() => setToggle(false)}
      />
    </>
  )
}

export default SideDrawer
