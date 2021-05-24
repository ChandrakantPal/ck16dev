import HeaderItem from './HeaderItem'
import Logo from './Logo'

const Header = () => {
  return (
    <header className="flex flex-col flex-wrap items-start justify-between p-4 sm:flex-row">
      <Logo />
      <div className="flex my-6 md:m-0">
        <HeaderItem title="about" />
        <HeaderItem title="skills" />
        <HeaderItem title="work" />
        <HeaderItem title="contact" />
      </div>
    </header>
  )
}

export default Header
