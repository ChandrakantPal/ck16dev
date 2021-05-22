import HeaderItem from './HeaderItem'
import Logo from './Logo'

const Header = () => {
  return (
    <header className="flex flex-wrap items-start justify-between p-4">
      <Logo />
      <div className="flex">
        <HeaderItem title="about" />
        <HeaderItem title="skills" />
        <HeaderItem title="work" />
        <HeaderItem title="contact" />
      </div>
    </header>
  )
}

export default Header
