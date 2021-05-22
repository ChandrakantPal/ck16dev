import { FC } from 'react'

interface HeaderItemProps {
  title: string
}

const HeaderItem: FC<HeaderItemProps> = ({ title }) => {
  return (
    <p className="mx-2 text-xl font-medium hover:text-green-500">
      cd ./{title}
    </p>
  )
}

export default HeaderItem
