import HeaderItem from './HeaderItem'
import Logo from './Logo'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex flex-col flex-wrap items-start h-auto p-4 md:justify-between sm:flex-row sm:justify-center">
      <Logo />
      <div className="w-full my-4 border-t border-dashed md:hidden" />
      <div className="flex items-center justify-center my-2 md:m-0">
        <HeaderItem title="about" />
        <HeaderItem title="skills" />
        <HeaderItem title="work" />
        <HeaderItem title="contact" />
      </div>
    </header>
  )
}

export default Header
