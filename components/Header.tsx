import HeaderItem from './HeaderItem'
import Logo from './Logo'

const Header = () => {
  return (
    <header className="flex flex-col flex-wrap items-start p-4 md:justify-between sm:flex-row sm:justify-center">
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
