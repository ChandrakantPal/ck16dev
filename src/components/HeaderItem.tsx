import { FC } from 'react'

interface HeaderItemProps {
  title: string
}

const HeaderItem: FC<HeaderItemProps> = ({ title }) => {
  return (
    <div className="flex ml-4 text-xl font-medium lg:mr-4 hover:text-green-500">
      <p className="text-green-500 mr-0.5">cd </p> <p>./{title}</p>
    </div>
  )
}

export default HeaderItem
