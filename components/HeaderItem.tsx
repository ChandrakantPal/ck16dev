import { FC } from 'react'

interface HeaderItemProps {
  title: string
}

const HeaderItem: FC<HeaderItemProps> = ({ title }) => {
  return (
    <div className="flex mr-1 text-xs font-medium md:mx-2 md:text-xl hover:text-green-500">
      <p className="text-green-500 mr-0.5">cd </p> <p>./{title}</p>
    </div>
  )
}

export default HeaderItem
