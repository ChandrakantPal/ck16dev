import HeaderItem from './HeaderItem'

const SideDrawer = ({ setToggle }) => {
  return (
    <>
      <nav className="fixed right-0 z-20 w-40 h-screen md:hidden">
        <div className="flex flex-col items-center justify-around w-full h-full py-20 ml-auto bg-black border-l border-gray-900 shadow-inner">
          <HeaderItem title="about" />
          <HeaderItem title="skills" />
          <HeaderItem title="work" />
          <HeaderItem title="contact" />
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
